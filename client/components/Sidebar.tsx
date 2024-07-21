import Link from "next/link";
import React from "react";
import { AiFillProduct } from "react-icons/ai";
import { BiPurchaseTag } from "react-icons/bi";
import { FaSalesforce } from "react-icons/fa";
import { GrOrderedList } from "react-icons/gr";
import { SiGooglesheets } from "react-icons/si";

const Page = () => {
  const menus = [
    { name: "Products", url: "/products", icon: <AiFillProduct size={15} /> },
    { name: "Orders", url: "/orders", icon: <GrOrderedList size={15} /> },
    { name: "Sale", url: "/sale", icon: <FaSalesforce size={15} /> },
    { name: "Purchase", url: "/purchase", icon: <BiPurchaseTag size={15} /> },
    {
      name: "Image Sheet",
      url: "/gen-sheets",
      icon: <SiGooglesheets size={15} />,
    },
  ];
  return (
    <div className="flex flex-col w-full mt-4 gap-2 items-center h-full">
      {menus.map((value, index) => (
        <Link
          key={index}
          className="flex w-10/12 text-[14px] items-center cursor-pointer hover:bg-zinc-900 text-white py-2 px-4 rounded-md gap-1"
          href={value.url}
        >
          {value.icon}
          {value.name}
        </Link>
      ))}
    </div>
  );
};

export default Page;
