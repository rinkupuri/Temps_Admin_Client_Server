/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { useGetMenusQuery } from "@/Redux/RTK/api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Settings } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const { data: menus, isLoading } = useGetMenusQuery({});
  const [isHovered, setIsHovered] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="fixed md:absolute w-full md:w-72 bottom-0 md:bottom-auto md:top-0 left-0 h-[70px] md:h-screen bg-zinc-950/80 border-r border-zinc-800/30 animate-pulse" />
    );
  }

  const isActive = (link: string) => pathname === link;

  return (
    <nav className="fixed md:absolute w-full md:w-72 bottom-0 md:bottom-auto md:top-0 left-0 h-[70px] md:min-h-[calc(100vh-4.2rem)] bg-zinc-950/80 border-r border-zinc-800/30 backdrop-blur-xl z-50">
      {/* Mobile Horizontal Scroll */}
      <div className="flex md:hidden h-full overflow-x-auto overflow-y-hidden px-4 gap-3 items-center scrollbar-hide">
        {menus?.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${
              isActive(item.link)
                ? "bg-white/10 text-white"
                : "bg-zinc-900/50 hover:bg-zinc-800/50"
            } transition-all duration-300 group whitespace-nowrap`}
          >
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-lg overflow-hidden ${
                isActive(item.link)
                  ? "bg-white/20"
                  : "bg-zinc-800/50 group-hover:bg-zinc-700/50"
              } transition-colors`}
            >
              <img
                src={item.image}
                alt=""
                className="w-4 h-4 object-contain opacity-90 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
            <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Desktop Vertical Layout */}
      <div className="hidden md:flex flex-col min-h-[calc(100vh-4.2rem)] overflow-hidden">
        {/* Brand/Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-zinc-800/30">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </Link>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {menus?.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              onMouseEnter={() => setIsHovered(index)}
              onMouseLeave={() => setIsHovered(null)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl ${
                isActive(item.link)
                  ? "bg-white/10 text-white"
                  : "hover:bg-zinc-800/50"
              } transition-all duration-300 group`}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-lg overflow-hidden ${
                  isActive(item.link)
                    ? "bg-white/20"
                    : "bg-zinc-800/50 group-hover:bg-zinc-700/50"
                } transition-colors`}
              >
                <img
                  src={item.image}
                  alt=""
                  className="w-5 h-5 object-contain opacity-90 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
              <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                {item.name}
              </span>
              {isHovered === index && !isActive(item.link) && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute right-4"
                >
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </motion.div>
              )}
              {isActive(item.link) && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Footer Area */}
        <div className="h-20 flex items-center px-8 border-t border-zinc-800/30">
          <div className="w-full flex items-center justify-between">
            <span className="text-sm text-zinc-500">© 2025 Dashboard</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-zinc-400">Online</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
