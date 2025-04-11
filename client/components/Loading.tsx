import React from "react";
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="relative bg-zinc-900 rounded-lg p-8 shadow-2xl border border-zinc-800/50">
        {/* Primary spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-zinc-700 border-t-indigo-500"></div>

        {/* Centered icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2
            className="w-8 h-8 text-indigo-500 animate-pulse"
            strokeWidth={1.5}
          />
        </div>

        {/* Outer glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl rounded-lg"></div>
      </div>
    </div>
  );
};

export default Loading;
