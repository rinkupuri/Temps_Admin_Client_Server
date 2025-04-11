/* eslint-disable @next/next/no-img-element */
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
    <div className="grid grid-cols-4 gap-1.5 px-3 py-2">
      {stockTypes.map(({ label, key }) => (
        <div
          key={key}
          className={`flex items-center justify-center px-1.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
            // @ts-ignore
            product.stockId[key]
              ? "bg-indigo-500/20 text-indigo-300"
              : "bg-zinc-800 text-zinc-500"
          }`}
        >
          <span>{label}</span>
          <span className="ml-1">
            {
              // @ts-ignore
              product.stockId[key] || 0
            }
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="group bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-lg border border-zinc-800/50 hover:border-indigo-500/30 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10">
      {/* Image and Offer Badge */}
      <div className="relative h-48 overflow-hidden rounded-t-lg bg-zinc-800">
        <img
          className="w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-105"
          src={
            product.image
              ? process.env.NEXT_PUBLIC_SERVER_URL + product.image
              : noPic.src
          }
          alt={product.modelName}
        />
        {product.consumerOffer && (
          <div className="absolute top-2 right-2">
            <div className="bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {product.consumerOffer}% OFF
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-white truncate max-w-[70%]">
            {product.modelName}
          </h3>
          <span className="text-xs text-indigo-400 font-medium">
            {product.brand}
          </span>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center py-2 border-y border-zinc-800/50 mb-2">
          <div className="text-center flex-1">
            <span className="block text-[10px] text-zinc-500 uppercase tracking-wide">
              Stock
            </span>
            <span className="text-sm font-medium text-white">
              {product.totalStock || 0}
            </span>
          </div>
          <div className="text-center flex-1 border-l border-zinc-800/50">
            <span className="block text-[10px] text-zinc-500 uppercase tracking-wide">
              MRP
            </span>
            <span className="text-sm font-medium text-white">
              ₹{product.mrp}
            </span>
          </div>
        </div>

        {/* Stock Indicators */}
        {renderStockIndicators()}

        {/* Cart Controls */}
        {(path === "/order" || path === "/cart") && (
          <div className="flex justify-between items-center gap-2 mt-3 pt-3 border-t border-zinc-800/50">
            {["QTY", "IB", "DDN"].map((location, index) => {
              const stockKey =
                location === "DL"
                  ? "dlStock"
                  : location === "IB"
                  ? "ibStock"
                  : "ddnStock";
              return (
                <div key={index} className="flex-1">
                  <span className="block text-center text-[10px] text-zinc-400 mb-1.5">
                    {location}
                  </span>
                  <div className="flex items-center bg-zinc-800/50 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(stockKey, false)}
                      className={`px-2 py-1 ${
                        quantity > 0
                          ? "text-white hover:bg-indigo-500/20"
                          : "text-zinc-600 cursor-not-allowed"
                      } transition-colors rounded-l-md`}
                      disabled={quantity <= 0}
                    >
                      -
                    </button>
                    <input
                      value={quantity}
                      readOnly
                      className="w-8 text-center bg-transparent text-white text-xs py-1"
                      type="number"
                    />
                    <button
                      onClick={() => handleQuantityChange(stockKey, true)}
                      className="px-2 py-1 text-white hover:bg-indigo-500/20 transition-colors rounded-r-md"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
