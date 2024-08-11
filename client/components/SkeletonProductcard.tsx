import React from "react";

const SkeletonProductcard = () => {
  return (
    <div className=" border-[0.3px] border-zinc-700 my-1 rounded-md flex flex-col">
      <div className="animate-pulse w-full h-[200px] bg-zinc-800"></div>
      <div className="flex justify-center items-center">
        <div className="flex flex-col gap-2 py-3 w-11/12">
          <div className="animate-pulse w-full h-4 rounded-md  bg-zinc-800"></div>
          <div className="animate-pulse w-10/12 h-4 rounded-md  bg-zinc-800"></div>
          <div className="animate-pulse w-8/12 h-4 rounded-md  bg-zinc-800"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductcard;
