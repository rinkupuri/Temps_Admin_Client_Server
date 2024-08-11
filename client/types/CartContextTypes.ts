import { cart, Product, Stock } from "./ProductCardTypes";

export interface Props {
  children: React.ReactNode;
}

export interface cartContextType {
  cart: cart[];
  setCart: (cart: cart[]) => void;
}

export interface cartAPiType {
  model: string;
  fromLocation: string;
  quantity: Stock;
}
