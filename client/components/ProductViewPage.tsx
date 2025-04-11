"use client";

import { FC, lazy, Suspense, useContext, useEffect, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter, RefreshCw } from "lucide-react";
import { Product, productMeta } from "@/types/ProductCardTypes";
import { CartContext } from "@/context/CartContext";
import { useGetProductsQuery } from "@/Redux/RTK/product.api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExportButton from "@/components/ExportButton";
import SkeletonGrid from "./SkeletonGrid";

const ProductGrid = lazy(() => import("@/components/productGrid"));

const Page: FC<{ title: string }> = ({ title }) => {
  const query = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const { cart, setCart } = useContext(CartContext);
  const [productMeta, setProductMeta] = useState<productMeta>();
  const [limit, setLimit] = useState<number>(30);
  const [brand, setBrand] = useState<Array<{ brand: string }>>([]);
  const [productData, setProductData] = useState<Product[]>();
  const [brandQuery, setBrandQuery] = useState(query.get("brand") || "all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, isLoading, isFetching, error } = useGetProductsQuery(
    {
      page,
      limit,
      brandQuery,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    setProductData([]);
    setBrandQuery(query.get("brand") || "all");
    setPage(1);
  }, [query]);

  useEffect(() => {
    setProductMeta(data?.meta);
  }, [page, limit, brandQuery, pathName, data]);

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
    <div className="min-h-[calc(100vh-5rem)] bg-zinc-900/50 rounded-lg backdrop-blur-sm border border-zinc-800/30">
      {/* Header Section */}
      <div className="p-6 border-b border-zinc-800/30">
        <div className="flex items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
          >
            {title}
          </motion.h1>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="w-5 h-5 text-zinc-400" />
            </motion.button>
            <ExportButton />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-zinc-800/30"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-zinc-400">Brand:</span>
                <Select
                  value={brandQuery.replace(/\_/g, " ")}
                  onValueChange={(e: string) => {
                    const searchParam = new URLSearchParams(query.toString());
                    searchParam.set("brand", e.replace(/\s/g, "_"));
                    router.replace(`${pathName}?${searchParam}`);
                  }}
                >
                  <SelectTrigger className="w-[200px] bg-zinc-800/50 border-zinc-700">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Brands</SelectLabel>
                      <SelectItem value="all">All Brands</SelectItem>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Section */}
      <div className="p-6">
        {isFetching && !productData?.length ? (
          <SkeletonGrid />
        ) : (
          <Suspense fallback={<SkeletonGrid />}>
            <ProductGrid
              brandQuerry={brandQuery}
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
          </Suspense>
        )}

        {/* Loading Indicator */}
        {/* @ts-ignore  */}
        {isFetching && productData?.length > 0 && (
          <div className="flex justify-center mt-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="p-2 rounded-full bg-zinc-800/50"
            >
              <RefreshCw className="w-5 h-5 text-zinc-400" />
            </motion.div>
          </div>
        )}

        {/* Pagination */}
        {productMeta && (
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-zinc-400">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, productMeta.totalCount)} of {productMeta.totalCount} results
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-zinc-400" />
              </button>
              <span className="text-sm text-zinc-400">
                Page {page} of {Math.ceil(productMeta.totalPages / limit)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= productMeta.totalPages}
                className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;