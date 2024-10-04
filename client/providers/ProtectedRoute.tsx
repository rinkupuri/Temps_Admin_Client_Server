"use client";
import { useGetUserQuery } from "@/Redux/RTK/auth.api";
import { setUser } from "@/Redux/State/api.slice";
import { RootState } from "@/Redux/Store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, status, error } = useGetUserQuery({});
  const { user } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (error && !data && status === "rejected") router.push("/login");
    if (data && !user && status === "fulfilled") dispatch(setUser(data));
  }, [data, isLoading, status]);
  return (
    <>{!isLoading && data && status !== "rejected" && <div>{children}</div>}</>
  );
};

export default ProtectedRoute;
