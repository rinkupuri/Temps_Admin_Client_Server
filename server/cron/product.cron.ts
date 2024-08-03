import cron from "node-cron";
import { downloadAndSaveCSV, runWorker } from "../functions/cron.functions";
import { urlsAndPaths, workerDataArray } from "../Data/cron.array";

export const productImport = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await Promise.all(
        urlsAndPaths.map(({ url, filePath }) =>
          downloadAndSaveCSV(url, filePath)
        )
      );
      console.log("All CSV files downloaded and saved.");
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });

  cron.schedule("* * * * *", async () => {
    runWorkersSequentially()
      .then(() => {
        console.log("All workers have completed.");
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
