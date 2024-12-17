/* eslint-disable @next/next/no-img-element */
"use client";
import { getMenus } from "@/Api/api";
import { useGetMenusQuery } from "@/Redux/RTK/api";
import Link from "next/link";

const Page = () => {
  const { data: menus, isLoading, error } = useGetMenusQuery({});
  return (
    <>
      {!isLoading && (
        <div className=" fixed md:absolute md:w-full md:top-0 bottom-0 h-[70px] left-0 flex md:flex-col bg-black justify-start p-[11px] md:justify-start overflow-x-scroll md:overflow-hidden w-full md:pt-4 gap-2 items-center md:h-screen  ">
          {menus?.map((value, index) => (
            <Link
              key={index}
              className="flex md:w-10/12  h-full bg-zinc-900 md:h-[40px] justify-center md:justify-start text-[14px] items-center cursor-pointer hover:bg-zinc-800 text-white py-2 px-4 rounded-md gap-1"
              href={value.link}
            >
              <span className="h-[20px] w-[20px] flex justify-center items-center !text-[20px]">
                <img className="w-[20px] h-[20px]" src={value.image} alt="" />
              </span>
              <span className="h-full text-center p-2  flex justify-center items-center">
                {value.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Page;
