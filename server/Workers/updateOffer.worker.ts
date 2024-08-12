const csv = require("csvtojson");
const prismaClient = require("../prisma/PrismaClientWorker.ts");

const { workerData, parentPort } = require("worker_threads");
const processOfferCSV = async (csvFilePath) => {
  try {
    const jsonArray = await csv().fromFile(csvFilePath);
    let successfull = 0;
    let notExist = 0;
    let errorArray = [];

    await prismaClient.product.updateMany({
      where: {},
      data: { consumerOffer: 0 },
    });
    console.log(jsonArray);

    for (const [index, value] of jsonArray.entries()) {
      const { model, offer } = value;

      console.log(value);
      if (!model || !offer || Number.isNaN(parseInt(offer))) {
        errorArray.push({
          error: "Invalid data format",
          row: index + 2,
        });
        continue;
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
      } else {
        notExist++;
      }
    }

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
