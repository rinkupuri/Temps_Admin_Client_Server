import express from "express";
import {
  allProductExport,
  createProduct,
  createProductCSV,
  getBrands,
  getProducts,
  serachProduct,
  updateOffer,
} from "../controllers/products.controller";
import multer from "multer";
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/create", createProduct);
router.post("/createcsv", upload.single("csvData"), createProductCSV);
router.get("/get", getProducts);
router.get("/search", serachProduct);
router.get("/brand", getBrands);
router.get("/exportall", allProductExport);
router.post("/offerupdate", upload.single("csvData"), updateOffer);

export default router;
