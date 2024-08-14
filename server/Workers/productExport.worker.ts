import prismaClient from "../prisma/prismaClient";
import { parentPort } from "worker_threads";

const allOrderExport = async () => {
  const products = await prismaClient.product.findMany();
  const csvData = products.map((product) => ({
    modelName: product.modelName,
    mrp: product.mrp,
    image: product.image,
    brand: product.brand,
  }));
  return csvData;
};

allOrderExport()
  .then((result) => {
    parentPort?.postMessage({ result });
  })
  .catch((err) => parentPort?.postMessage({ error: err.message }));
