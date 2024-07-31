import cluster from "cluster";
import { cpus } from "os";
import path from "path";
const numCPUs = cpus().length;

cluster.setupPrimary({
  exec: path.resolve("./server.ts"),
});
for (let i = 0; i < numCPUs; i++) {
  cluster.fork();
}
cluster.on("exit", (worker, code, signal) => {
  console.log(`worker ${worker.process.pid} died`);
});
process.on("uncaughtException", (err) => {
  console.log(err);
});
process.on("unhandledRejection", (err) => {
  console.log(err);
});
