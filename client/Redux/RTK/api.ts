import { apiSlice } from "@/Redux/RTK/slicer"; // Assuming your main apiSlice is here
import { Menu } from "@/types/types";

// Inject the `getMenus` endpoint into the existing API slice
export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMenus: builder.query({
      query: () => ({
        url: "/webData/menu/get",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are included
      }),
      transformResponse: (response: { menus: Menu[] }) => response?.menus, // Return only the menus
    }),
  }),
  overrideExisting: false, // Prevent overwriting existing endpoints
});

// Export the hook for using this query in components
export const { useGetMenusQuery } = extendedApi;
