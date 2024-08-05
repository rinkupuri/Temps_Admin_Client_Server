import axios from "axios";
import cron from "node-cron";
import path from "path";
import { Worker } from "worker_threads";
import fs from "fs";

export const inventryCorn = () => {
  cron.schedule("*/30 * * * *", () => {
    axios
      .get(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vRheXxtxUyyhKUqnxERRT5M0VfzMkwUo5piQwZKUYYePoeGFfxZQJmKK3FG-kJ4wlnCCYNT3xKp9SbS/pub?gid=1627605475&single=true&output=csv"
      )
      .then(async (res) => {
        fs.writeFileSync(
          path.resolve("uploads/inventry.csv"),
          res.data,
          "utf8"
        );
        const worker = new Worker(path.resolve("Workers/inventry.worker.ts"), {
          workerData: {
            csvFilePath: path.resolve("uploads/inventry.csv"),
          },
        });
        worker.on("message", (result) => {
          if (result?.error) {
            console.error(result.error);
          } else {
            console.log(result);
          }
        });
        worker.on("error", (error) => {
          console.error("Worker error:", error);
        });

        worker.on("exit", (code) => {
          if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
          }
        });
      });
  });
};


