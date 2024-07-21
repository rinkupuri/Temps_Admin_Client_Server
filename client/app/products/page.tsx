"use client";
import productData from "@/productData.json";
import ProductCard from "@/components/ProductCard";
import { Suspense, useContext, useEffect, useState } from "react";
import { FcNext, FcPrevious } from "react-icons/fc";
import ExportButton from "@/components/ExportButton";
import { CartContext } from "@/context/CartContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const qurry = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState<number>(0);
  const { cart, setCart } = useContext(CartContext);
  const [productCount, setProductCount] = useState(0);
  console.log("check");

  useEffect(() => {
    setProductCount(
      productData
        .filter((value) =>
          qurry.get("brand")
            ? value.Brand.replace(/\s/g, "_").toLocaleLowerCase() ===
              qurry.get("brand")?.toLocaleLowerCase()
            : value["Model No."] !== ""
        )
        .filter((Value) => parseInt(Value.Total) !== 0).length
    );
    return () => {};
  });

  return (
    <div className="flex mt-5 flex-col h-[calc(100vh_-_100px)] items-center w-full">
      <div className="flex flex-col  w-11/12">
        <div className="flex w-full justify-between items-center">
          <h1>Products</h1>
          <ExportButton />
        </div>

        {/* filter menus */}
        <div className="flex mt-5 sticky justify-between items-center top-2 z-50 w-full rounded-md py-4 bg-zinc-800 my-5 h-[50px]">
          <div className="flex px-5 gap-4 justify-center items-center">
            <div className="flex">Filters : </div>
            <div className="flex-[1]">
              <Suspense fallback={<div>Loading...</div>}>
                <Select
                  onValueChange={(e: string) => {
                    if (e.toString().toLocaleLowerCase() === "all") {
                      router.push("/products");
                    } else {
                      const searchParam = new URLSearchParams(qurry.toString());
                      searchParam.set("brand", e.replace(/\s/g, "_"));
                      router.push(`/products?${searchParam}`);
                    }
                  }}
                >
                  <SelectTrigger className="bg-black border-[0.1px] border-white/30">
                    <SelectValue placeholder="Brads" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Locations</SelectLabel>
                      <SelectItem value={"All"}>All</SelectItem>
                      {Array.from(
                        new Set(productData.map((item) => item.Brand))
                      ).map((value, index) => (
                        <SelectItem key={index} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Suspense>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between items-center">
          <div className="flex">Total Product : {productCount}</div>
          <div className="flex">
            Total Stock :{" "}
            <Suspense fallback={<div>Loading...</div>}>
              {productData
                .filter((value) =>
                  qurry.get("brand")
                    ? value.Brand.replace(/\s/g, "_").toLocaleLowerCase() ===
                      qurry.get("brand")?.toLocaleLowerCase()
                    : value["Model No."] !== ""
                )
                .reduce((acc, obj) => acc + parseInt(obj.Total), 0)}
            </Suspense>
          </div>
        </div>
        <div className="grid  gap-2 grid-cols-2 md:grid-cols-3 xl:grid-cols-5 w-full h-full">
          <Suspense fallback={<div>Loading...</div>}>
            {productData
              .filter((value) =>
                qurry.get("brand")
                  ? value.Brand.replace(/\s/g, "_").toLocaleLowerCase() ===
                    qurry.get("brand")?.toLocaleLowerCase()
                  : value["Model No."] !== ""
              )
              .filter((Value) => parseInt(Value.Total) !== 0)
              .slice(0, page ? page * 100 + 100 : 100)
              .map((value, index) => (
                <div key={index}>
                  <ProductCard product={value} cart={cart} setCart={setCart} />
                </div>
              ))}
          </Suspense>
        </div>

        {/* Page Navigation  */}
        <div className="flex  p-4 rounded-md w-full justify-between items-center bg-zinc-800 h-[50px]">
          <button
            onClick={() => {
              page && setPage((prev: number) => prev - 1);
            }}
            disabled={page ? false : true}
            className={`bg-black ${
              page ? "cursor-pointer" : "cursor-not-allowed"
            } flex justify-center items-center gap-2 py-2 px-4 rounded-md`}
          >
            <FcPrevious size={15} /> Previous
          </button>
          <button
            onClick={() => {
              setPage((prev: number) => prev + 1);
            }}
            className={`${
              page >= productCount / 100
                ? "cursor-not-allowed"
                : "cursor-pointer"
            } bg-black flex justify-center items-center gap-2 py-2 px-4 rounded-md`}
          >
            Next <FcNext size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductComponent = () => {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
};

export default ProductComponent;
