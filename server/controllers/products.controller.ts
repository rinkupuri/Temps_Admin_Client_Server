import { Request, Response } from "express";
import { product } from "../types/product";
import prismaClient from "../prisma/prismaClient";
import { AsyncWrapper } from "../Error/AsyncWrapper";
import { Worker } from "worker_threads";
import path from "path";
import { AuthenticatedRequest } from "../types/auth.types";
import prisma from "../prisma/prismaClient";
import fs from "fs";

// Route to create a single product
export const createProduct = AsyncWrapper(
  async (req: Request, res: Response) => {
    const { modelName, image, mrp, brand } = req.body as product;

    // Check if all required fields are provided
    if (!modelName && !image && !mrp && !brand) {
      res.status(403).json({
        success: false,
        message: "invalid data",
      });
    }

    // Create a new product entry in the database
    const products = await prismaClient.product.create({
      // @ts-ignore to ignore potential TS errors for relations
      data: {
        brand,
        modelName,
        mrp,
        stockId: {
          create: {
            ddnStock: 0,
            dlStock: 0,
            godwanStock: 0,
            ibStock: 0,
            chdStock: 0,
            mainStock: 0,
            mtStock: 0,
            smapleLine: 0,
          },
        },
      },
    });

    // Return the created product in the response
    res.status(200).json({
      success: true,
      message: "Product Created",
      product: products,
    });
  }
);

// Route to create products in bulk using CSV file upload
export const createProductCSV = async (req: Request, res: Response) => {
  try {
    // Create a new worker thread for handling CSV processing
    const worker = new Worker(
      path.join(__dirname, "../Workers/product.worker.js"),
      { workerData: { csvFilePath: req.file.path } }
    );

    // Listen for messages from the worker and send the result back to the client
    worker.on("message", (result) => {
      if (result?.error) {
        return res.status(500).json({ error: result.error });
      }
      res.status(200).json(result);
    });

    // Handle any errors that occur in the worker
    worker.on("error", (error) => {
      console.error("Worker error:", error);
      res
        .status(500)
        .json({ error: "An error occurred in the worker thread." });
    });

    // Handle worker exit events to catch any non-zero exit codes
    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
        res.status(500).json({ error: "Worker stopped with an error." });
      }
    });
  } catch (error) {
    // Catch and handle any errors that occur during worker creation
    console.error("Error creating worker:", error);
    res.status(500).json({ error: "Failed to start the worker thread." });
  }
};

// Route to fetch products with pagination, brand filtering, and stock availability
export const getProducts = AsyncWrapper(async (req: Request, res: Response) => {
  let { brand: brandQuery, limit, page } = req.query;
  let whereQuery = {};

  // Handle page query
  if (!parseInt(page as string)) {
    if (parseInt(page as string) < 0) {
      page = "1";
    }
    page = "1";
  }

  // Handle limit query
  if (limit && isNaN(parseInt(limit as string)))
    return res
      .status(400)
      .json({ success: false, message: "Invalid limit value" });
  if (parseInt(limit as string) > 100) {
    limit = "100"; // Max limit is 100
  }

  // Handle brand query
  if (brandQuery) {
    if (brandQuery === "all") {
      whereQuery = {};
    } else {
      const brandName = brandQuery
        .toString()
        .toLocaleLowerCase()
        .replace(/\_/g, " ");
      whereQuery = {
        contains: brandName,
        mode: "insensitive",
      };
    }
  }

  // Fetch products matching the query criteria
  const products = await prismaClient.product.findMany({
    where: {
      AND: [
        { brand: whereQuery }, // Apply brand filter if provided
        { totalStock: { gt: 0 } }, // Only get products with stock greater than 0
      ],
    },
    take: parseInt(limit as string) || 10, // Default limit is 10
    skip:
      (parseInt(page as string) - 1) * (parseInt(limit as string) || 10) || 0, // Pagination logic
    select: {
      id: true,
      image: true,
      brand: true,
      modelName: true,
      totalStock: true,
      consumerOffer: true,
      mrp: true,
      stockId: {
        select: {
          ddnStock: true,
          dlStock: true,
          godwanStock: true,
          ibStock: true,
          mainStock: true,
          chdStock: true,
          mtStock: true,
          smapleLine: true,
        },
      },
    },
    orderBy: {
      modelName: "asc", // Order products by modelName
    },
  });

  // Get the total count of products matching the same query
  const count = await prismaClient.product.count({
    where: {
      AND: [{ brand: whereQuery }, { totalStock: { gt: 0 } }],
    },
  });

  // Send response with products and pagination meta
  res.status(200).json({
    success: true,
    message: "Products fetched",
    products,
    meta: {
      totalCount: count,
      currentPage: parseInt(page as string) || 1,
      totalPages: Math.ceil(count / (parseInt(limit as string) || 10)),
      perPage: parseInt(limit as string) || 10,
    },
  });
});

// Route to search products based on brand or model name
export const searchProduct = AsyncWrapper(
  async (req: Request, res: Response) => {
    const { query } = req.query;

    // Fetch products matching the search query
    const products = await prismaClient.product.findMany({
      where: {
        OR: [
          { modelName: { contains: query as string, mode: "insensitive" } },
          { brand: { contains: query as string, mode: "insensitive" } },
        ],
      },
      select: {
        image: true,
        brand: true,
        modelName: true,
        totalStock: true,
        consumerOffer: true,
        mrp: true,
        stockId: {
          select: {
            ddnStock: true,
            dlStock: true,
            godwanStock: true,
            chdStock: true,
            ibStock: true,
            mainStock: true,
            mtStock: true,
            smapleLine: true,
          },
        },
      },
    });

    // Send the found products in the response
    res.status(200).json({
      success: true,
      message: "Products fetched",
      products,
    });
  }
);

// Route to get a list of distinct brands
export const getBrands = AsyncWrapper(async (req: Request, res: Response) => {
  // Get distinct brand names from products
  const brands = await prismaClient.product.findMany({
    select: {
      brand: true,
    },
    distinct: ["brand"], // Ensure unique brand names
  });

  // Send the fetched brands in the response
  res.status(200).json({
    success: true,
    message: "Brands fetched",
    brands,
  });
});

// Route to export all products using worker threads
export const allProductExport = AsyncWrapper(
  async (req: Request, res: Response) => {
    // Create a new worker to handle product export
    const worker = new Worker(
      path.join(__dirname, "../Workers/productExport.worker.js")
    );

    // Listen for messages from the worker and send the result back to the client
    worker.on("message", (result) => {
      if (result?.error) {
        res.status(500).json({ error: result });
      } else {
        res.status(200).json(result);
      }
    });

    // Handle errors in the worker
    worker.on("error", (error) => {
      console.error("Worker error:", error);
      res
        .status(500)
        .json({ error: "An error occurred in the worker thread." });
    });

    // Handle worker exit events
    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
        res.status(500).json({ error: "Worker stopped with an error." });
      }
    });
  }
);

// Route to update product offers using worker threads
export const updateOffer = AsyncWrapper(async (req: Request, res: Response) => {
  const worker = new Worker(
    path.resolve("dist/Workers/updateOffer.worker.js"),
    {
      workerData: { csvFilePath: req.file.path },
    }
  );
  worker.on("message", (result) => {
    if (result?.error) {
      res.status(500).json({ error: result });
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
});

// Delete products by brand name
export const deleteProductsByBrand = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message:
          "Forbidden: You do not have permission to perform this action.",
      });
    }

    const { brandName } = req.params; // Assuming brand name is passed as a URL parameter

    // Delete products with the specified brand name
    const deletedProducts = await prisma.product.deleteMany({
      where: {
        brand: brandName,
      },
    });

    if (deletedProducts.count === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this brand." });
    }

    // Convert brand name to lowercase and replace spaces with underscores for the folder name
    const folderName = brandName.toLowerCase().replace(/\s+/g, "_");
    const folderPath = path.resolve(`images/${folderName}`); // Assuming images are in 'images/' directory

    // Check if the folder exists
    if (fs.existsSync(folderPath)) {
      // Remove the directory and its contents
      fs.rmdirSync(folderPath, { recursive: true }); // Recursive flag to delete all contents
      console.log(`Deleted folder: ${folderPath}`);
    } else {
      console.log(`Folder does not exist: ${folderPath}`);
    }

    return res.status(200).json({
      message: `${deletedProducts.count} products deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting products:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting products." });
  }
};
