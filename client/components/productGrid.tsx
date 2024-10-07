import { cart, Product } from "@/types/ProductCardTypes";
import React, { FC, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";

const ProductGrid: FC<{
  productData: Product[] | undefined;
  cart: cart[];
  setCart: (cart: cart[]) => void;
}> = ({ productData, cart, setCart }) => {
  return (
    <div className="grid overflow-y-scroll gap-1 grid-cols-2 md:grid-cols-3 xl:grid-cols-5 w-full h-full">
      {productData?.length && productData?.length < 1 ? (
        <></>
      ) : (
        <>
          {productData?.map((value, index) => (
            <div key={index}>
              <ProductCard product={value} cart={cart} setCart={setCart} />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ProductGrid;
