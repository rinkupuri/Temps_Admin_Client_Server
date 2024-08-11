"use client";

import { getProductsAPI, searchProductAPI } from "@/Api/product.api";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "@/components/productGrid";
import SkeletonGrid from "@/components/SkeletonGrid";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Product } from "@/types/ProductCardTypes";
import { useEffect, useState } from "react";
const Page = () => {
  const [searchString, setSearchString] = useState("");
  const [product, setProduct] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const placeholders = [
    "Search With Model Number",
    "Search What You Want?",
    "Is this Available?",
    "Search All Brands",
  ];
  useEffect(() => {
    setLoading(true);
    getProductsAPI({ brandQuerry: "all", limit: 10, page: 1 }).then((data) => {
      setProduct(data.products);
      setLoading(false);
    });
  }, []);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // @ts-ignore
    setLoading(true);
    searchProductAPI({ queryModel: searchString }).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  };
  return (
    <>
      <div className="flex justify-center h-screen w-full">
        <div className="flex flex-col h-full w-11/12 ">
          <h1>Search</h1>
          <div className="flex my-3">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={(e) => setSearchString(e.target.value)}
              onSubmit={onSubmit}
            />
          </div>
          {loading ? (
            <SkeletonGrid />
          ) : product.length === 0 ? (
            <div className="flex justify-center items-center h-screen w-full">
              <h1>No Product Found</h1>
            </div>
          ) : (
            <ProductGrid productData={product} setCart={() => {}} cart={[]} />
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
