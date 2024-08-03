const prismaClient = require("../prisma/PrismaClientWorker.ts");
const { parentPort, workerData } = require("worker_threads");
const csvtojson = require("csvtojson");
const fs = require("fs");
const download = require("download");

const processCSV = async (csvFilePath) => {
  console.log(csvFilePath);
  try {
    const csvData = await fs.promises.readFile(csvFilePath, "utf-8");
    const json = await csvtojson().fromString(csvData);
    const errorArray = [];
    let succesfullyCreate = 0;
    let AlreadyExist = 0;
    console.log(json);
    for (const [index, value] of json.entries()) {
      // required fields validating

      if (
        !value.modelName ||
        !value.mrp ||
        !value.image ||
        !value.brand ||
        isNaN(parseInt(value.mrp))
      ) {
        // @ts-ignorecls
        errorArray.push({
          lineNumber: index + 2,
          error: "Data in not compelte",
        });
        continue;
      }
      try {
        // Checking Product already exist or not

        const isExist = await prismaClient.product.findUnique({
          where: { modelName: value.modelName },
        });
        if (isExist) {
          AlreadyExist += 1;
          continue;
        }

        const data = await download(value.image.trim());

        const imageName = `${value.brand
          .trim()
          .replace(/\s/g, "_")
          .toLowerCase()}/${value.modelName}.jpg`;

        // saving file in dir
        await fs.writeFile(`./images/${imageName}`, data, async (err) => {
          if (err) {
            console.log(err);
            value.image = "";
            errorArray.push({
              lineNumber: index + 2,
              error: "Data in not compelte",
            });
          } else {
            console.log("image saved");
            value.image = `${process.env.HOST_URL}/images/${imageName}`;
            // Mongo Db product Create code
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
        });

        console.log(value.image);
      } catch (error) {
        errorArray.push({ lineNumber: index + 2, error: error.message });
        continue;
      }
    }

    // deleting saved csv file

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
