"use client";

import Link from "next/link";
import React from "react";
import { Bell, ShoppingCart, Upload, Download, User } from "lucide-react";
import { motion } from "framer-motion";
import { Import } from "./Dialog/Import";
import { useGetUserQuery } from "@/Redux/RTK/auth.api";

const iconVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1 },
};

const IconWrapper = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <motion.div
    variants={iconVariants}
    initial="initial"
    whileHover="hover"
    className="relative group"
  >
    {children}
    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
      {title}
    </div>
  </motion.div>
);

const Navbar = () => {
  const { data: user, isLoading } = useGetUserQuery({});

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 5 }}
              className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-lg"
            >
              <span className="font-bold text-white text-xl">T</span>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Temps
            </span>
          </Link>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-6">
            <IconWrapper title="Notifications">
              <button className="relative text-zinc-400 hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </IconWrapper>

            <IconWrapper title="Import">
              <div className="text-zinc-400 hover:text-white transition-colors">
                <Import />
              </div>
            </IconWrapper>

            <IconWrapper title="Export">
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Download size={20} />
              </button>
            </IconWrapper>

            <IconWrapper title="Cart">
              <Link
                href="/cart"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <ShoppingCart size={20} />
              </Link>
            </IconWrapper>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group ml-2"
            >
              <button className="flex items-center space-x-2 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-full px-4 py-1.5 transition-colors">
                <User size={18} className="text-zinc-400" />
                <span className="text-sm text-zinc-300">
                  {isLoading ? "Loading..." : user?.name || "Account"}
                </span>
              </button>
              <div className="absolute -bottom-12 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Profile
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
