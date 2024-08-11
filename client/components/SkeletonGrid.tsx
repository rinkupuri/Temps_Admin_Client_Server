import SkeletonProductcard from "@/components/SkeletonProductcard";
import React from "react";

const SkeletonGrid = () => {
  return (
    <div className="grid overflow-y-scroll gap-1 grid-cols-2 md:grid-cols-3 xl:grid-cols-5 w-full h-fit">
      {Array(100)
        .fill(null)
        .map((_, index) => (
          <SkeletonProductcard key={index} />
        ))}
    </div>
  );
};

export default SkeletonGrid;
