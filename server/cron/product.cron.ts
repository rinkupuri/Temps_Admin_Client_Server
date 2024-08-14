import cron from "node-cron";
import { downloadAndSaveCSV, runWorker } from "../functions/cron.functions";
import { urlsAndPaths, workerDataArray } from "../Data/cron.array";
import path from "path";

export const productImport = async () => {
  cron.schedule("20 1 * * *", async () => {
    try {
      await Promise.all(
        urlsAndPaths.map(({ url, filePath }) =>
          downloadAndSaveCSV(url, path.resolve(filePath))
        )
      );
      console.log("All CSV files downloaded and saved.");
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });

  cron.schedule("25 1 * * *", async () => {
    runWorkersSequentially()
      .then(() => {
        console.log("All workers have completed.");
        process.exit(0);
      })
      .catch((error) => {
        console.error("Error running workers:", error);
      });
  });
};

async function runWorkersSequentially() {
  for (const workerData of workerDataArray) {
    try {
      await runWorker(workerData);
    } catch (error) {
      console.error(
        `Error running worker for ${workerData.csvFilePath}:`,
        error
      );
    }
  }
}
