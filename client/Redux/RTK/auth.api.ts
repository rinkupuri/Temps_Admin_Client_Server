import { apiSlice } from "@/Redux/RTK/slicer"; // Assuming your main apiSlice is in this file
import { User } from "@/types/types";
import { setUser } from "../State/api.slice";

// Inject the authentication endpoints into the existing API slice
export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url: "/auth/get",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: { user: User }) => {
        // Optionally process the response data
        return response?.user; // Return the user data
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data)); // Dispatch setUser with the user data
        } catch (error) {
          // Handle the error
        }
      },
    }),

    loginUser: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: { user: User }) => {
        // Optionally process the response data
        return response?.user; // Return the user data
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data)); // Dispatch setUser with the user data
        } catch (error) {
          // Handle the error
        }
      },
    }),
  }),
  overrideExisting: false, // This ensures the existing endpoints are not overwritten
});

export const { useGetUserQuery, useLoginUserMutation } = extendedApi;
