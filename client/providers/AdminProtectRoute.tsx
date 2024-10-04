"use client";
import Loading from "@/components/Loading";
import { useGetUserQuery } from "@/Redux/RTK/auth.api";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AdminProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading, error } = useGetUserQuery({});
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !error && user) {
      if (user.role !== "ADMIN") {
        router.push("/");
      }
    }
    if (!isLoading && error && !user) {
      router.push("/login");
    }
  }, [user, isLoading, error]);
  return (
    <div>{isLoading ? <Loading /> : user?.role === "ADMIN" && children}</div>
  );
};

export default AdminProtectRoute;
