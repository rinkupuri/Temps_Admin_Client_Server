import path from "path";
import fs from "fs";
import { parentPort, workerData } from "worker_threads";
import csvtojson from "csvtojson";
import download from "download";
import prismaClient from "../prisma/prismaClient";

const BATCH_SIZE = 50; // Adjust batch size based on performance
const MAX_CONCURRENT_DOWNLOADS = 5; // Limit the number of concurrent downloads

// Helper function to create directories if they don't exist
const ensureDirectoryExists = async (directoryPath: string) => {
  if (!fs.existsSync(directoryPath)) {
    await fs.promises.mkdir(directoryPath, { recursive: true });
    console.log("Directory created:", directoryPath);
  }
};

// Function to process CSV file and update inventory records
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

    for (let i = 0; i < json.length; i += BATCH_SIZE) {
      const batch = json.slice(i, i + BATCH_SIZE);

      // Process each entry in the current batch
      const processPromises = batch.map(async (value, index) => {
        const { modelName, image, mrp, brand } = value;

        // Validate required fields
        if (!modelName || !mrp || !brand || isNaN(parseFloat(mrp))) {
          errorArray.push({
            lineNumber: i + index + 2, // CSV rows are 1-indexed, plus header row
            error: "Data is incomplete",
          });
          return;
        }

        try {
          // Check if product already exists
          const existingProduct = await prismaClient.product.findUnique({
            where: { modelName },
          });

          let imageName = "";
          if (image && image.trim()) {
            try {
              // If the image URL exists, download the image
              const imageData = await download(image.trim());
              imageName = `${brand
                .trim()
                .replace(/\s/g, "_")
                .toLowerCase()}/${modelName}.png`;
              const filePath = path.resolve(`images/${imageName}`);
              const directoryPath = path.dirname(filePath);

              // Ensure directory exists
              await ensureDirectoryExists(directoryPath);

              // Write the image file
              await fs.promises.writeFile(filePath, imageData);
              console.log("Image saved:", filePath);
            } catch (downloadError) {
              console.error(
                `Failed to download image for ${modelName}:`,
                downloadError.message
              );
            }
          }

          if (existingProduct) {
            // Update image if product exists but image is not set
            if (!existingProduct.image) {
              await prismaClient.product.update({
                where: { modelName },
                data: { image: imageName ? `/images/${imageName}` : "" },
              });
              successfullyCreated += 1;
              console.log(`Updated ${modelName}`);
            } else {
              alreadyExist += 1;
              console.log(`${modelName} already exists`);
            }
            return;
          }

          // Perform create operation
          await prismaClient.product.create({
            data: {
              brand,
              modelName,
              mrp: parseFloat(mrp),
              image: imageName ? `/images/${imageName}` : "",
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
          console.log(`Created ${modelName}`);
        } catch (error) {
          errorArray.push({ lineNumber: i + index + 2, error: error.message });
        }
      });

      // Process each batch in parallel, but limit the number of concurrent downloads
      await Promise.all(
        processPromises.map((p, idx) =>
          idx % MAX_CONCURRENT_DOWNLOADS === 0
            ? Promise.all(
                processPromises.slice(idx, idx + MAX_CONCURRENT_DOWNLOADS)
              )
            : p
        )
      );
    }

    // Delete the CSV file after processing
    try {
      await fs.promises.unlink(csvFilePath);
      console.log("CSV file deleted:", csvFilePath);
    } catch (unlinkError) {
      console.error(`Error deleting file ${csvFilePath}:`, unlinkError.message);
    }

    return {
      successfullyCreated,
      alreadyExist,
      errorArray: JSON.stringify(errorArray),
    };
  } catch (error) {
    console.error("Error processing CSV:", error.message);
    return {
      successfullyCreated: 0,
      alreadyExist: 0,
      errorArray: JSON.stringify([{ error: error.message }]),
    };
  }
};

// Execute CSV processing function and send results back to the parent thread
processCSV(workerData.csvFilePath)
  .then((result) => {
    parentPort?.postMessage({ result });
  })
  .catch((error) => {
    parentPort?.postMessage({ error: error.message });
  });
