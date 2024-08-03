import { Request, Response } from "express";
import path from "path";
import { Worker } from "worker_threads";
import { AsyncWrapper } from "../Error/AsyncWrapper";
export const exportSheet = AsyncWrapper(async (req: Request, res: Response) => {
  const { sheetName, brandName } = req.query;
  if (sheetName === undefined || brandName === undefined) {
    return res.status(400).json({ message: "Missing required parameters" });
  }
  const workerData = { sheetName, brandName };
  const worker = new Worker(
    path.resolve(__dirname, "../Workers/sheet.worker.ts"),
    {
      workerData,
    }
  );

  worker.on("message", (message) => {
    console.log(message);
    res.status(200).json(message);
  });
  worker.on("error", (error) => {
    res.status(500).json({ message: error.message });
  });
  worker.on("exit", (code) => {
    if (code !== 0) {
      res
        .status(500)
        .json({ message: "Worker stopped with exit code " + code });
    }
  });
});
