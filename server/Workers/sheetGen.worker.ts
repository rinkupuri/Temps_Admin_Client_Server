import path from "path";
import sharp from "sharp";
import prismaClient from "../prisma/prismaClient";
import ExcelJs from "exceljs";
import { workerData, parentPort } from "worker_threads";
import fs from "fs";
import csvParser from "csv-parser";

const exportCsv = async ({ workerData }) => {
  const { sheetName, csvFile } = workerData;

  // Parse the uploaded CSV file
  const modelNumbers = [];
  fs.createReadStream(csvFile)
    .pipe(csvParser())
    .on("data", (row) => {
      modelNumbers.push(row["Model No."]); // Assuming the CSV column is 'Model No.'
    })
    .on("end", async () => {
      // Query DB for model numbers
      const products = await prismaClient.product.findMany({
        where: {
          modelName: {
            in: modelNumbers,
          },
        },
      });

      let workbook = new ExcelJs.Workbook();
      let worksheet = workbook.addWorksheet("Sheet1");

      worksheet.columns = [
        { header: "Image", key: "image", width: 30 },
        { header: "Model No.", key: "id", width: 10 },
        { header: "MRP", key: "mrp", width: 10 },
        { header: "Offer", key: "offer", width: 10 },
      ];

      for (const [index, modelNo] of modelNumbers.entries()) {
        const product = products.find((p) => p.modelName === modelNo);

        let imageId = null;
        if (product) {
          let imageBuffer = null;

          // Try to add the image if it exists
          if (product.image) {
            try {
              imageBuffer = await sharp(
                path.join(__dirname, "../../", `${product.image}`)
              )
                .resize(500, 500, {
                  fit: "contain",
                  background: { r: 255, g: 255, b: 255, alpha: 1 },
                })
                .toBuffer();

              imageId = workbook.addImage({
                buffer: imageBuffer,
                extension: "png",
              });
            } catch (err) {}
          }
          const row = worksheet.addRow({
            id: product.modelName,
            mrp: product.mrp,
            offer: product.consumerOffer
              ? `${product.consumerOffer}% OFF`
              : "No Offer",
          });
          row.height = 185;
          row.alignment = { vertical: "middle", horizontal: "center" };

          if (imageId) {
            worksheet.addImage(imageId, {
              tl: { col: 0.5, row: index + 1.05 },
              ext: { height: 180, width: 180 },
              editAs: "oneCell",
            });
          }
        } else {
          // Product not found, leaving Image column blank
          worksheet.addRow({
            id: modelNo,
            mrp: "",
            offer: "",
          }).height = 185;
        }
      }

      const filePath = path.resolve(
        `public/csv/${sheetName.replace(/\s/g, "_")}.xlsx`
      );
      const stream = fs.createWriteStream(filePath);

      await workbook.xlsx.write(stream);

      // Cleanup and memory management
      workbook.removeWorksheet(worksheet.id);
      worksheet = null;
      workbook = null;

      if (global.gc) global.gc(); // Optionally trigger garbage collection

      // Return success message
    })
    .on("error", (error) => {
      if (parentPort) parentPort.postMessage({ error });
    });
  return {
    success: true,
    message: "Exported successfully",
    link: `${process.env.HOST_URL}/csv/${sheetName.replace(/\s/g, "_")}.xlsx`,
  };
};

exportCsv({ workerData })
  .then((res) => {
    if (parentPort) {
      parentPort.postMessage(res);
    }
  })
  .catch((error) => {
    if (parentPort) {
      parentPort.postMessage({ error });
    }
  });
