import prismaClient from "../prisma/prismaClient";
import { parentPort, workerData } from "worker_threads";
import csvtojson from "csvtojson";
import fs from "fs";

// Function to process the CSV file and update inventory records
const processCSV = async (csvFilePath: string) => {
  try {
    // Read and parse the CSV file
    const csvData = await fs.promises.readFile(csvFilePath, "utf-8");
    const json = await csvtojson().fromString(csvData);

    // Initialize counters and arrays for tracking updates and errors
    const errorArray: string[] = [];
    let successfullyUpdated = 0;
    let notExistCount = 0;
    let noInventoryArray: string[] = [];

    // Process each entry in the parsed JSON
    const result = await Promise.all(
      json.map(async (value) => {
        // Check if the total stock is valid
        if (!parseInt(value["Total"])) {
          noInventoryArray.push(value["Model No."]);
          return;
        }

        // Check if the product exists in the database
        const product = await prismaClient.product.findUnique({
          where: { modelName: value["Model No."] },
        });

        // If product does not exist, increment the notExistCount
        if (!product) {
          notExistCount += 1;
          errorArray.push(`Product not found: ${value["Model No."]}`);
          return; // Skip further processing for this entry
        }

        // Update product total stock
        await prismaClient.product.update({
          where: { id: product.id },
          data: { totalStock: parseInt(value["Total"]) || 0 },
        });

        // Update product stock details
        await prismaClient.stock.update({
          where: { productId: product.id },
          data: {
            ddnStock: parseInt(value["DDN Stock"]) || 0,
            dlStock: parseInt(value["DL Stock"]) || 0,
            godwanStock: parseInt(value["Godwan"]) || 0,
            ibStock: parseInt(value["IB Stock"]) || 0,
            chdStock: parseInt(value["CHD Stock"]) || 0,
            mainStock: parseInt(value["Main"]) || 0,
            mtStock: parseInt(value["MT Stock"]) || 0,
            smapleLine: parseInt(value["Sample Line"]) || 0,
          },
        });

        successfullyUpdated += 1;
        return `Updated ${value["Model No."]}`;
      })
    );

    // Update products that are in the noInventoryArray
    const leftProducts = await prismaClient.product.findMany({
      where: { totalStock: { gt: 0 } },
    });

    for (const product of leftProducts) {
      if (noInventoryArray.includes(product.modelName)) {
        await prismaClient.product.update({
          where: { id: product.id },
          data: { totalStock: 0 },
        });
        await prismaClient.stock.update({
          where: { productId: product.id },
          data: {
            ddnStock: 0,
            dlStock: 0,
            godwanStock: 0,
            chdStock: 0,
            ibStock: 0,
            mainStock: 0,
            mtStock: 0,
            smapleLine: 0,
          },
        });
      }
    }

    // Log the path of the processed CSV file
    console.log(`Processed CSV file: ${workerData.csvFilePath}`);

    // Delete the CSV file after processing
    fs.unlinkSync(workerData.csvFilePath);

    // Return the results of the processing
    return {
      successfullyUpdated,
      notExistCount,
      errorArray,
    };
  } catch (error) {
    // Log any errors encountered during processing
    console.error({
      location: "Inventory Worker",
      error: error.message,
    });
    // Send back an error response if needed
    return { error: error.message };
  }
};

// Execute the CSV processing function and send results back to the parent thread
processCSV(workerData.csvFilePath)
  .then((result) => {
    parentPort?.postMessage({ result });
  })
  .catch((error) => {
    // Handle any errors that occur during CSV processing
    parentPort?.postMessage({ error: error.message });
  });
