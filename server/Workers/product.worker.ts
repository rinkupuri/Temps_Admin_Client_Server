import path from "path";
import fs from "fs";
import { parentPort, workerData } from "worker_threads";
import csvtojson from "csvtojson";
import download from "download";
import prismaClient from "../prisma/prismaClient";
const processCSV = async (csvFilePath: string) => {
  console.log(`Processing file: ${csvFilePath}`);

  try {
    const csvData = await fs.promises.readFile(
      path.resolve(csvFilePath),
      "utf-8"
    );
    const json = await csvtojson().fromString(csvData);
    const errorArray = [];
    let successfullyCreated = 0;
    let alreadyExist = 0;

    const result = json.map(async (value, index) => {
      const { modelName, image, mrp, brand } = value;

      // Validate required fields
      if (!modelName || !mrp || !brand || isNaN(parseFloat(mrp))) {
        errorArray.push({
          lineNumber: index + 2,
          error: "Data is incomplete",
        });
        return;
      }

      try {
        // Check if product already exists
        const isExist = await prismaClient.product.findUnique({
          where: { modelName },
        });
        if (isExist?.image) {
          alreadyExist += 1;
          return;
        }
        let imageName = "";
        if (image && image.trim()) {
          // If the image URL exists, download the image
          const imageData = await download(image.trim());
          imageName = `${brand
            .trim()
            .replace(/\s/g, "_")
            .toLowerCase()}/${modelName}.png`;
          const filePath = path.resolve(
            `images/${brand.trim().replace(/\s/g, "_").toLowerCase()}`,
            `${modelName}.png`
          );
          const directoryPath = path.dirname(filePath);

          // Create directory if not exists
          if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
            console.log("Directory created:", directoryPath);
          }

          // Write image file
          await fs.promises.writeFile(filePath, imageData);
          console.log("Image saved:", filePath);
        }

        // Perform upsert operation
        await prismaClient.product.upsert({
          where: { modelName }, // Check if the product with the given modelName exists
          update: {
            image: imageName ? `/images/${imageName}` : "", // Update image if available, else set to an empty string
          },
          create: {
            brand,
            modelName,
            mrp: parseFloat(mrp),
            image: imageName ? `/images/${imageName}` : "", // Set image if available, else set to an empty string
            stockId: {
              create: {
                ddnStock: 0,
                dlStock: 0,
                godwanStock: 0,
                ibStock: 0,
                chdStock: 0,
                mainStock: 0,
                mtStock: 0,
                smapleLine: 0,
              },
            },
          },
        });

        successfullyCreated += 1;
      } catch (error) {
        errorArray.push({ lineNumber: index + 2, error: error.message });
      }
    });

    await Promise.all(result);

    await fs.promises.unlink(csvFilePath);
    console.log("CSV file deleted:", csvFilePath);

    return {
      successfullyCreated,
      alreadyExist,
      errorArray: JSON.stringify(errorArray),
    };
  } catch (error) {
    return {
      successfullyCreated: 0,
      alreadyExist: 0,
      errorArray: error.message,
    };
  }
};

// Process CSV and send result to parent port
processCSV(workerData.csvFilePath)
  .then((result) => {
    parentPort?.postMessage({ result });
  })
  .catch((err) => {
    parentPort?.postMessage({ error: err.message });
  });
