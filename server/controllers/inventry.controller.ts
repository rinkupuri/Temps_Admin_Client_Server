import { Request, Response } from "express";
import path from "path";
import { Worker } from "worker_threads";
import { AsyncWrapper } from "../Error/AsyncWrapper";
import prisma from "../prisma/prismaClient";

export const updateInventryData = async (req: Request, res: Response) => {
  const worker = new Worker(
    path.join(__dirname, "../Workers/inventry.worker.js"),
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

export const updateMany = AsyncWrapper(async (req: Request, res: Response) => {
  const data = await prisma.product.updateMany({
    where: {
      totalStock: {
        gt: 0,
      },
    },
    data: {
      totalStock: 0,
    },
  });
  await prisma.stock.updateMany({
    where: {},
    data: {
      ddnStock: 0,
      dlStock: 0,
      godwanStock: 0,
      ibStock: 0,
      mainStock: 0,
      mtStock: 0,
      smapleLine: 0,
    },
  });
  res.status(200).json({ message: "Success" });
});
