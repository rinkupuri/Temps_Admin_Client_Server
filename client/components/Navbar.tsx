"use client";
import Link from "next/link";
import React from "react";
import { BiBell, BiCart, BiExport, BiUser } from "react-icons/bi";
import { BulkInventryUpdate } from "./Dialog/InventryCheck";
import { Import } from "./Dialog/Import";
import { useGetUserQuery } from "@/Redux/RTK/auth.api";

const Navbar = () => {
  const { data, isLoading, error } = useGetUserQuery({});
  return (
    <div className="flex w-full justify-center items-center border-white  border-b-[1px]">
      <div className="h-[50px] w-11/12 flex justify-between items-center ">
        <div className="flex">
          <h1>Temps</h1>
        </div>
        <div className="flex *:cursor-pointer gap-4">
          <BiBell title="Notification" size={18} />
          <Import />
          <BiExport title="Export" size={18} />
          <Link title="Cart" href={"/cart"}>
            <BiCart size={18} />
          </Link>
          <BiUser title="User" size={18} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
