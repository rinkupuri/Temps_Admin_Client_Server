import csv from "csvtojson";
import prismaClient from "../prisma/prismaClient";
import fs from "fs";
import { workerData, parentPort } from "worker_threads";

// Helper function to split an array into chunks
const chunkArray = (array: any[], chunkSize: number) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const processOfferCSV = async (csvFilePath: string) => {
  try {
    const jsonArray = await csv().fromFile(csvFilePath);

    let successful = 0;
    let notExist = 0;
    let errorArray = [];

    // Reset the consumerOffer field for all products
    await prismaClient.product.updateMany({
      where: {},
      data: { consumerOffer: 0 },
    });

    // Split the data into smaller chunks (e.g., 50 rows per chunk)
    const chunkSize = 50;
    const dataChunks = chunkArray(jsonArray, chunkSize);

    // Process each chunk in parallel
    for (const chunk of dataChunks) {
      const promises = chunk.map(async (value, index) => {
        const rowNumber = jsonArray.indexOf(value) + 2; // Actual row number
        const { model, offer } = value;

        // Validate row data
        if (!model || !offer || Number.isNaN(parseInt(offer))) {
          errorArray.push({
            error: "Invalid data format",
            row: rowNumber,
          });
          return;
        }

        // Check if the product exists in the database
        const isExist = await prismaClient.product.findUnique({
          where: { modelName: model },
        });

        if (isExist) {
          // Update the product with the offer
          await prismaClient.product.update({
            where: { modelName: model },
            data: { consumerOffer: parseInt(offer) },
          });
          successful++;
          console.log(`Updated ${model}`);
        } else {
          errorArray.push({
            error: "Product not found " + model,
            row: rowNumber,
          });
          notExist++;
        }
      });

      // Wait for all promises in the chunk to complete
      await Promise.all(promises);
    }

    // Delete the file after processing
    fs.unlink(csvFilePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    // Return the final result
    return {
      successful,
      notExist,
      errorArray,
    };
  } catch (err) {
    console.log("Error:", err);
    return {
      message: "Please Check file Format OR Internal Server Error",
    };
  }
};

// Start processing the CSV file
processOfferCSV(workerData.csvFilePath)
  .then((res) => {
    parentPort.postMessage(res); // Send results back to parent thread
  })
  .catch((err) => {
    parentPort.postMessage(err); // Send errors back to parent thread
  });
