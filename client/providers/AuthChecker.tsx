"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/Redux/State/api.slice";
import { useGetUserQuery } from "@/Redux/RTK/auth.api";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // Use the RTK Query to get the user
  const { data: qUser, error, isLoading } = useGetUserQuery({});

  useEffect(() => {
    if (!isLoading && !error && qUser) {
      dispatch(setUser(qUser));
      router.push("/");
    }
    if (!isLoading && error && !qUser) {
      if (pathname !== "/register") router.push("/login");
    }
  }, [qUser, isLoading, error, pathname, dispatch, router]);

  return <>{isLoading ? <Loading /> : !qUser && children}</>;
};

export default AuthProvider;
