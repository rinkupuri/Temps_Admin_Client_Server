import express, { Request, Response } from "express";
import productRoute from "./routes/product.routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import dotEnv from "dotenv";
import cors from "cors";
import cartRoute from "./routes/cart.routes";
const app = express();
import http from "http";
const server = http.createServer(app);

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

// Use body-parser middleware to parse JSON and urlencoded form data
app.use(express.json());

// Use cookie-parser middleware to parse cookies
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to Temps APi");
});

// product Routes used
import inventry from "./routes/inventry.routes";

app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/inventry", inventry);

server.listen(process.env.PORT || 80, () => {
  console.log("Server Listinging");
});
