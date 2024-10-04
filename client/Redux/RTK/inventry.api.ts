import { apiSlice } from "@/Redux/RTK/slicer"; // Assuming your main apiSlice is in this file

// Inject the inventory-related endpoint into the existing API slice
export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    bulkModelWiseInventry: builder.mutation({
      query: (modelString) => ({
        url: "/inventry/exportmodelwise",
        method: "POST",
        body: { modelString },
        credentials: "include", // Ensure cookies are included
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const link = data?.link;
          if (link) {
            const a = document.createElement("a");
            a.href = link;
            a.click();
            a.remove();
          } else {
            alert("Something went wrong. Please try again.");
          }
        } catch (error) {
          console.log("Error in bulkModelWiseInventry:", error);
        }
      },
    }),
  }),
  overrideExisting: false, // Ensure existing endpoints are not overwritten
});

export const { useBulkModelWiseInventryMutation } = extendedApi;
