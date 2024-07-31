import React, { useEffect, useState } from "react";
import { parse } from "json2csv";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { BiDownload } from "react-icons/bi";
import path from "path";
import { cart } from "@/types/ProductCardTypes";
import axios from "axios";

const ExportButton = () => {
  // export excel function

  const exportHandel = async () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/cart/get`, {
        withCredentials: true,
      })
      .then((data) => {
        const csvData = parse(
          data.data.cart.map((value: cart) => {
            // @ts-ignore
            value["Model Name"] = value.product.modelName;
            // @ts-ignore

            value["MT Stock"] = value.quantity.mtStock;
            // @ts-ignore

            value["GT Road Stock"] = value.quantity.ibStock;
            // @ts-ignore

            value["Dehradun Stock"] = value.quantity.ddnStock;
            // @ts-ignore
            value["Delhi Stock"] = value.quantity.dlStock;
            // @ts-ignore
            value["Move From"] = value.fromLocation;
            // @ts-ignore

            delete value?.product;
            // @ts-ignore

            delete value?.productId;
            // @ts-ignore

            delete value?.fromLocation;
            // @ts-ignore

            delete value?.quantity;
            return value;
          })
        );
        const blob = new Blob([csvData], { type: "text/csv" });
        const link = document.createElement("a");
        link.setAttribute("download", "cart.csv");
        link.href = URL.createObjectURL(blob);
        link.click();
        link.remove();
      });
  };

  return (
    <HoverBorderGradient
      onClick={exportHandel}
      className="flex justify-center items-center gap-2"
    >
      <a href=""></a>
      <BiDownload size={15} /> Export Order
    </HoverBorderGradient>
  );
};

export default ExportButton;
