"use client";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useGetMenusQuery } from "@/Redux/RTK/api";
import Link from "next/link";

const Sidebar = () => {
  const { data: menus, isLoading } = useGetMenusQuery({});

  if (isLoading) {
    return (
      <div className="fixed md:absolute w-full md:w-64 bottom-0 md:bottom-auto md:top-0 left-0 h-[70px] md:h-screen bg-zinc-950 border-r border-zinc-800/30 animate-pulse" />
    );
  }

  return (
    <nav className="fixed md:absolute w-full md:w-64 bottom-0 md:bottom-auto md:top-0 left-0 h-[70px] md:h-screen bg-zinc-950 border-r border-zinc-800/30 backdrop-blur-lg z-50">
      {/* Mobile Horizontal Scroll */}
      <div className="flex md:hidden h-full overflow-x-auto overflow-y-hidden px-4 gap-2 items-center scrollbar-hide">
        {menus?.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors group whitespace-nowrap"
          >
            <div className="w-5 h-5 flex items-center justify-center rounded-md overflow-hidden bg-zinc-800/50 group-hover:bg-zinc-700/50 transition-colors">
              <img
                src={item.image}
                alt=""
                className="w-4 h-4 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Desktop Vertical Layout */}
      <div className="hidden md:flex flex-col h-full">
        {/* Brand/Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800/30">
          <h1 className="text-lg font-semibold text-white">Dashboard</h1>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {menus?.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-all duration-200 group"
            >
              <div className="w-6 h-6 flex items-center justify-center rounded-md overflow-hidden bg-zinc-800/50 group-hover:bg-zinc-700/50 transition-colors">
                <img
                  src={item.image}
                  alt=""
                  className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Footer Area - Optional */}
        <div className="h-16 flex items-center px-6 border-t border-zinc-800/30">
          <span className="text-xs text-zinc-500">© 2025 Dashboard</span>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
