import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgriOwner",
  description: "日本の農家・林業家の支援者になろう",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-gray-100 flex items-center px-4 shadow-sm">
          <Sidebar />
          <Image src="/agriowner_icon_1024.png" alt="AgriOwner" width={32} height={32} className="ml-3 rounded-lg" />
          <span className="ml-2 font-bold text-gray-900">AgriOwner</span>
        </header>
        <div className="pt-14">
          {children}
        </div>
      </body>
    </html>
  );
}
