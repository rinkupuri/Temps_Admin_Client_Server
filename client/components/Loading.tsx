import React from "react";

const Loading = () => {
  return (
    <div className="fixed z-[99999999999] top-0 bg-black/10 left-0 w-full h-full flex justify-center items-center">
      <div className="flex bg-zinc-900 overflow-hidden border-white/60 border-[0.04px] rounded-sm justify-center items-center w-20 h-20">
        <div className="animate-spin z-10 rounded-full h-10 w-10 border-4 border-dotted border-white"></div>
      </div>
    </div>
  );
};

export default Loading;
