import React from "react";
import { parse } from "json2csv";
import cardData from "@/temp/jsons/cart.json";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { BiDownload } from "react-icons/bi";
import path from "path";

const ExportButton = () => {
  const exportHandel = async () => {
    const csvData = parse(
      cardData.map((value) => {
        // @ts-ignore
        value.ModelNo = value.product["Model No."];
        // @ts-ignore
        delete value?.product;
        return value;
      })
    );
    const blob = new Blob([csvData], { type: "text/csv" });
    const link = document.createElement("a");
    link.setAttribute("download", "cart.csv");
    link.href = URL.createObjectURL(blob);
    link.click();
    link.remove();
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
