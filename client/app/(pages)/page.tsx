"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { useGetMenusQuery } from "@/Redux/RTK/api";
import Image from "next/image";

const Page = () => {
  const { data, isLoading } = useGetMenusQuery({});
  return (
    <>
      {!isLoading && (
        <div className="w-full flex justify-center my-10 mb-32 items-center">
          <div className="grid place-items-center gap-5 grid-cols-1 md:grid-cols-2">
            {data?.map((value, index) => (
              <Link key={index} href={value.link}>
                <Card className="w-[250px] h-[250px] py-2 flex justify-c  enter items-center flex-col">
                  <Image
                    width={200}
                    height={200}
                    loading="lazy"
                    className="w-full object-contain my-3 h-[70px]"
                    src={value.image}
                    alt={value.name}
                  />
                  <CardHeader>{value.name}</CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 text-center">{value.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
