import mongoose, { Document, mongo, Schema } from "mongoose";
import { AllLocationStock, product } from "../types/product";

interface ICart extends Document {
  product: product;
  cartQTY: AllLocationStock;
}

const AllLocationStock = new Schema({
  mtStock: {
    type: Number,
    default: 0,
  },
  ibStock: {
    type: Number,
    default: 0,
  },
  ddnStock: {
    type: Number,
    default: 0,
  },
  dlStock: {
    type: Number,
    default: 0,
  },
  mainStock: {
    type: Number,
    default: 0,
  },
  smapleLine: {
    type: Number,
    default: 0,
  },
  godwanStock: {
    type: Number,
    default: 0,
  },
});

const cartSchema = new Schema({
  product: {
    ModelNo: {
      type: String,
      require: true,
    },
    brand: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    mrp: {
      type: String,
      require: true,
    },
    totalStock: {
      type: Number,
      default: 0,
    },
    allStock: AllLocationStock,
  },
  cartQTY: AllLocationStock,
});

export default mongoose.model("Cart", cartSchema);
