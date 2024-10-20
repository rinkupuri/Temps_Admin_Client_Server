import { Request, Response } from "express";
import path from "path";
import { Worker } from "worker_threads";
import { AsyncWrapper } from "../Error/AsyncWrapper";
import fs from "fs";
import multer from "multer";

export const exportSheet = AsyncWrapper(async (req: Request, res: Response) => {
  const { sheetName, brandName, locationQuery } = req.query;
  if (sheetName === undefined || brandName === undefined) {
    return res.status(400).json({ message: "Missing required parameters" });
  }
  const workerData = { sheetName, brandName, locationQuery };
  console.log(workerData);
  const worker = new Worker(
    path.join(__dirname, "../Workers/sheet.worker.js"),
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

// Configure multer for handling CSV file uploads
const upload = multer({ dest: "uploads" });

export const createSheet = [
  upload.single("csvData"), // Middleware to handle file upload
  AsyncWrapper(async (req: Request, res: Response) => {
    const csvFilePath = req.file.path; // Store the file path to delete later

    const workerData = {
      sheetName: "sheetName",
      csvFile: csvFilePath, // Pass the uploaded CSV file path to the worker
    };

    console.log("Worker Data:", workerData);

    // Create a new worker
    const worker = new Worker(
      path.join(__dirname, "../Workers/sheetGen.worker.js"),
      {
        workerData,
      }
    );

    // Listen to worker messages and respond to the client
    worker.on("message", (message) => {
      console.log("Worker Message:", message);
      // Delete the CSV file after successful processing
      fs.unlink(csvFilePath, (err) => {
        if (err) {
          console.error("Failed to delete CSV file:", err);
        }
      });
      res.status(200).json(message);
    });

    // Handle worker errors
    worker.on("error", (error) => {
      console.error("Worker Error:", error);
      // Delete the CSV file if an error occurs
      fs.unlink(csvFilePath, (err) => {
        if (err) {
          console.error("Failed to delete CSV file:", err);
        }
      });
      res.status(500).json({ message: error.message });
    });

    // Handle worker exit
    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error("Worker stopped with exit code", code);
        // Delete the CSV file if the worker exits with an error
        fs.unlink(csvFilePath, (err) => {
          if (err) {
            console.error("Failed to delete CSV file:", err);
          }
        });
        res
          .status(500)
          .json({ message: "Worker stopped with exit code " + code });
      }
    });
  }),
];
