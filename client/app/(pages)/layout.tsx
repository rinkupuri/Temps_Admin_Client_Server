import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CartProvidersComp from "@/providers/CartProviders";
import AuthProvider from "@/providers/AuthChecker";
import ProtectedRoute from "@/providers/ProtectedRoute";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Temps -  Admin",
  description: "Admin Panel For Managing Temps Stock",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-4.2rem)] bg-zinc-900">
        {/* Main Layout Container */}
        <div className="relative flex mt-[4.2rem] min-h-[calc(100vh-4.2rem)] w-full overflow-hidden">
          {/* Sidebar - Desktop */}
          <div className="hidden md:flex md:w-64 md:flex-col">
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col">
            {/* Navbar */}
            <Navbar />

            {/* Content Wrapper */}
            <CartProvidersComp>
              <main className="flex-1 pb-8">
                {/* Content Container */}
                <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-9xl mx-auto">
                  {/* Scrollable Area */}
                  <div className="h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
                    {children}
                  </div>
                </div>
              </main>
            </CartProvidersComp>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur-lg border-t border-zinc-800/30">
            <Sidebar />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
