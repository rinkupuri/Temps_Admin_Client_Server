import express, { Request, Response } from "express";
import productRoute from "./routes/product.routes";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import dotEnv from "dotenv";
import cors from "cors";
import cartRoute from "./routes/cart.routes";
const app = express();
import http from "http";
import inventry from "./routes/inventry.routes";
import { serverAliveCron } from "./cron/inventry.cron";
import exportSheet from "./routes/export.routes";
import path from "path";
const server = http.createServer(app);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/csv", express.static(path.join(__dirname, "public/csv")));

// All milddlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "https://temps-admin.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

dotEnv.config();
connectDB();
serverAliveCron();

// Use body-parser middleware to parse JSON and urlencoded form data
app.use(express.json());

// Use cookie-parser middleware to parse cookies
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to Temps APi");
});

// product Routes used

app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/inventry", inventry);
app.use("/api/v1/sheet", exportSheet);

server.listen(process.env.PORT || 80, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
