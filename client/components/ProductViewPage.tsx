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
import { useGetProductsQuery } from "@/Redux/RTK/product.api";
import Loading from "./Loading";
const ProductGrid = lazy(() => import("@/components/productGrid"));

const Page: FC<{ title: string }> = ({ title }) => {
  const qurry = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const { cart, setCart } = useContext(CartContext);
  const [productMeta, setProductMeta] = useState<productMeta>();
  const [limit, setLimit] = useState<number>(30);
  const [brand, setBrand] = useState<Array<{ brand: string }>>([]);
  const [productData, setProductData] = useState<Product[]>();
  const [brandQuerry, setBrandQuerry] = useState(qurry.get("brand") || "all");
  const { data, isLoading, isFetching, error } = useGetProductsQuery(
    {
      page,
      limit,
      brandQuerry,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    setProductData([]);
    setBrandQuerry(qurry.get("brand") || "all");
    setPage(1);
  }, [qurry]);

  useEffect(() => {
    // setLoading(true);
    // getProductsAPI({ page, limit, brandQuerry }).then((data) => {
    // setProductData((prev) => {
    //   return [...(prev || []), ...(data?.products || [])];
    // });
    setProductMeta(data?.meta);
    // setLoading(false);
    // });
    console.log(isLoading);
  }, [page, limit, brandQuerry, pathName, data, isLoading]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/product/brand`, {
        withCredentials: true,
      })
      .then((data) => {
        setBrand(data.data.brands);
      });
  }, []);

  return (
    <>
      <div className="flex mt-5 flex-col h-[calc(100vh_-_150px)] md:h-[calc(100vh_-_100px)] items-center w-full">
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
          {isFetching && !productData?.length ? (
            <SkeletonGrid />
          ) : (
            <ProductGrid
              brandQuerry={brandQuerry}
              limit={limit}
              page={page}
              isFetching={isFetching}
              data={data}
              setPage={setPage}
              cart={cart}
              setCart={setCart}
              productData={productData}
              setProductData={setProductData}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
