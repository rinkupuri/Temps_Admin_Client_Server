import { parse } from "json2csv";
import { workerData, parentPort } from "worker_threads";
import prismaClient from "../prisma/prismaClient";
import fs from "fs";
import path from "path";

const processModelCsv = async (modelString: string) => {
  if (!modelString) {
    return {
      sucess: false,
      message: "Model string is required",
    };
  }
  try {
    const modelArray = modelString.split("\n");
    const stockArray = [];
    for (const [index, value] of modelArray.entries()) {
      const modelName = value;
      const modelStock = await prismaClient.product.findUnique({
        where: { modelName },
        select: {
          modelName: true,
          totalStock: true,
          stockId: {
            select: {
              ddnStock: true,
              dlStock: true,
              godwanStock: true,
              chdStock: true,
              ibStock: true,
              mainStock: true,
              mtStock: true,
              productId: true,
              smapleLine: true,
            },
          },
        },
      });
      if (!modelStock) continue;
      stockArray.push({
        model: modelStock.modelName,
        Main: modelStock.stockId.mainStock,
        Sample: modelStock.stockId.smapleLine,
        "Model Town": modelStock.stockId.mtStock,
        "GT Road": modelStock.stockId.ibStock,
        Dehradun: modelStock.stockId.ddnStock,
        Delhi: modelStock.stockId.dlStock,
        Godawn: modelStock.stockId.godwanStock,
        Total: modelStock.totalStock,
      });
    }
    const csvdata = parse(stockArray);
    fs.writeFileSync(path.resolve(`public/csv/modelWiseExport.csv`), csvdata);
    return {
      sucess: true,
      message: "Exported successfully",
      link: `${process.env.HOST_URL}/csv/modelWiseExport.csv`,
    };
  } catch (error) {
    console.log(error);
  }
};

processModelCsv(workerData.modelString)
  .then((res) => {
    parentPort?.postMessage(res);
  })
  .catch((err) => {
    parentPort?.postMessage(err);
  });
