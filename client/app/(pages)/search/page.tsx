"use client";

import { getProductsAPI, searchProductAPI } from "@/Api/product.api";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "@/components/productGrid";
import SkeletonGrid from "@/components/SkeletonGrid";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import {
  useGetProductsQuery,
  useSearchProductQuery,
} from "@/Redux/RTK/product.api";
import { Product } from "@/types/ProductCardTypes";
import { useEffect, useState } from "react";
const Page = () => {
  const [searchString, setSearchString] = useState("");
  const [fieldvalue, setFieldValue] = useState("");
  const [product, setProduct] = useState<Product[] | undefined>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(30);
  const { data, isLoading, error } = useSearchProductQuery(
    {
      queryModel: searchString,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const placeholders = [
    "Search With Model Number",
    "Search What You Want?",
    "Is this Available?",
    "Search All Brands",
  ];

  useEffect(() => {
    setProduct(data);
  }, [data]);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // @ts-ignore
    setSearchString(fieldvalue);
    // searchProductAPI({ queryModel: searchString }).then((data) => {
    //   setProduct(data);
    // });
  };
  return (
    <>
      <div className="flex justify-center  w-full">
        <div className="flex flex-col h-full w-11/12 ">
          <h1>Search</h1>
          <div className="flex my-3">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={(e) => setFieldValue(e.target.value)}
              onSubmit={onSubmit}
            />
          </div>
          {isLoading ? (
            <SkeletonGrid />
          ) : product?.length === 0 ? (
            <div className="flex justify-center items-center h-[clac(100vh_-_150px)] w-full">
              <h1>No Product Found</h1>
            </div>
          ) : (
            <div className="flex w-full h-[calc(100vh_-_200px)]">
              <ProductGrid
                setProductData={setProduct}
                page={page}
                // @ts-ignore
                data={data}
                setPage={setPage}
                brandQuerry=""
                limit={limit}
                productData={product}
                setCart={() => {}}
                cart={[]}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
