import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StateProvider from "@/providers/StateProvider";
import AuthProvider from "@/providers/AuthChecker";

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
    <html lang="en">
      <body className={`${inter.className} dark overflow-hidden h-screen`}>
        <StateProvider>{children} </StateProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </body>
    </html>
  );
}
