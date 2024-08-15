import Link from "next/link";
import React from "react";
import {
  BiBell,
  BiCart,
  BiExport,
  BiImport,
  BiNotification,
  BiUser,
} from "react-icons/bi";
import { CiDiscount1, CiSettings } from "react-icons/ci";
import { FcMultipleInputs } from "react-icons/fc";
import { BulkInventryUpdate } from "./DialogBoxes";

const Navbar = () => {
  return (
    <div className="flex w-full justify-center items-center border-white  border-b-[1px]">
      <div className="h-[50px] w-11/12 flex justify-between items-center ">
        <div className="flex">
          <h1>Temps</h1>
        </div>
        <div className="flex *:cursor-pointer gap-4">
          <BiBell title="Notification" size={18} />
          <BiImport title="Import" size={18} />
          <BiExport title="Export" size={18} />
          <BulkInventryUpdate />
          <Link title="Cart" href={"/cart"}>
            <BiCart size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
