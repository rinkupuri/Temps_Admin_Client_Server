const prismaClient = require("../prisma/PrismaClientWorker.ts");
const { parentPort, workerData } = require("worker_threads");
const csvtojson = require("csvtojson");
const fs = require("fs");

const processCSV = async (csvFilePath: string) => {
  try {
    const csvData = await fs.promises.readFile(csvFilePath, "utf-8");
    const json = await csvtojson().fromString(csvData);
    const errorArray = [];
    let succesfullyCreate = 0;
    let AlreadyExist = 0;

    for (const [index, value] of json.entries()) {
      if (
        !value.modelName ||
        !value.main ||
        !value.smapleLine ||
        !value.godwan ||
        !value.ddnStock ||
        !value.dlStock ||
        !value.mtStock ||
        !value.ibStock
      ) {
        // @ts-ignore
        console.log("entered2");
        errorArray.push({
          lineNumber: index + 2,
          error: "Data in not compelte",
        });
        continue;
      }
      const isExist = await prismaClient.product.findUnique({
        where: { modelName: value.modelName },
      });
      if (isExist) {
        AlreadyExist += 1;
        continue;
      }
      await prismaClient.product.create({
        data: {
          brand: value.brand,
          modelName: value.modelName,
          mrp: parseInt(value.mrp),
          image: value.image,
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

      succesfullyCreate += 1;
    }

    fs.unlinkSync(workerData.csvFilePath);
    return {
      succesfullyCreate,
      AlreadyExist,
      errorArray,
    };
  } catch (error) {
    console.log({
      location: "Product Worker",
      error: error.message,
    });
  }
};

processCSV(workerData.csvFilePath)
  .then((result) => {
    parentPort?.postMessage({ result });
  })
  .catch((err) => parentPort?.postMessage({ error: err.message }));
