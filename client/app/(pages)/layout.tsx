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
      <section className={`${inter.className} dark overflow-hidden h-screen`}>
        <div className="flex flex-col h-full w-full ">
          <Navbar />
          <div className="flex w-full h-full gap-4">
            <div className="flex-[1] flex justify-center items-center  z-[99] bg-black border-b-white border-[0.5px] md:relative md:h-full fixed bottom-0 left-0 w-full h-[70px] md:block">
              <Sidebar />
            </div>
            <CartProvidersComp>
              <div className="flex-[5] overflow-y-scroll">{children}</div>
            </CartProvidersComp>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
