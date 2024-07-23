"use client";
import productData from "@/productData.json";
import ProductCard from "@/components/ProductCard";
import { FC, Suspense, useContext, useEffect, useState } from "react";
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
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import axios from "axios";
import { Product } from "@/types/ProductCardTypes";

const Page: FC<{ title: string }> = ({ title }) => {
  const qurry = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const { cart, setCart } = useContext(CartContext);
  const [productCount, setProductCount] = useState(0);
  const [limit, setLimit] = useState<number>(100);
  const [brand, setBrand] = useState<Array<{ brand: string }>>([]);
  const [productData, setProductData] = useState<Product[]>();
  const [brandQuerry, setBrandQuerry] = useState(qurry.get("brand") || "all");

  useEffect(() => {
    setBrandQuerry(qurry.get("brand") || "all");
  }, [qurry]);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/product/get?brand=${brandQuerry}&page=${page}&limit=${limit}`
      )
      .then((data) => setProductData(data.data.products));
    return () => {
      setProductData([]);
    };
  }, [page, limit, brandQuerry, pathName]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/product/brand`)
      .then((data) => setBrand(data.data.brands));
  }, []);

  return (
    <div className="flex mt-5 flex-col h-[calc(100vh_-_100px)] items-center w-full">
      <div className="flex flex-col  w-11/12">
        <div className="flex w-full justify-between items-center">
          <h1>{title}</h1>
          <ExportButton />
        </div>

        {/* filter menus */}
        <div className="flex mt-5 sticky justify-between items-center top-2 z-50 w-full rounded-md py-4 bg-zinc-800 my-5 h-[50px]">
          <div className="flex px-5 gap-4 justify-center items-center">
            <div className="flex">Filters : </div>
            <div className="flex-[1]">
              <Suspense fallback={<div>Loading...</div>}>
                <Select
                  value={brandQuerry ? brandQuerry.replace(/\_/g, " ") : "all"}
                  onValueChange={(e: string) => {
                    const searchParam = new URLSearchParams(qurry.toString());
                    searchParam.set("brand", e.replace(/\s/g, "_"));
                    router.replace(`/products?${searchParam}`);
                  }}
                >
                  <SelectTrigger className="bg-black border-[0.1px] border-white/30">
                    <SelectValue placeholder="Brads" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Locations</SelectLabel>
                      <SelectItem value={"all"}>All</SelectItem>
                      {brand.map((value, index) => (
                        <SelectItem key={index} value={value.brand}>
                          {value.brand}
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
          <div className="flex">Total Stock : 0</div>
        </div>
        <div className="grid  gap-2 grid-cols-2 md:grid-cols-3 xl:grid-cols-5 w-full h-full">
          <Suspense fallback={<div>Loading...</div>}>
            {productData?.map((value, index) => (
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

export default Page;
