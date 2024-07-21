"use client";
import { CartProvider } from "@/context/CartContext";

const CartProvidersComp = ({ children }: { children: React.ReactNode }) => {
  return <CartProvider>{children}</CartProvider>;
};

export default CartProvidersComp;
