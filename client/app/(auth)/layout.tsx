import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import AuthProvider from "@/providers/AuthChecker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Temps -  Admin",
  description: "Admin Panel For Managing Temps Stock",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className={`${inter.className} dark overflow-hidden h-screen`}>
      <AuthProvider>{children}</AuthProvider>
    </section>
  );
}
