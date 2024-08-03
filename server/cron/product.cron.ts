import axios from "axios";
import cron from "node-cron";
import download from "download";
import fs from "fs";
import { Worker } from "worker_threads";

export const productImport = () => {
  cron.schedule("* * * * *", async () => {
    const data = await download(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRheXxtxUyyhKUqnxERRT5M0VfzMkwUo5piQwZKUYYePoeGFfxZQJmKK3FG-kJ4wlnCCYNT3xKp9SbS/pub?gid=1521387097&single=true&output=csv"
    );
    await fs.writeFileSync("csv/Just_Cavalli.csv", data);
    const Guess = await download(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRheXxtxUyyhKUqnxERRT5M0VfzMkwUo5piQwZKUYYePoeGFfxZQJmKK3FG-kJ4wlnCCYNT3xKp9SbS/pub?gid=1396035864&single=true&output=csv"
    );
    await fs.writeFileSync("csv/Guess.csv", Guess);
    const GC = await download(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRheXxtxUyyhKUqnxERRT5M0VfzMkwUo5piQwZKUYYePoeGFfxZQJmKK3FG-kJ4wlnCCYNT3xKp9SbS/pub?gid=417366808&single=true&output=csv"
    );
    await fs.writeFileSync("csv/GC.csv", GC);
    const DW = await download(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRheXxtxUyyhKUqnxERRT5M0VfzMkwUo5piQwZKUYYePoeGFfxZQJmKK3FG-kJ4wlnCCYNT3xKp9SbS/pub?gid=33269888&single=true&output=csv"
    );
    await fs.writeFileSync("csv/DW.csv", DW);
    const Just_Cavalli = await download(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRheXxtxUyyhKUqnxERRT5M0VfzMkwUo5piQwZKUYYePoeGFfxZQJmKK3FG-kJ4wlnCCYNT3xKp9SbS/pub?gid=1521387097&single=true&output=csv"
    );
    await fs.writeFileSync("csv/Just_Cavalli.csv", Just_Cavalli);
    const RC_BY_RC = await download(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRheXxtxUyyhKUqnxERRT5M0VfzMkwUo5piQwZKUYYePoeGFfxZQJmKK3FG-kJ4wlnCCYNT3xKp9SbS/pub?gid=1002226490&single=true&output=csv"
    );
    await fs.writeFileSync("csv/RC_BY_RC.csv", RC_BY_RC);
    const RC_BY_FM = await download(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRheXxtxUyyhKUqnxERRT5M0VfzMkwUo5piQwZKUYYePoeGFfxZQJmKK3FG-kJ4wlnCCYNT3xKp9SbS/pub?gid=1002226490&single=true&output=csv"
    );
    await fs.writeFileSync("csv/RC_BY_FM.csv", RC_BY_FM);
    const AX = await download(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRheXxtxUyyhKUqnxERRT5M0VfzMkwUo5piQwZKUYYePoeGFfxZQJmKK3FG-kJ4wlnCCYNT3xKp9SbS/pub?gid=556783808&single=true&output=csv"
    );
    await fs.writeFileSync("csv/AX.csv", AX);
    const EA = await download(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRheXxtxUyyhKUqnxERRT5M0VfzMkwUo5piQwZKUYYePoeGFfxZQJmKK3FG-kJ4wlnCCYNT3xKp9SbS/pub?gid=1958438297&single=true&output=csv"
    );
    await fs.writeFileSync("csv/EA.csv", EA);
    const Fossil = await download(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRheXxtxUyyhKUqnxERRT5M0VfzMkwUo5piQwZKUYYePoeGFfxZQJmKK3FG-kJ4wlnCCYNT3xKp9SbS/pub?gid=272231565&single=true&output=csv"
    );
    await fs.writeFileSync("csv/Fossil.csv", Fossil);
    const MK = await download(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRheXxtxUyyhKUqnxERRT5M0VfzMkwUo5piQwZKUYYePoeGFfxZQJmKK3FG-kJ4wlnCCYNT3xKp9SbS/pub?gid=1752270278&single=true&output=csv"
    );
    await fs.writeFileSync("csv/MK.csv", MK);
    const Versace = await download(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRheXxtxUyyhKUqnxERRT5M0VfzMkwUo5piQwZKUYYePoeGFfxZQJmKK3FG-kJ4wlnCCYNT3xKp9SbS/pub?gid=1457340980&single=true&output=csv"
    );
    await fs.writeFileSync("csv/Versace.csv", Versace);
  });

  cron.schedule("0 2 * * *", async () => {
    // Just cavalli Worker
    const worker = new Worker("./Workers/product.worker.ts", {
      workerData: { csvFilePath: "csv/Just_Cavalli.csv" },
    });
    worker.on("message", (message) => {
      console.log(message);
    });
    worker.on("error", (error) => {
      console.log(error);
    });
    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log("Worker stopped with exit code " + code);
      }
    });
    // Guess Worker
    const workerGuess = new Worker("./Workers/product.worker.ts", {
      workerData: { csvFilePath: "csv/Guess.csv" },
    });
    workerGuess.on("message", (message) => {
      console.log(message);
    });
    workerGuess.on("error", (error) => {
      console.log(error);
    });
    workerGuess.on("exit", (code) => {
      if (code !== 0) {
        console.log("Worker stopped with exit code " + code);
      }
    });

    // Dw Worker
    const workerDW = new Worker("./Workers/product.worker.ts", {
      workerData: { csvFilePath: "csv/DW.csv" },
    });
    workerDW.on("message", (message) => {
      console.log(message);
    });
    workerDW.on("error", (error) => {
      console.log(error);
    });
    workerDW.on("exit", (code) => {
      if (code !== 0) {
        console.log("Worker stopped with exit code " + code);
      }
    });

    // GC Worker
    const workerGC = new Worker("./Workers/product.worker.ts", {
      workerData: { csvFilePath: "csv/GC.csv" },
    });
    workerGC.on("message", (message) => {
      console.log(message);
    });
    workerGC.on("error", (error) => {
      console.log(error);
    });
    workerGC.on("exit", (code) => {
      if (code !== 0) {
        console.log("Worker stopped with exit code " + code);
      }
    });

    // Just_Cavalli Worker
    const workerJust_Cavalli = new Worker("./Workers/product.worker.ts", {
      workerData: { csvFilePath: "csv/Just_Cavalli.csv" },
    });
    workerJust_Cavalli.on("message", (message) => {
      console.log(message);
    });
    workerJust_Cavalli.on("error", (error) => {
      console.log(error);
    });
    workerJust_Cavalli.on("exit", (code) => {
      if (code !== 0) {
        console.log("Worker stopped with exit code " + code);
      }
    });
    // RC_BY_RC Worker
    const workerRC_BY_RC = new Worker("./Workers/product.worker.ts", {
      workerData: { csvFilePath: "csv/RC_BY_RC.csv" },
    });
    workerRC_BY_RC.on("message", (message) => {
      console.log(message);
    });
    workerRC_BY_RC.on("error", (error) => {
      console.log(error);
    });
    workerRC_BY_RC.on("exit", (code) => {
      if (code !== 0) {
        console.log("Worker stopped with exit code " + code);
      }
    });
    // RC_BY_FM Worker
    const workerRC_BY_FM = new Worker("./Workers/product.worker.ts", {
      workerData: { csvFilePath: "csv/RC_BY_FM.csv" },
    });
    workerRC_BY_FM.on("message", (message) => {
      console.log(message);
    });
    workerRC_BY_FM.on("error", (error) => {
      console.log(error);
    });
    workerRC_BY_FM.on("exit", (code) => {
      if (code !== 0) {
        console.log("Worker stopped with exit code " + code);
      }
    });
    // AX Worker
    const workerAX = new Worker("./Workers/product.worker.ts", {
      workerData: { csvFilePath: "csv/AX.csv" },
    });
    workerAX.on("message", (message) => {
      console.log(message);
    });
    workerAX.on("error", (error) => {
      console.log(error);
    });
    workerAX.on("exit", (code) => {
      if (code !== 0) {
        console.log("Worker stopped with exit code " + code);
      }
    });
    // EA Worker
    const workerEA = new Worker("./Workers/product.worker.ts", {
      workerData: { csvFilePath: "csv/EA.csv" },
    });
    workerEA.on("message", (message) => {
      console.log(message);
    });
    workerEA.on("error", (error) => {
      console.log(error);
    });
    workerEA.on("exit", (code) => {
      if (code !== 0) {
        console.log("Worker stopped with exit code " + code);
      }
    });
    // Fossil Worker
    const workerFossil = new Worker("./Workers/product.worker.ts", {
      workerData: { csvFilePath: "csv/Fossil.csv" },
    });
    workerFossil.on("message", (message) => {
      console.log(message);
    });
    workerFossil.on("error", (error) => {
      console.log(error);
    });
    workerFossil.on("exit", (code) => {
      if (code !== 0) {
        console.log("Worker stopped with exit code " + code);
      }
    });
    // MK Worker
    const workerMK = new Worker("./Workers/product.worker.ts", {
      workerData: { csvFilePath: "csv/MK.csv" },
    });
    workerMK.on("message", (message) => {
      console.log(message);
    });
    workerMK.on("error", (error) => {
      console.log(error);
    });
    workerMK.on("exit", (code) => {
      if (code !== 0) {
        console.log("Worker stopped with exit code " + code);
      }
    });
    // Versace Worker
    const workerVersace = new Worker("./Workers/product.worker.ts", {
      workerData: { csvFilePath: "csv/Versace.csv" },
    });
    workerVersace.on("message", (message) => {
      console.log(message);
    });
    workerVersace.on("error", (error) => {
      console.log(error);
    });
    workerVersace.on("exit", (code) => {
      if (code !== 0) {
        console.log("Worker stopped with exit code " + code);
      }
    });
  });
};
