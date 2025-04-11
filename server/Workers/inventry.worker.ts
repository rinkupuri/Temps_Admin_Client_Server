import prismaClient from "../prisma/prismaClient";
import { parentPort, workerData } from "worker_threads";
import csvtojson from "csvtojson";
import fs from "fs";

// Function to process the CSV file and update inventory records in batches
const processCSV = async (csvFilePath: string) => {
  try {
    const csvData = await fs.promises.readFile(csvFilePath, "utf-8");
    const json = await csvtojson().fromString(csvData);

    const errorArray: string[] = [];
    let successfullyUpdated = 0;
    let notExistCount = 0;
    const noInventoryArray: string[] = [];
    const batchSize = 100; // Batch size for chunk processing

    // Split JSON data into chunks
    for (let i = 0; i < json.length; i += batchSize) {
      const batch = json.slice(i, i + batchSize);

      // Process batch of records
      const updatePromises = batch.map(async (value) => {
        try {
          // Check if the total stock is valid
          const totalStock = parseInt(value["Total"]);
          if (!totalStock) {
            noInventoryArray.push(value["Model No."]);
            return;
          }

          // Check if the product exists
          const product = await prismaClient.product.findUnique({
            where: { modelName: value["Model No."] },
          });

          if (!product) {
            notExistCount += 1;
            errorArray.push(`Product not found: ${value["Model No."]}`);
            return;
          }

          // Update product total stock and stock details
          await prismaClient.product.update({
            where: { id: product.id },
            data: { totalStock },
          });
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
          console.log(value["Model No."], "updated");
          successfullyUpdated += 1;
        } catch (err) {
          errorArray.push(
            `Error updating ${value["Model No."]}: ${err.message}`
          );
        }
      });

      // Await batch processing to control memory usage
      await Promise.all(updatePromises);
    }

    // Update products with no inventory
    const leftProducts = await prismaClient.product.findMany({
      where: { totalStock: { gt: 0 } },
    });

    const productIdsToUpdate = leftProducts
      .filter((product) => noInventoryArray.includes(product.modelName))
      .map((product) => product.id);

    if (productIdsToUpdate.length > 0) {
      await prismaClient.product.updateMany({
        where: { id: { in: productIdsToUpdate } },
        data: { totalStock: 0 },
      });

      await prismaClient.stock.updateMany({
        where: { productId: { in: productIdsToUpdate } },
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

    // Delete the CSV file after processing
    try {
      fs.unlinkSync(csvFilePath);
    } catch (unlinkErr) {
      console.error(`Error deleting file ${csvFilePath}:`, unlinkErr.message);
    }

    // Return the results of the processing
    return {
      successfullyUpdated,
      notExistCount,
      errorArray,
    };
  } catch (error) {
    console.error({ location: "Inventory Worker", error: error.message });
    return { error: error.message };
  }
};

// Execute the CSV processing function and send results back to the parent thread
processCSV(workerData.csvFilePath)
  .then((result) => {
    parentPort?.postMessage({ result });
  })
  .catch((error) => {
    parentPort?.postMessage({ error: error.message });
  });
