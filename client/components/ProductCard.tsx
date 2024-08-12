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
import { cart, Product } from "@/types/ProductCardTypes";
import cartJsonFile from "@/jsons/cart.json";
import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";
import { addToCartAPI } from "@/Api/Cart.api";

const ProductCard: FC<{
  product: Product;
  cartData?: cart;
  cart: cart[] | undefined;
  setCart: (cart: any) => void;
}> = ({ product, cart, setCart, cartData }) => {
  const path = usePathname();

  const [cartMTQTY, setCartMTQTY] = useState<number>(
    cartData?.quantity.mtStock || 0
  );
  const [cartIBQTY, setCartIBQTY] = useState<number>(
    cartData?.quantity.ibStock || 0
  );
  const [cartDLQTY, setCartDLQTY] = useState<number>(
    cartData?.quantity.dlStock || 0
  );
  const [fromLocation, setFromLocation] = useState<string>(
    cartData?.fromLocation || ""
  );

  const [cartDDNQTY, setCartDDNQTY] = useState<number>(
    cartData?.quantity.ddnStock || 0
  );

  useEffect(() => {
    if (cartMTQTY || cartIBQTY || cartDLQTY || cartDDNQTY) {
      addToCartAPI({
        fromLocation: fromLocation,
        model: product.modelName,
        quantity: {
          mtStock: cartMTQTY,
          ibStock: cartIBQTY,
          dlStock: cartDLQTY,
          ddnStock: cartDDNQTY,
          godwanStock: 0,
          mainStock: 0,
          smapleLine: 0,
        },
      });
    }
  }, [cartMTQTY, cartIBQTY, cartDLQTY, cartDDNQTY, fromLocation]);

  return (
    <div className=" relative overflow-hidden border-[0.3px] border-zinc-700 my-1 rounded-md flex flex-col">
      <img
        className="object-contain rounded-t-md w-full h-auto"
        src={product.image + "?w=1000&h=1200"}
        alt=""
      />
      <div
        className={`absolute px-1 ${
          product.consumerOffer ? " " : "hidden"
        } top-0 text-sm text-center  right-0 w-16 h-6 text-white bg-zinc-900 rounded-bl-lg`}
      >
        {product.consumerOffer + "% Off"}
      </div>
      <div className="flex p-2 justify-between items-center w-full">
        <span className="text-[12px]">{product.modelName}</span>
        <span className="text-[12px]">{product.brand}</span>
      </div>

      {/* stock section */}

      <div className="flex flex-col w-full">
        <div className="flex my-1 justify-evenly items-center">
          <span className="text-[12px] flex w-full justify-center items-center">
            Stock : {product.totalStock || 0}
          </span>
          <span className="text-[12px] flex w-full justify-center items-center">
            MRP : {product.mrp}
          </span>
        </div>
        <div className="flex  justify-evenly items-center">
          <span
            className={`xl:flex-row flex-col text-[12px] p-[2px] border-white/50 border-[0.1px]  xl:rounded-full xl:p-[2px] xl:px-2 ${
              product.stockId.ddnStock ? "bg-green-600" : "bg-zinc-800"
            }`}
          >
            <span> DDN :</span> <span> {product.stockId.ddnStock || 0}</span>
          </span>
          <span
            className={`xl:flex-row flex-col text-[12px] p-[2px] border-white/50 border-[0.1px]  xl:rounded-full xl:p-[2px] xl:px-2 ${
              product.stockId.dlStock ? "bg-green-600" : "bg-zinc-800"
            }`}
          >
            <span> DL :</span> <span> {product.stockId.dlStock || 0}</span>
          </span>
          <span
            className={`xl:flex-row flex-col text-[12px] p-[2px] border-white/50 border-[0.1px]  xl:rounded-full xl:p-[2px] xl:px-2 ${
              product.stockId.mtStock ? "bg-green-600" : "bg-zinc-800"
            }`}
          >
            <span> MT :</span> <span> {product.stockId.mtStock || 0}</span>
          </span>
          <span
            className={`xl:flex-row flex-col text-[12px] p-[2px] border-white/50 border-[0.1px]  xl:rounded-full xl:p-[2px] xl:px-2 ${
              product.stockId.ibStock ? "bg-green-600" : "bg-zinc-800"
            }`}
          >
            <span> IB :</span> <span> {product.stockId.ibStock || 0}</span>
          </span>
        </div>
        <div className="flex my-1 justify-evenly items-center">
          <span
            className={`xl:flex-row flex-col text-[12px] p-[2px] border-white/50 border-[0.1px]  xl:rounded-full xl:p-[2px] xl:px-2 ${
              product.stockId.mainStock ? "bg-green-600" : "bg-zinc-800"
            }`}
          >
            <span> Main :</span> <span> {product.stockId.mainStock || 0}</span>
          </span>
          <span
            className={`xl:flex-row flex-col text-[12px] p-[2px] border-white/50 border-[0.1px]  xl:rounded-full xl:p-[2px] xl:px-2 ${
              product.stockId.smapleLine ? "bg-green-600" : "bg-zinc-800"
            }`}
          >
            <span> SL :</span> <span> {product.stockId.smapleLine || 0}</span>
          </span>
          <span
            className={`xl:flex-row flex-col text-[12px] p-[2px] border-white/50 border-[0.1px]  xl:rounded-full xl:p-[2px] xl:px-2 ${
              product.stockId.godwanStock ? "bg-green-600" : "bg-zinc-800"
            }`}
          >
            <span> GD :</span> <span> {product.stockId.godwanStock || 0}</span>
          </span>
        </div>
      </div>

      {/* move from selector */}

      <div
        className={` ${
          path === "/order" ? "flex" : path === "/cart" ? "flex" : "hidden"
        }  p-2 justify-evenly items-center`}
      >
        <div className="flex flex-[1] w-6/12 h-full justify-center items-center gap-1 text-[12px] flex-col">
          Model Town
          <div className="flex">
            <button
              onClick={() => {
                cartMTQTY &&
                  cartMTQTY > 1 &&
                  setCartMTQTY((prev: number) => prev - 1);
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
            onValueChange={(e) => {
              setFromLocation(e);
              addToCartAPI({
                fromLocation: fromLocation,
                model: product.modelName,
                quantity: {
                  mtStock: cartMTQTY,
                  ibStock: cartIBQTY,
                  dlStock: cartDLQTY,
                  ddnStock: cartDDNQTY,
                  godwanStock: 0,
                  mainStock: 0,
                  smapleLine: 0,
                },
              });
            }}
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

      <div
        className={` ${
          path === "/order" ? "flex" : path === "/cart" ? "flex" : "hidden"
        } flex p-2 justify-evenly items-center`}
      >
        <div className="flex gap-1 text-[12px] text-center flex-col">
          Delhi
          <div className="flex">
            <button
              onClick={() => {
                cartDLQTY &&
                  cartDLQTY > 1 &&
                  setCartDLQTY((prev: number) => prev - 1);
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
                cartIBQTY &&
                  cartIBQTY > 1 &&
                  setCartIBQTY((prev: number) => prev - 1);
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
                cartDDNQTY &&
                  cartDDNQTY > 1 &&
                  setCartDDNQTY((prev: number) => prev - 1);
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
