"use client";
import React, { FC, useEffect, useState } from "react";
import { cart, Product } from "@/types/ProductCardTypes";
import { usePathname } from "next/navigation";
import { addToCartAPI } from "@/Api/Cart.api";
import noPic from "@/public/no-photo.png";

const ProductCard: FC<{
  product: Product;
  cartData?: cart;
  cart: cart[] | undefined;
  setCart: (cart: any) => void;
}> = ({ product, cart, setCart, cartData }) => {
  const path = usePathname();

  const [quantity, setQuantity] = useState(cartData?.quantity || 0);

  useEffect(() => {
    if (quantity) {
      addToCartAPI({
        model: product.modelName,
        quantity: quantity,
      });
    }
  }, [product.modelName, quantity]);

  const handleQuantityChange = (key: string, increment: boolean) => {
    setQuantity((prev: any) => (increment ? prev + 1 : Math.max(0, prev - 1)));
  };

  const stockTypes = [
    { label: "DDN", key: "ddnStock" },
    { label: "DL", key: "dlStock" },
    { label: "MT", key: "mtStock" },
    { label: "IB", key: "ibStock" },
    { label: "Main", key: "mainStock" },
    { label: "SL", key: "smapleLine" },
    { label: "GD", key: "godwanStock" },
    { label: "CH", key: "chdStock" },
  ];

  const renderStockIndicators = () => (
    <div className="grid grid-cols-4 py-2 md:p-2 place-content-center my-1 gap-1 flex-wrap justify-evenly items-center">
      {stockTypes.map(({ label, key }) => (
        <span
          key={key}
          className={`xl:flex-row text-center flex-col text-[10px] md:text-[12px] p-[2px] border-white/50 border-[0.1px]  xl:rounded-full xl:py-[2px] ${
            // @ts-ignore
            product.stockId[key] ? "bg-green-600" : "bg-zinc-800"
          }`}
        >
          <span>{label}:</span>{" "}
          <span>
            {
              // @ts-ignore
              product.stockId[key] || 0
            }
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-[0.3px] border-zinc-700 my-1 rounded-md flex flex-col">
      <img
        className="object-contain rounded-t-md w-full h-auto"
        src={
          product.image
            ? process.env.NEXT_PUBLIC_SERVER_URL + product.image
            : noPic.src
        }
        alt=""
      />
      <div
        className={`absolute px-1 ${
          product.consumerOffer ? "" : "hidden"
        } top-0 text-sm text-center right-0 w-16 h-6 text-white bg-zinc-900 rounded-bl-lg`}
      >
        {product.consumerOffer + "% Off"}
      </div>
      <div className="flex p-2 justify-between items-center w-full">
        <span className="text-[12px]">{product.modelName}</span>
        <span className="text-[12px]">{product.brand}</span>
      </div>

      {/* Stock Section */}
      <div className="flex flex-col w-full">
        <div className="flex my-1 justify-evenly items-center">
          <span className="text-[12px] flex w-full justify-center items-center">
            Stock: {product.totalStock || 0}
          </span>
          <span className="text-[12px] flex w-full justify-center items-center">
            MRP: {product.mrp}
          </span>
        </div>
        {renderStockIndicators()}
      </div>

      {/* Cart for Model Town and GT Road Button */}
      <div
        className={` ${
          path === "/order" || path === "/cart" ? "flex" : "hidden"
        } flex p-2 justify-evenly items-center`}
      >
        {["QTY", "IB", "DDN"].map((location, index) => {
          const stockKey =
            location === "DL"
              ? "dlStock"
              : location === "IB"
              ? "ibStock"
              : "ddnStock";
          return (
            <div
              key={index}
              className="flex gap-1 text-[12px] text-center flex-col"
            >
              {location}
              <div className="flex">
                <button
                  onClick={() => handleQuantityChange(stockKey, false)}
                  className={`${
                    quantity > 0 ? "cursor-pointer" : "cursor-not-allowed"
                  } p-1 bg-zinc-800 border-[1px] border-white/20`}
                  disabled={quantity <= 0}
                >
                  -
                </button>
                <input
                  value={quantity}
                  readOnly
                  className="w-8 flex justify-center text-center items-center text-[12px] h-8 p-1 bg-zinc-800"
                  type="number"
                />
                <button
                  onClick={() => handleQuantityChange(stockKey, true)}
                  className="p-1 bg-zinc-800 border-[1px] border-white/20"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCard;
