import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the API slice
export const apiSlice = createApi({
  reducerPath: "api", // Name of the reducer
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    credentials: "include" as const,
  }), // API base URL
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts", // Specify the endpoint
    }),
    getProduct: builder.query({
      query: (id) => `/product/get`,
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetPostsQuery, useGetProductQuery } = apiSlice;
