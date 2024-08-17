import prismaClient from "../prisma/prismaClient";
import { parentPort, workerData } from "worker_threads";
import csvtojson from "csvtojson";
import fs from "fs";

const processCSV = async (csvFilePath: string) => {
  try {
    const csvData = await fs.promises.readFile(csvFilePath, "utf-8");
    const json = await csvtojson().fromString(csvData);
    const errorArray = [];
    let succesfullyUpadte = 0;
    let NotExist = 0;
    let NoInventryArry: string[] = [];

    const result = json.map(async (value) => {
      if (!parseInt(value["Total"])) {
        NoInventryArry.push(value["Model No."]);
        return;
      }
      const isExist = await prismaClient.product.findUnique({
        where: { modelName: value["Model No."] },
      });
      if (!isExist) {
        NotExist += 1;
        return console.log(value["Model No."]);
      }
      await prismaClient.product.update({
        where: { id: isExist.id },
        data: { totalStock: parseInt(value["Total"]) || 0 },
      });
      await prismaClient.stock.update({
        where: { productId: isExist.id },
        data: {
          ddnStock: parseInt(value["DDN Stock"]) || 0,
          dlStock: parseInt(value["DL Stock"]) || 0,
          godwanStock: parseInt(value["Godwan"]) || 0,
          ibStock: parseInt(value["IB Stock"]) || 0,
          mainStock: parseInt(value["Main"]) || 0,
          mtStock: parseInt(value["MT Stock"]) || 0,
          smapleLine: parseInt(value["Sample Line"]) || 0,
        },
      });

      succesfullyUpadte += 1;
      return `Done ${value["Model No."]}`;
    });
    const results = await Promise.all(result);

    const leftProduct = await prismaClient.product.findMany({
      where: {
        totalStock: {
          gt: 0,
        },
      },
    });

    for (const [index, value] of leftProduct.entries()) {
      if (NoInventryArry.includes(value.modelName)) {
        await prismaClient.product.update({
          where: { id: value.id },
          data: { totalStock: 0 },
        });
        await prismaClient.stock.update({
          where: { productId: value.id },
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
      }
    }

    console.log(workerData.csvFilePath);

    fs.unlinkSync(workerData.csvFilePath);
    return {
      succesfullyUpadte,
      NotExist,
      errorArray,
    };
  } catch (error) {
    console.log({
      location: "Inventry Worker",
      error: error.message,
    });
  }
};

processCSV(workerData.csvFilePath)
  .then((result) => {
    parentPort?.postMessage({ result });
  })
  .catch((err) => parentPort?.postMessage({ error: err.message }));
