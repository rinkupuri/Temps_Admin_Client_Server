import path from "path";
import fs from "fs";
import { parentPort, workerData } from "worker_threads";
import csvtojson from "csvtojson";
import download from "download";
import prismaClient from "../prisma/prismaClient";

const processCSV = async (csvFilePath: string) => {
  console.log(`Processing file: ${csvFilePath}`);

  try {
    // Read and parse CSV file
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
      if (!modelName) {
        return;
      }
      if (!modelName || !image || !mrp || !brand || isNaN(parseFloat(mrp))) {
        // @ts-ignore
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
        if (isExist) {
          alreadyExist += 1;
          return;
        }

        // Download and save image
        const imageData = await download(image.trim());
        const imageName = `${brand
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

        // Create product in the database
        await prismaClient.product.create({
          data: {
            brand,
            modelName,
            mrp: parseFloat(mrp),
            image: `/images/${imageName}`,
            stockId: {
              create: {
                ddnStock: 0,
                dlStock: 0,
                godwanStock: 0,
                ibStock: 0,
                mainStock: 0,
                mtStock: 0,
                smapleLine: 0,
              },
            },
          },
        });

        successfullyCreated += 1;
      } catch (error) {
        console.error(`Error processing line ${index + 2}:`, error.message);
        // @ts-ignore
        errorArray.push({ lineNumber: index + 2, error: error.message });
      }
    });
    await Promise.all(result);

    // Delete processed CSV file
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
      errorArray: error,
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
