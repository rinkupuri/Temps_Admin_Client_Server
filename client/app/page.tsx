import { Card, CardContent, CardHeader } from "@/components/ui/card";
import productPng from "@/public/Product.png";
import orderPng from "@/public/Order.png";
import searchPng from "@/public/Search.png";
import sheetsPng from "@/public/Sheets.png";
import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div className="w-full flex justify-center my-10 mb-32 items-center">
      <div className="grid place-items-center gap-5 grid-cols-1 md:grid-cols-2">
        <Link href={"/products"}>
          <Card className="w-[250px] h-[250px] py-2 flex justify-c  enter items-center flex-col">
            <img
              className="w-full object-contain my-3 h-[70px]"
              src={productPng.src}
              alt=""
            />
            <CardHeader>Products</CardHeader>
            <CardContent>
              <p className="text-zinc-600 text-center">
                Find All Product Invenrty there with all Store Stocks
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href={"/order"}>
          <Card className="w-[250px] h-[250px] py-2 flex justify-center items-center flex-col">
            <img
              className="w-full object-contain my-3 h-[70px]"
              src={orderPng.src}
              alt=""
            />
            <CardHeader>Order</CardHeader>
            <CardContent>
              <p className="text-zinc-600 text-center">
                Make Order to transfer Stock in all Stores
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href={"/search"}>
          <Card className="w-[250px] h-[250px] py-2 flex justify-center items-center flex-col">
            <img
              className="w-full object-contain my-3 h-[70px]"
              src={searchPng.src}
              alt=""
            />
            <CardHeader>Search</CardHeader>
            <CardContent>
              <p className="text-zinc-600 text-center">
                Search Products by it's Model Number{" "}
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href={"/sheets"}>
          <Card className="w-[250px] h-[250px] py-2 flex justify-center items-center flex-col">
            <img
              className="w-full object-contain my-3 h-[70px]"
              src={sheetsPng.src}
              alt=""
            />
            <CardHeader>Sheets</CardHeader>
            <CardContent>
              <p className="text-zinc-600 text-center">
                Export All Stock Sheet By Loaction
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default page;
