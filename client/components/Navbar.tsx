import Link from "next/link";
import React from "react";
import { BiBell, BiCart, BiNotification, BiUser } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";

const Navbar = () => {
  return (
    <div className="flex w-full justify-center items-center border-white  border-b-[1px]">
      <div className="h-[50px] w-11/12 flex justify-between items-center ">
        <div className="flex">
          <h1>Logo</h1>
        </div>
        <div className="flex *:cursor-pointer gap-4">
          <BiBell size={18} />
          <CiSettings size={18} />
          <BiUser size={18} />
          <Link href={"/cart"}>
            <BiCart size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
