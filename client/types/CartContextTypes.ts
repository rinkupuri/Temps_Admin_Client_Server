import { cart } from "./ProductCardTypes";

export interface Props {
  children: React.ReactNode;
}

export interface cartContextType {
  cart: cart[];
  setCart: (cart: cart[]) => void;
}
