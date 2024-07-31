const prismaClient = require("../prisma/PrismaClientWorker.ts");
const ExcelJs = require("exceljs");
const { workerData, parentPort } = require("worker_threads");

const exportCsv = async ({ workerData }) => {
  const { sheetName, brandName } = workerData;
  console.log({ sheetName, name: brandName.replace(/\_/g, " ").toLowerCase() });
  const product = await prismaClient.product.findMany({
    where: {
      AND: [
        {
          brand: {
            equals: brandName.replace(/\_/g, " ").toLowerCase(),
            mode: "insensitive",
          },
        },
        {
          totalStock: {
            gt: 0,
          },
        },
      ],
    },
  });

  console.log({
    product: product.length,
    location: "worker",
  });

  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");
  worksheet.columns = [
    { header: "Image", key: "image", width: 30 },
    { header: "Model No.", key: "id", width: 10 },
    { header: "Brand", key: "name", width: 10 },
    { header: "MRP", key: "email", width: 10 },
  ];

  product.map((item, index) => {
    console.log(`${item.image.replace(`${process.env.HOST_URL}/`, "")}`);
    const imageId = workbook.addImage({
      filename: `${item.image.replace(`${process.env.HOST_URL}/`, "")}`,
      extension: "png",
    });
    const row = worksheet.addRow({
      id: item.modelName,
      name: item.brand,
      email: item.mrp,
    });
    row.height = 185;

    worksheet.addImage(imageId, {
      // @ts-ignore
      tl: { col: 0.5, row: index + 1.05 },
      // @ts-ignore
      ext: { height: 180, width: 180 },

      editAs: "oneCell",
    });
  });
  console.log("check");
  await workbook.xlsx.writeFile(
    `./public/csv/${sheetName.replace(/\s/g, " ")}.xlsx`
  );
};

exportCsv({ workerData })
  .then(() => {
    if (parentPort) {
      parentPort.postMessage({
        success: true,
        message: "Exported successfully",
        link: `${process.env.HOST_URL}/csv/${workerData.sheetName.replace(
          /\s/g,
          " "
        )}.xlsx`,
      });
    }
  })
  .catch((error) => {
    if (parentPort) {
      parentPort.postMessage(error);
    }
  });
