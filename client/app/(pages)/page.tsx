"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useGetMenusQuery } from "@/Redux/RTK/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const MenuCard = ({ data }: { data: any }) => (
  <motion.div variants={item}>
    <Link href={data.link}>
      <Card className="group relative overflow-hidden border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-zinc-950/20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="h-16 w-16 overflow-hidden rounded-2xl bg-zinc-800/50 p-3"
            >
              <Image
                src={data.image}
                alt={data.name}
                width={64}
                height={64}
                className="h-full w-full object-contain transition-all duration-300 group-hover:scale-110"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.5, x: 0 }}
              className="text-zinc-400 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
            >
              <ArrowRight size={20} />
            </motion.div>
          </div>

          <CardHeader className="space-y-1 p-0 pt-6">
            <motion.h3 className="text-xl font-semibold tracking-tight text-zinc-100 transition-colors group-hover:text-white">
              {data.name}
            </motion.h3>
          </CardHeader>

          <CardContent className="space-y-2 p-0 pt-2">
            <p className="line-clamp-2 text-sm text-zinc-400 transition-colors group-hover:text-zinc-300">
              {data.desc}
            </p>
          </CardContent>
        </div>
      </Card>
    </Link>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Card
        key={i}
        className="overflow-hidden border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-16 w-16 rounded-2xl bg-zinc-800/50" />
            <Skeleton className="h-6 w-6 rounded-full bg-zinc-800/50" />
          </div>
          <div className="space-y-2 pt-6">
            <Skeleton className="h-6 w-2/3 bg-zinc-800/50" />
            <Skeleton className="h-4 w-full bg-zinc-800/50" />
            <Skeleton className="h-4 w-4/5 bg-zinc-800/50" />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

const Page = () => {
  const { data: menus, isLoading } = useGetMenusQuery({});

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {menus?.map((item, index) => (
          <MenuCard key={index} data={item} />
        ))}
      </motion.div>
    </div>
  );
};

export default Page;
