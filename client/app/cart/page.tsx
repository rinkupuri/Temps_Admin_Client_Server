"use client";

import React, { useContext, useState } from "react";
import cartProduct from "@/temp/jsons/cart.json";
import ExportButton from "@/components/ExportButton";
import ProductCard from "@/components/ProductCard";
import { CartContext } from "@/context/CartContext";

const Page = () => {
  const { cart, setCart } = useContext(CartContext);
  const [page, setPage] = useState<number>(0);
  console.log(cart);
  return (
    <div className="flex mt-5 flex-col h-[calc(100vh_-_100px)] items-center w-full">
      <div className="flex flex-col  w-11/12">
        <div className="flex w-full justify-between items-center">
          <h1>Cart ({cartProduct.length})</h1>
          <ExportButton />
        </div>
      </div>
      <div className="grid  gap-2 grid-cols-2 md:grid-cols-3 xl:grid-cols-5 w-full h-full">
        {cartProduct
          .slice(0, page ? page * 100 + 100 : 100)
          .map((value, index) => (
            <div key={index}>
              <ProductCard
                product={value.product}
                cartData={value}
                cart={cart}
                setCart={setCart}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Page;
