"use client";
import { cart, Product, productMeta } from "@/types/ProductCardTypes";
import React, { FC, useEffect, useRef, useCallback } from "react";
import ProductCard from "./ProductCard";
import { useGetProductsQuery } from "@/Redux/RTK/product.api";
import Loading from "./Loading";
import SkeletonGrid from "./SkeletonGrid";

const ProductGrid: FC<{
  productData: Product[] | undefined;
  cart: cart[];
  setCart: (cart: cart[]) => void;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  brandQuerry: string;
  isFetching: boolean;
  data: { products: Product[]; meta: productMeta } | undefined;
  setProductData: (product: Product[]) => void;
}> = ({
  productData,
  cart,
  setCart,
  setProductData,
  isFetching,
  brandQuerry,
  limit,
  page,
  setPage,
  data,
}) => {
  const lastCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure that data only updates when a new page's products are fetched
    if (data?.products?.length) {
      // @ts-ignore
      setProductData((prev: Product[]) => {
        // Only append products if they are not already in the current list
        const newProducts = data.products.filter(
          (newProduct) =>
            !prev?.some(
              (existingProduct: Product) => existingProduct.id === newProduct.id
            )
        );
        return [...(prev || []), ...newProducts];
      });
    }
  }, [data?.products, setProductData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // @ts-ignore
          setPage((prevPage: number) => prevPage + 1);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null, // Default is the viewport
        rootMargin: "150px",
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    if (lastCardRef.current) {
      observer.observe(lastCardRef.current);
    }
  }, [productData]);

  return (
    <div className="grid overflow-y-scroll gap-1 grid-cols-2 md:grid-cols-3 xl:grid-cols-5 w-full h-full">
      {productData?.length && productData?.length < 1 ? (
        <></>
      ) : (
        <>
          {productData?.map((value, index) => (
            <div
              ref={index === productData.length - 1 ? lastCardRef : null}
              key={index}
            >
              <ProductCard product={value} cart={cart} setCart={setCart} />
            </div>
          ))}
          {isFetching && <Loading />}
        </>
      )}
    </div>
  );
};

export default ProductGrid;
