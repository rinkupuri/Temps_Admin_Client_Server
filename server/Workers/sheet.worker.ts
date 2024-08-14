import path from "path";
import sharp from "sharp";
import prismaClient from "../prisma/prismaClient";
import ExcelJs from "exceljs";
import { workerData, parentPort } from "worker_threads";

const exportCsv = async ({ workerData }) => {
  let { sheetName, brandName, locationQuery } = workerData;

  // managing loaction Query From here
  let locationQueryArray = locationQuery?.split(",");
  console.log(workerData);
  let queryArray = [
    {
      brand: {
        equals: brandName.replace(/\_/g, " ").toLowerCase(),
        mode: "insensitive",
      },
    },
  ];
  let stockQuerry = [];

  if (locationQueryArray?.includes("mt")) {
    stockQuerry.push({
      // @ts-ignore

      mtStock: {
        gt: 0,
      },
    });
  }
  if (locationQueryArray?.includes("ib")) {
    console.log("test passed");
    stockQuerry.push({
      // @ts-ignore

      ibStock: {
        gt: 0,
      },
    });
  }
  if (locationQueryArray?.includes("main")) {
    stockQuerry.push({
      // @ts-ignore

      mainStock: {
        gt: 0,
      },
    });
  }
  if (locationQueryArray?.includes("sl")) {
    stockQuerry.push({
      // @ts-ignore

      smapleLine: {
        gt: 0,
      },
    });
  }
  if (locationQueryArray?.includes("gd")) {
    stockQuerry.push({
      // @ts-ignore

      godwanStock: {
        gt: 0,
      },
    });
  }
  if (locationQueryArray?.includes("ddn")) {
    stockQuerry.push({
      // @ts-ignore

      ddnStock: {
        gt: 0,
      },
    });
  }
  if (locationQueryArray?.includes("dl")) {
    stockQuerry.push({
      // @ts-ignore

      dlStock: {
        gt: 0,
      },
    });
  }

  if (!locationQueryArray) {
    queryArray.push({
      // @ts-ignore
      totalStock: {
        gt: 0,
      },
    });
  } else {
    queryArray.push({
      // @ts-ignore
      stockId: {
        OR: [...stockQuerry],
      },
    });
  }
  console.log(JSON.stringify(queryArray));

  const product = await prismaClient.product.findMany({
    where: {
      // @ts-ignore
      AND: [...queryArray],
    },
  });

  console.log({
    product: product.length,
    location: "worker",
  });

  let workbook = new ExcelJs.Workbook();
  let worksheet = workbook.addWorksheet("Sheet1");
  worksheet.columns = [
    { header: "Image", key: "image", width: 30 },
    { header: "Model No.", key: "id", width: 10 },
    { header: "Brand", key: "name", width: 10 },
    { header: "MRP", key: "email", width: 10 },
    { header: "Offer", key: "offer", width: 10 },
  ];

  for (const [index, item] of product.entries()) {
    console.log(`${item.image.replace(`${process.env.HOST_URL}/`, "")}`);
    let imageBuffer = null;
    let imageId = null;
    try {
      console.log("test Run");
      try {
        imageBuffer = await sharp(
          path.resolve(`${item.image.replace(`${process.env.HOST_URL}/`, "")}`)
        )
          .resize(500, 500, {
            fit: "contain",
            background: {
              r: 255,
              g: 255,
              b: 255,
              alpha: 1,
            },
          })
          .jpeg({ quality: 100 })
          .toBuffer();
        imageId = workbook.addImage({
          buffer: imageBuffer,
          extension: "png",
        });
        imageBuffer = null;
      } catch (error) {
        imageId = workbook.addImage({
          filename: `${item.image.replace(`${process.env.HOST_URL}/`, "")}`,
          extension: "png",
        });
      }
      console.log(index);

      const row = worksheet.addRow({
        id: item.modelName,
        name: item.brand,
        email: item.mrp,
        offer: item.consumerOffer ? item.consumerOffer + "% OFF" : "No Offer",
      });
      row.height = 185;
      row.alignment = { vertical: "middle", horizontal: "center" };

      worksheet.addImage(imageId, {
        // @ts-ignore
        tl: { col: 0.5, row: index + 1.05 },
        // @ts-ignore
        ext: { height: 180, width: 180 },

        editAs: "oneCell",
      });
    } catch (error) {
      console.log({
        error,
        location: "Sheet Export Worker",
      });
      continue;
    }
  }
  await workbook.xlsx.writeFile(
    path.resolve(`public/csv/${sheetName.replace(/\s/g, "_")}.xlsx`)
  );
  // Clear workbook and worksheet objects
  workbook.removeWorksheet(worksheet.id);
  worksheet = null;
  workbook = null; // Free memory
  // Optionally trigger garbage collection
  if (global.gc) {
    global.gc(); // Trigger garbage collection
  } else {
    console.warn("Garbage collection is not exposed");
  }
};

exportCsv({ workerData })
  .then(() => {
    if (parentPort) {
      parentPort.postMessage({
        success: true,
        message: "Exported successfully",
        link: `${process.env.HOST_URL}/csv/${workerData.sheetName.replace(
          /\s/g,
          "_"
        )}.xlsx`,
      });
    }
  })
  .catch((error) => {
    if (parentPort) {
      parentPort.postMessage(error);
    }
  });
