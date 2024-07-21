import express, { Request, Response } from "express";
import productRoute from "./routes/product.routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import dotEnv from "dotenv";
import multer from "multer";
const app = express();

// All milddlewares

dotEnv.config();
connectDB();


// Use body-parser middleware to parse JSON and urlencoded form data
app.use(express.json());

// Use cookie-parser middleware to parse cookies
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to Temps APi");
});

// product Routes used

app.use("/api/v1/product", productRoute);

app.listen(8000, () => {
  console.log("Server Listinging");
});
