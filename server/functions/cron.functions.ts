import axios from "axios";
import fs from "fs";
import path from "path";
import { Worker } from "worker_threads";

export async function downloadAndSaveCSV(url, filePath) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    await fs.writeFile(filePath, response.data, (err) => {
      if (err) {
        console.log(err);
      }
    });
    console.log(`Downloaded and saved: ${filePath}`);
  } catch (error) {
    console.error(`Error downloading or saving ${filePath}:`, error);
  }
}

export function runWorker(workerData) {
  return new Promise<void>((resolve, reject) => {
    const worker = new Worker(
      path.join(__dirname, "../Workers/product.worker.ts"),
      { workerData }
    );

    worker.on("message", (message) => {
      console.log(message);
    });

    worker.on("error", (error) => {
      console.error(error);
      reject(error);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
        reject(new Error(`Worker stopped with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}
