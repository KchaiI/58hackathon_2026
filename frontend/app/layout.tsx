import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "支援者枠マーケット",
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
          <span className="ml-3 font-bold text-gray-900">仮タイトル</span>
        </header>
        <div className="pt-14">
          {children}
        </div>
      </body>
    </html>
  );
}
