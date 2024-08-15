"use client";
import productData from "@/productData.json";
import ProductCard from "@/components/ProductCard";
import { FC, lazy, Suspense, useContext, useEffect, useState } from "react";
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
import { Product, productMeta } from "@/types/ProductCardTypes";
import { getProductsAPI } from "@/Api/product.api";
import SkeletonGrid from "./SkeletonGrid";
const ProductGrid = lazy(() => import("@/components/productGrid"));

const Page: FC<{ title: string }> = ({ title }) => {
  const qurry = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const { cart, setCart } = useContext(CartContext);
  const [productMeta, setProductMeta] = useState<productMeta>();
  const [limit, setLimit] = useState<number>(100);
  const [brand, setBrand] = useState<Array<{ brand: string }>>([]);
  const [productData, setProductData] = useState<Product[]>();
  const [brandQuerry, setBrandQuerry] = useState(qurry.get("brand") || "all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBrandQuerry(qurry.get("brand") || "all");
  }, [qurry]);

  useEffect(() => {
    setLoading(true);
    getProductsAPI({ page, limit, brandQuerry }).then((data) => {
      setProductData(data.products);
      setProductMeta(data.meta);
      setLoading(false);
    });
    return () => {
      setProductData([]);
    };
  }, [page, limit, brandQuerry, pathName]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/product/brand`)
      .then((data) => {
        setBrand(data.data.brands);
      });
  }, []);

  return (
    <div className="flex mt-5 flex-col h-[calc(100vh_-_150%)] md:h-[calc(100vh_-_100px)] items-center w-full">
      <div className="flex flex-col h-full w-11/12">
        <div className="flex w-full justify-between items-center">
          <h1>{title}</h1>
          <ExportButton />
        </div>
        {/* filter menus */}
        <div className="flex py-1  sticky justify-between items-center top-2 z-50 w-full rounded-md my-1 bg-zinc-800 h-[50px]">
          <div className="flex px-5 gap-4 justify-center items-center">
            <div className="flex">Filters : </div>
            <div className="flex-[1]">
              <Select
                value={brandQuerry ? brandQuerry.replace(/\_/g, " ") : "all"}
                onValueChange={(e: string) => {
                  const searchParam = new URLSearchParams(qurry.toString());
                  searchParam.set("brand", e.replace(/\s/g, "_"));
                  router.replace(`${pathName}?${searchParam}`);
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
            </div>
          </div>
        </div>
        {loading ? (
          <SkeletonGrid />
        ) : (
          <ProductGrid
            cart={cart}
            setCart={setCart}
            productData={productData}
          />
        )}
        {/* Page Navigation  */}
        <div className="flex p-1 left-0 rounded-md w-full justify-between items-center bg-zinc-800 h-[50px]">
          <div className="flex justify-start items-center flex-[1]">
            <button
              onClick={() => {
                page && setPage((prev: number) => prev - 1);
              }}
              disabled={page ? false : true}
              className={`bg-black ${
                // @ts-ignore
                productMeta?.currentPage > 1 ? "cursor-pointer" : "hidden"
              } flex justify-center items-center gap-2 py-2 px-4 rounded-md`}
            >
              <FcPrevious size={15} /> Previous
            </button>
          </div>
          <div className="flex justify-end items-center flex-[1]">
            <button
              onClick={() => {
                setPage((prev: number) => prev + 1);
              }}
              className={`${
                productMeta?.currentPage === productMeta?.totalPages
                  ? "hidden"
                  : "cursor-pointer"
              } bg-black flex justify-center items-center gap-2 py-2 px-4 rounded-md`}
            >
              Next <FcNext size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
