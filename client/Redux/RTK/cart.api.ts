import { apiSlice } from "@/Redux/RTK/slicer"; // Assuming this is where your main apiSlice is defined

// Inject the cart-related endpoints into the existing API slice
export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Inject `addToCart` mutation
    addToCart: builder.mutation({
      query: ({ model, quantity }) => ({
        url: "/cart/addItem",
        method: "POST",
        body: { model, quantity },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are included
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          // Retry mechanism if the add to cart fails
          const intervalCartAPI = setInterval(() => {
            dispatch(
              extendedApi.endpoints.addToCart.initiate({
                model: arg.model,
                quantity: arg.quantity,
              })
            );
          }, 3000);
          clearInterval(intervalCartAPI); // Clear after retry
        }
      },
    }),

    // Inject `getCart` query
    getCart: builder.query({
      query: () => ({
        url: "/cart/get",
        method: "GET",
        credentials: "include", // Ensure cookies are included
      }),
      transformResponse: (response) => response, // Return the entire cart response
    }),
  }),
  overrideExisting: false, // Ensure existing endpoints are not overwritten
});

// Export hooks for use in components
export const { useAddToCartMutation, useGetCartQuery } = extendedApi;
