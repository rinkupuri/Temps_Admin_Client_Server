"use client";
import { useGetUserQuery } from "@/Redux/RTK/auth.api";
import { setUser } from "@/Redux/State/api.slice";
import { RootState } from "@/Redux/Store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { data, isLoading, isError } = useGetUserQuery({});
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if there's an error and no data
    if (isError && !data) {
      router.push("/login");
      return;
    }

    // Set the user data if we have fetched it but it's not in the Redux store
    if (data && !user && !isLoading) {
      dispatch(setUser(data));
    }

    // Check for user permissions on the current path
    if (user?.user) {
      const hasPermission = user.user.Permission?.includes(
        pathname.replace("/", "")
      );

      // Redirect to home if user does not have permission for the current path
      if (!hasPermission && pathname !== "/") {
        router.push("/");
      }
    }
  }, [data, dispatch, isError, isLoading, pathname, router, user]);

  // Render children only if user has permission
  const hasPermission = user?.user?.Permission?.includes(
    pathname.replace("/", "")
  );

  return (
    <>
      {!isLoading && data && !isError && (hasPermission || pathname === "/") ? (
        <div>{children}</div>
      ) : null}
    </>
  );
};

export default ProtectedRoute;
