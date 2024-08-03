const path = require("path");
const fs = require("fs");
const { parentPort, workerData } = require("worker_threads");
const csvtojson = require("csvtojson");
const download = require("download");
const prismaClient = require("../prisma/PrismaClientWorker.ts");

const processCSV = async (csvFilePath) => {
  console.log(`Processing file: ${csvFilePath}`);

  try {
    // Read and parse CSV file
    const csvData = await fs.promises.readFile(csvFilePath, "utf-8");
    const json = await csvtojson().fromString(csvData);
    const errorArray = [];
    let successfullyCreated = 0;
    let alreadyExist = 0;

    console.log(json);

    for (const [index, value] of json.entries()) {
      const { modelName, image, mrp, brand } = value;

      // Validate required fields
      if (!modelName || !image || !mrp || !brand || isNaN(parseFloat(mrp))) {
        errorArray.push({
          lineNumber: index + 2,
          error: "Data is incomplete",
        });
        continue;
      }

      try {
        // Check if product already exists
        const isExist = await prismaClient.product.findUnique({
          where: { modelName },
        });
        if (isExist) {
          alreadyExist += 1;
          continue;
        }

        // Download and save image
        const imageData = await download(image.trim());
        const imageName = `${brand
          .trim()
          .replace(/\s/g, "_")
          .toLowerCase()}/${modelName}.jpg`;
        const filePath = path.join(
          __dirname,
          `../images/${brand.trim().replace(/\s/g, "_").toLowerCase()}`,
          imageName
        );
        const directoryPath = path.dirname(filePath);

        // Create directory if not exists
        if (!fs.existsSync(directoryPath)) {
          fs.mkdirSync(directoryPath, { recursive: true });
          console.log("Directory created:", directoryPath);
        }

        // Write image file
        await fs.promises.writeFile(filePath, imageData);
        console.log("Image saved:", filePath);

        // Create product in the database
        await prismaClient.product.create({
          data: {
            brand,
            modelName,
            mrp: parseFloat(mrp),
            image: `${process.env.HOST_URL}/images/${imageName}`,
            stockId: {
              create: {
                ddnStock: 0,
                dlStock: 0,
                godwanStock: 0,
                ibStock: 0,
                mainStock: 0,
                mtStock: 0,
                sampleLine: 0, // Fixed typo here
              },
            },
          },
        });

        successfullyCreated += 1;
      } catch (error) {
        errorArray.push({ lineNumber: index + 2, error: error.message });
      }
    }

    // Delete processed CSV file
    await fs.promises.unlink(csvFilePath);
    console.log("CSV file deleted:", csvFilePath);

    return {
      successfullyCreated,
      alreadyExist,
      errorArray,
    };
  } catch (error) {
    console.error("Error processing CSV:", error.message);
    return {
      successfullyCreated: 0,
      alreadyExist: 0,
      errorArray: [{ lineNumber: -1, error: error.message }],
    };
  }
};

// Process CSV and send result to parent port
processCSV(workerData.csvFilePath)
  .then((result) => {
    parentPort?.postMessage({ result });
  })
  .catch((err) => {
    parentPort?.postMessage({ error: err.message });
  });
