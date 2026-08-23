import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/providers/LenisProvider";
import Navbar from "@/components/layout/Navbar";
import Preloader from "@/components/layout/Preloader";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Red Bull",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased overflow-x-hidden`}>
      <body className="min-h-dvh flex flex-col">
        <Preloader />
        <LenisProvider>
          <Navbar />
          {children}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
