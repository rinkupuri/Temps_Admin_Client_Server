import React from "react";

const Loading = () => {
  return (
    <div className="fixed z-[99999999999] top-0 bg-black/10 left-0 w-full h-full flex justify-center items-center">
      <div className="flex bg-white rounded-sm justify-center items-center w-20 h-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-dotted border-gray-900"></div>
      </div>
    </div>
  );
};

export default Loading;
