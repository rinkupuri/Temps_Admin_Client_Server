import csv from "csvtojson";
import prismaClient from "../prisma/prismaClient";
import fs from "fs";
import { workerData, parentPort } from "worker_threads";
const processOfferCSV = async (csvFilePath: string) => {
  try {
    const jsonArray = await csv().fromFile(csvFilePath);
    let successfull = 0;
    let notExist = 0;
    let errorArray = [];

    await prismaClient.product.updateMany({
      where: {},
      data: { consumerOffer: 0 },
    });

    const result = jsonArray.map(async (value, index) => {
      const { model, offer } = value;

      if (!model || !offer || Number.isNaN(parseInt(offer))) {
        errorArray.push({
          error: "Invalid data format",
          row: index + 2,
        });
        return;
      }

      const isExist = await prismaClient.product.findUnique({
        where: { modelName: model },
      });
      if (isExist) {
        await prismaClient.product.update({
          where: { modelName: model },
          data: { consumerOffer: parseInt(offer) },
        });
        successfull++;
        return `Done ${model}`;
      } else {
        notExist++;
      }
    });
    const results = await Promise.all(result);
    console.log(results);
    fs.unlink(csvFilePath, (err) => {});
    return {
      successfull,
      notExist,
      errorArray,
    };
  } catch (err) {
    console.log(err);
    return {
      message: "Please Check file Formate OR Internal Server Error",
    };
  }
};

processOfferCSV(workerData.csvFilePath)
  .then((res) => {
    parentPort.postMessage(res);
  })
  .catch((err) => {
    parentPort.postMessage(err);
  });
