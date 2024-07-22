import express from "express";
import { checkCartToken } from "../middlewares/cart.middleware";
import { addToCart, getCart } from "../controllers/cart.controllers";
const router = express.Router();

router.post("/addItem", checkCartToken, addToCart);
router.get("/get", checkCartToken, getCart);

export default router;
