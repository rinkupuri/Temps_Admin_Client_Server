const prismaClient = require("../prisma/PrismaClientWorker.ts");
const { parentPort, workerData } = require("worker_threads");
const csvtojson = require("csvtojson");
const fs = require("fs");

const processCSV = async (csvFilePath) => {
  try {
    const csvData = await fs.promises.readFile(csvFilePath, "utf-8");
    const json = await csvtojson().fromString(csvData);
    const errorArray = [];
    let succesfullyUpadte = 0;
    let NotExist = 0;

    for (const [index, value] of json.entries()) {
      const isExist = await prismaClient.product.findUnique({
        where: { modelName: value.modelName },
      });
      if (!isExist) {
        NotExist += 1;
        continue;
      }
      await prismaClient.product.update({
        where: { id: isExist.id },
        data: {
          stockId: {
            update: {
              ddnStock: parseInt(value.ddnStock) || 0,
              dlStock: parseInt(value.dlStock) || 0,
              godwanStock: parseInt(value.godwan) || 0,
              ibStock: parseInt(value.ibStock) || 0,
              mainStock: parseInt(value.main) || 0,
              mtStock: parseInt(value.mtStock) || 0,
              smapleLine: parseInt(value.smapleLine) || 0,
            },
          },
        },
      });

      succesfullyUpadte += 1;
    }

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
