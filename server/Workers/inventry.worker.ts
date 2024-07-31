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
      if (!parseInt(value["Total"])) {
        console.log(true);
        continue;
      }
      console.log(value["Model No."]);
      const isExist = await prismaClient.product.findUnique({
        where: { modelName: value["Model No."] },
      });
      if (!isExist) {
        NotExist += 1;
        continue;
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
