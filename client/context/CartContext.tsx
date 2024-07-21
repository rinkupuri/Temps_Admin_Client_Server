import { cartContextType, Props } from "@/types/CartContextTypes";
import { cart } from "@/types/ProductCardTypes";
import React, { createContext, FC, useState } from "react";

const CartContext = createContext<cartContextType>({
  cart: [],
  setCart: () => {},
});

const CartProvider: FC<Props> = ({ children }) => {
  const [cart, setCart] = useState<cart[]>([]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
