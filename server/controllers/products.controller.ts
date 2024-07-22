import { Request, Response } from "express";
import { product } from "../types/product";
import prismaClient from "../prisma/prismaClient";
import { AsyncWrapper } from "../Error/AsyncWrapper";
import { Worker } from "worker_threads";
import path from "path";

// create product Route

export const createProduct = AsyncWrapper(
  async (req: Request, res: Response) => {
    const { modelName, image, mrp, brand } = req.body as product;
    if (!modelName && !image && !mrp && !brand) {
      res.status(403).json({
        success: false,
        message: "invalid data",
      });
    }
    const products = await prismaClient.product.create({
      // @ts-ignore
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
            mainStock: 0,
            mtStock: 0,
            smapleLine: 0,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Product Created",
      product: products,
    });
  }
);

// bulk product Create Route

export const createProductCSV = async (req: Request, res: Response) => {
  const worker = new Worker(
    path.resolve(__dirname, "../Workers/product.worker.ts"),
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

export const getProducts = AsyncWrapper(async (req: Request, res: Response) => {
  let { brand: brandQuerry, limit, page } = req.query;
  let whereQuerry = {};

  // handling page querry

  if (!parseInt(page as string)) {
    if (parseInt(page as string) < 0) {
      page = "1";
    }
    page = "1";
  }

  // handeling limit querry

  if (limit && isNaN(parseInt(limit as string)))
    return res
      .status(400)
      .json({ success: false, message: "Invalid limit value" });
  if (parseInt(limit as string) > 100) {
    limit = "100";
  }

  // handling Brand Querry

  if (brandQuerry) {
    if (brandQuerry === "all") {
      whereQuerry = {};
    } else {
      const brandName = brandQuerry
        .toString()
        .toLocaleLowerCase()
        .replace(/\_/g, " ");
      whereQuerry = {
        contains: brandName,
        mode: "insensitive",
      };
    }
  }

  const products = await prismaClient.product.findMany({
    where: {
      AND: [
        { brand: whereQuerry },
        {
          stockId: {
            OR: [
              { ddnStock: { gt: 0 } },
              { dlStock: { gt: 0 } },
              { godwanStock: { gt: 0 } },
              { ibStock: { gt: 0 } },
              { mainStock: { gt: 0 } },
              { mtStock: { gt: 0 } },
              { smapleLine: { gt: 0 } },
            ],
          },
        },
      ],
    },
    take: parseInt(limit as string) || 10, // Default limit is 10
    skip:
      (parseInt(page as string) - 1) * (parseInt(limit as string) || 10) || 0, // Default page is 1
    select: {
      image: true,
      brand: true,
      modelName: true,
      mrp: true,

      stockId: {
        select: {
          ddnStock: true,
          dlStock: true,
          godwanStock: true,
          ibStock: true,
          mainStock: true,
          mtStock: true,
          smapleLine: true,
        },
      },
    },
    orderBy: {
      modelName: "asc", // Example ordering
    },
  });
  res.status(200).json({
    success: true,
    message: "Products fetched",
    products,
  });
});

export const serachProduct = AsyncWrapper(
  async (req: Request, res: Response) => {
    const { query } = req.query;
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
        mrp: true,
        stockId: {
          select: {
            ddnStock: true,
            dlStock: true,
            godwanStock: true,
            ibStock: true,
            mainStock: true,
            mtStock: true,
            smapleLine: true,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      message: "Products fetched",
      products,
    });
  }
);

export const getBrands = AsyncWrapper(async (req: Request, res: Response) => {
  const brands = await prismaClient.product.findMany({
    select: {
      brand: true,
    },
    distinct: ["brand"],
  });
  res.status(200).json({
    success: true,
    message: "Brands fetched",
    brands,
  });
});
