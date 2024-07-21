"use client";
import React, { FC, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cart, product } from "@/types/ProductCardTypes";
import cartJsonFile from "@/jsons/cart.json";
import axios from "axios";

const ProductCard: FC<{
  product: product;
  cartData?: cart;
  cart: cart[] | undefined;
  setCart: (cart: any) => void;
}> = ({ product, cart, setCart, cartData }) => {
  const [cartMTQTY, setCartMTQTY] = useState<number>(cartData?.MTQty || 0);
  const [cartIBQTY, setCartIBQTY] = useState<number>(cartData?.IBQty || 0);
  const [cartDLQTY, setCartDLQTY] = useState<number>(cartData?.DLQty || 0);
  const [cartDDNQTY, setCartDDNQTY] = useState<number>(cartData?.DDNQty || 0);
  const [fromLocation, setFromLocation] = useState<string>(
    cartData?.MoveFrom || ""
  );

  useEffect(() => {
    if (cartMTQTY || cartIBQTY || cartDLQTY || cartDDNQTY || fromLocation)
      (async () => {
        setCart((prev: any) => {
          const array = [...prev];
          const isExits = array.filter(
            (value) => value.product["Model No."] === product["Model No."]
          );
          if (isExits.length) {
            array.map((value) => {
              if (value.product["Model No."] === product["Model No."]) {
                value.DDNQty = cartDDNQTY;
                value.DLQty = cartDLQTY;
                value.IBQty = cartIBQTY;
                value.MTQty = cartMTQTY;
                value.MoveFrom = fromLocation;
              }
            });
          } else {
            console.log([
              ...prev,
              {
                product: {
                  "Model No.": product["Model No."],
                  Brand: product.Brand,
                  Image: product.Image,
                  MRP: product.MRP,
                  Cart: product.Cart,
                  MTSTOCK: product.MTSTOCK,
                  IBSTOCK: product.IBSTOCK,
                  DLSTOCK: product.DLSTOCK,
                  DDNSTOCK: product.DDNSTOCK,
                  Total: product.Total,
                },
                MTQty: cartMTQTY,
                IBQty: cartIBQTY,
                DLQty: cartDLQTY,
                DDNQty: cartDDNQTY,
                MoveFrom: fromLocation,
              },
            ]);
            return [
              ...prev,
              {
                product: {
                  "Model No.": product["Model No."],
                  Brand: product.Brand,
                  Image: product.Image,
                  MRP: product.MRP,
                  Cart: product.Cart,
                  MTSTOCK: product.MTSTOCK,
                  IBSTOCK: product.IBSTOCK,
                  DLSTOCK: product.DLSTOCK,
                  DDNSTOCK: product.DDNSTOCK,
                  Total: product.Total,
                },
                MTQty: cartMTQTY,
                IBQty: cartIBQTY,
                DLQty: cartDLQTY,
                DDNQty: cartDDNQTY,
                MoveFrom: fromLocation,
              },
            ];
          }
          return [...prev];
        });
      })();
  }, [cartMTQTY, cartIBQTY, cartDLQTY, cartDDNQTY, fromLocation]);

  useEffect(() => {
    if (cartMTQTY || cartIBQTY || cartDLQTY || cartDDNQTY || fromLocation) {
      if (cart?.length)
        axios.post("/api/cart", JSON.stringify(cart), {
          headers: {
            "Content-Type": "application/json",
          },
        });
    }
    return () => {};
  }, [cart]);

  return (
    <div className=" border-[0.3px] border-zinc-700 my-5 rounded-md flex flex-col">
      <img
        className="object-contain rounded-t-md w-full h-auto"
        src={product.Image}
        alt=""
      />
      <div className="flex p-2 justify-between items-center w-full">
        <span className="text-[12px]">{product["Model No."]}</span>
        <span className="text-[12px]">{product.Brand}</span>
      </div>

      {/* stock section */}

      <div className="flex flex-col w-full">
        <div className="flex my-1 justify-evenly items-center">
          <span className="text-[12px] flex w-full justify-center items-center">
            Stock : {product.Total || 0}
          </span>
          <span className="text-[12px] flex w-full justify-center items-center">
            MRP : {product.MRP}
          </span>
        </div>
        <div className="flex justify-evenly items-center">
          <span
            className={`text-[12px]  rounded-full p-[2px] px-2 ${
              parseInt(product.DDNSTOCK) ? "bg-green-600" : "bg-zinc-800"
            }`}
          >
            DDN : {product.DDNSTOCK || 0}
          </span>
          <span
            className={`text-[12px]  rounded-full p-[2px] px-2 ${
              parseInt(product.DLSTOCK) ? "bg-green-600" : "bg-zinc-800"
            }`}
          >
            DL : {product.DLSTOCK || 0}
          </span>
          <span
            className={`text-[12px]  rounded-full p-[2px] px-2 ${
              parseInt(product.MTSTOCK) ? "bg-green-600" : "bg-zinc-800"
            }`}
          >
            MT : {product.MTSTOCK || 0}
          </span>
          <span
            className={`text-[12px]  rounded-full p-[2px] px-2 ${
              parseInt(product.IBSTOCK) ? "bg-green-600" : "bg-zinc-800"
            }`}
          >
            IB : {product.IBSTOCK || 0}
          </span>
        </div>
      </div>

      {/* move from selector */}

      <div className="flex p-2 justify-evenly items-center">
        <div className="flex flex-[1] w-6/12 h-full justify-center items-center gap-1 text-[12px] flex-col">
          Model Town
          <div className="flex">
            <button
              onClick={() => {
                cartMTQTY && setCartMTQTY((prev: number) => prev - 1);
              }}
              className={`${
                cartMTQTY ? "cursor-pointer " : "cursor-not-allowed"
              } p-1 bg-zinc-800 border-[1px] border-white/20`}
            >
              -
            </button>
            <input
              name="mt"
              value={cartMTQTY}
              disabled
              className="w-8 flex justify-center text-center items-center text-[12px] h-8 p-1 bg-zinc-800"
              type="number"
            />
            <button
              onClick={() => {
                setCartMTQTY((prev: number) => prev + 1);
              }}
              className="p-1 bg-zinc-800 border-[1px] border-white/20"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex-[1] flex  w-full h-full justify-center items-center ">
          <Select
            value={fromLocation}
            onValueChange={(e) => setFromLocation(e)}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Move Form" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Locations</SelectLabel>
                <SelectItem value="MT">MT</SelectItem>
                <SelectItem value="IB">GT Road</SelectItem>
                <SelectItem value="DL">Delhi</SelectItem>
                <SelectItem value="DDN">Dehradun</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* cart for model town and GT Road Button */}

      <div className=" flex p-2 justify-evenly items-center">
        <div className="flex gap-1 text-[12px] text-center flex-col">
          Delhi
          <div className="flex">
            <button
              onClick={() => {
                cartDLQTY && setCartDLQTY((prev: number) => prev - 1);
              }}
              className={`${
                cartDLQTY ? "cursor-pointer " : "cursor-not-allowed"
              } p-1 bg-zinc-800 border-[1px] border-white/20`}
            >
              -
            </button>
            <input
              value={cartDLQTY}
              disabled
              className="w-8 flex justify-center text-center items-center text-[12px] h-8 p-1 bg-zinc-800"
              type="number"
            />
            <button
              onClick={() => {
                setCartDLQTY((prev: number) => prev + 1);
              }}
              className="p-1 bg-zinc-800 border-[1px] border-white/20"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex gap-1 text-[12px] text-center flex-col">
          GT Road
          <div className="flex">
            <button
              onClick={() => {
                cartIBQTY && setCartIBQTY((prev: number) => prev - 1);
              }}
              className={`${
                cartIBQTY ? "cursor-pointer " : "cursor-not-allowed"
              } p-1 bg-zinc-800 border-[1px] border-white/20`}
            >
              -
            </button>
            <input
              value={cartIBQTY}
              disabled
              className="w-8 flex justify-center text-center items-center text-[12px] h-8 p-1 bg-zinc-800"
              type="number"
            />
            <button
              onClick={() => {
                setCartIBQTY((prev: number) => prev + 1);
              }}
              className="p-1 bg-zinc-800 border-[1px] border-white/20"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex gap-1 text-[12px] text-center flex-col">
          Dehradun
          <div className="flex">
            <button
              onClick={() => {
                cartDDNQTY && setCartDDNQTY((prev: number) => prev - 1);
              }}
              className={`${
                cartDDNQTY ? "cursor-pointer " : "cursor-not-allowed"
              } p-1 bg-zinc-800 border-[1px] border-white/20`}
            >
              -
            </button>
            <input
              value={cartDDNQTY}
              disabled
              className="w-8 flex justify-center text-center items-center text-[12px] h-8 p-1 bg-zinc-800"
              type="number"
            />
            <button
              onClick={() => {
                setCartDDNQTY((prev: number) => prev + 1);
              }}
              className="p-1 bg-zinc-800 border-[1px] border-white/20"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* cart Button for Delhi and Dehradun */}

      <div className=" flex p-2 justify-evenly items-center"></div>
    </div>
  );
};

export default ProductCard;
