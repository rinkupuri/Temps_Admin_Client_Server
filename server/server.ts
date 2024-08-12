import express, { Request, Response } from "express";
import productRoute from "./routes/product.routes";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import dotEnv from "dotenv";
import cors from "cors";
import cartRoute from "./routes/cart.routes";
const app = express();
import http from "http";
import fs from "fs";
import inventry from "./routes/inventry.routes";
import { serverAliveCron } from "./cron/health";
import exportSheet from "./routes/export.routes";
import path from "path";
import { productImport } from "./cron/product.cron";
import { inventryCorn } from "./cron/inventry.cron";
import sharp from "sharp";
const server = http.createServer(app);

app.use("/images", async (req, res, next) => {
  console.log(req.url);
  const filePath = path.join(
    __dirname,
    "images",
    req.url.split("?")[0].toString()
  );
  const { w, h } = req.query; // Width and height from query parameters
  console.log(req.query);

  if (fs.existsSync(filePath)) {
    // Check if the file is a PNG and the resize parameters are provided
    if (filePath.endsWith(".png")) {
      try {
        // Resize the image based on query parameters
        const width = parseInt(w as string) || null;
        const height = parseInt(h as string) || null;
        const bufferImageData = await sharp(filePath)
          .resize(width, height, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          }) // Resize with provided width and height
          .toBuffer();

        // Set the response headers and send the resized image
        res.setHeader("Content-Type", "image/png");
        return res.send(bufferImageData);
      } catch (error) {
        console.error("Error processing the image:", error);
        return res.status(500).send("Error processing the image.");
      }
    }
  }

  next(); // Proceed to serve the file normally if no modifications are needed
});


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
inventryCorn();
productImport();

// Use body-parser middleware to parse JSON and urlencoded form data
app.use(express.json());

// Use cookie-parser middleware to parse cookies
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to Temps APi" });
});







// product Routes used

app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/inventry", inventry);
app.use("/api/v1/sheet", exportSheet);

server.listen(process.env.PORT || 80, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
