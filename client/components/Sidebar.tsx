import Link from "next/link";
import React from "react";
import { AiFillProduct } from "react-icons/ai";
import { BiPurchaseTag } from "react-icons/bi";
import { FaSalesforce } from "react-icons/fa";
import { GrOrderedList } from "react-icons/gr";
import { SiGooglesheets } from "react-icons/si";


const Page = () => {
  const menus = [
    { name: "Products", url: "/products", icon: <AiFillProduct size={20} /> },
    { name: "Orders", url: "/order", icon: <GrOrderedList size={20} /> },
    {
      name: "Image Sheet",
      url: "/sheets",
      icon: <SiGooglesheets size={20} />,
    },
  ];
  return (
    <div className="flex md:flex-col bg-black justify-between md:justify-start overflow-x-scroll md:overflow-hidden w-full md:mt-4 gap-2 items-center h-full">
      {menus.map((value, index) => (
        <Link
          key={index}
          className="flex md:w-10/12 h-full md:h-[40px] justify-center md:justify-start text-[14px] items-center cursor-pointer hover:bg-zinc-900 text-white py-2 px-4 rounded-md gap-1"
          href={value.url}
        >
          <span className="h-full flex justify-center items-center !text-[20px]">
            {value.icon}
          </span>
          <span className="h-full flex justify-center items-center">
            {value.name}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default Page;
