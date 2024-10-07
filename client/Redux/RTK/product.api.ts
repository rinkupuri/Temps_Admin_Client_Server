import { apiSlice } from "@/Redux/RTK/slicer"; // Assuming your main apiSlice is in this file
import { Product, productMeta } from "@/types/ProductCardTypes";
import { Metadata } from "next";

// Inject the product-related endpoints into the existing API slice
export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Inject `searchProduct` endpoint
    searchProduct: builder.query({
      query: (queryModel) => ({
        url: `/product/search`,
        method: "GET",
        params: { query: queryModel },
        credentials: "include", // Ensure cookies are included
      }),
      transformResponse: (response: { products: Product }) =>
        response?.products, // Return only the products
    }),

    // Inject `getProducts` endpoint
    getProducts: builder.query({
      query: ({ brandQuerry, page, limit }) => ({
        url: `/product/get`,
        method: "GET",
        params: { brand: brandQuerry, page, limit },
        credentials: "include", // Ensure cookies are included
      }),
      transformResponse: (response: {
        products: Product[];
        meta: productMeta;
      }) => response, // Return the full response (pagination, etc.)
    }),
  }),
  overrideExisting: false, // Prevent overwriting existing endpoints
});

// Export hooks for using the API in components
export const { useSearchProductQuery, useGetProductsQuery } = extendedApi;
