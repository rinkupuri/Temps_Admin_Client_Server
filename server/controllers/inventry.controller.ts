import { Request, Response } from "express";
import path from "path";
import { Worker } from "worker_threads";

export const updateInventryData = async (req: Request, res: Response) => {
  const worker = new Worker(
    path.resolve(__dirname, "../Workers/inventry.worker.ts"),
    {
      workerData: { csvFilePath: req.file.path },
    }
  );
  worker.on("message", (result) => {
    if (result?.error) {
      res.status(500).json({ error: result.error });
    } else {
      res.status(200).json(result);
    }
  });
  worker.on("error", (error) => {
    console.error("Worker error:", error);
    res.status(500).json({ error: "An error occurred in the worker thread." });
  });

  worker.on("exit", (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
      res.status(500).json({ error: "Worker stopped with an error." });
    }
  });
};
