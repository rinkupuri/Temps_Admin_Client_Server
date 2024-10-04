import { apiSlice } from "./slicer";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: () => ({
        url: "/user/getall",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    updateUserPermission: builder.mutation({
      query: ({ id, permissions }) => ({
        url: `/user/update/${id}`,
        method: "PUT",
        body: { permissions },
      }),
    }),
  }),
});

export const { useGetAllUserQuery, useUpdateUserPermissionMutation } = userApi;
