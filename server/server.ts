import express, { Request, Response } from "express";
import productRoute from "./routes/product.routes";
import auth from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import dotEnv from "dotenv";
import cors from "cors";
import cartRoute from "./routes/cart.routes";
import http from "http";
import inventry from "./routes/inventry.routes";
import exportSheet from "./routes/export.routes";
import extraData from "./routes/extradata.routes";
import path from "path";
import { productImport } from "./cron/product.cron";
import { inventryCorn } from "./cron/inventry.cron";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./config/SwaggerOtions"; // Adjust path as needed
const app = express();
const server = http.createServer(app);
import webData from "./routes/webData.routes";
import UserRouter from "./routes/user.routes";
import errorHandler from "./Error/ErrorHandler";
import rateLimit from "express-rate-limit";
import { AuthenticatedRequest } from "./types/auth.types";
import { authMiddleware } from "./middlewares/auth.middleware";
import checkPermission from "./middlewares/checkPermission";

// Middleware to resize and compress images
app.use("/api/v1/images", express.static(path.resolve("images")));

app.use("/csv", express.static(path.join(__dirname, "../public/csv")));

// All milddlewares
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://admin.tempslifestyle.com",
      "https://temps-admin.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

dotEnv.config();
connectDB();
inventryCorn();
productImport();

// Use body-parser middleware to parse JSON and urlencoded form data
app.use(express.json());

// Use cookie-parser middleware to parse cookies
app.use(cookieParser());

/**
 * @route   /api/v1/auth
 * @desc    Authentication-related routes
 */
app.use("/api/v1/auth", auth);

app.use(authMiddleware);

// Define a rate limit
const limiter = rateLimit({
  windowMs: 60 * 1000, // 10 second
  max: 10, // Limit each IP to 30 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Send rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req: AuthenticatedRequest) => {
    console.log(req.user.id);
    return req.user ? req.user.id : req.ip; // Use user ID if available, otherwise fallback to IP
  },
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome 2 Temps APi" });
});

// Generate Swagger documentation
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI documentation at /api-docs
app.use(
  "/api-docs",
  checkPermission("admin"),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
);

// product Routes used

/**
 * @route   /api/v1/product
 * @desc    Product-related routes
 */
app.use("/api/v1/product", productRoute);

/**
 * @route   /api/v1/cart
 * @desc    Cart-related routes
 */
app.use("/api/v1/cart", cartRoute);

/**
 * @route   /api/v1/inventry
 * @desc    Inventory-related routes
 */
app.use("/api/v1/inventry", inventry);

/**
 * @route   /api/v1/sheet
 * @desc    Sheet export-related routes
 */
app.use("/api/v1/sheet", exportSheet);

/**
 * @route   /api/v1/webData
 * @desc    Web data-related routes
 */
app.use("/api/v1/webData", webData);
/**
 * @route   /api/v1/user
 * @desc    User Related routes
 */
app.use("/api/v1/user", UserRouter);

app.use("/api/v1/extradata", extraData);

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});
app.use(errorHandler);








server.listen(process.env.PORT || 80, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;
