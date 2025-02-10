import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Dashboard page",
  description: "Dashboard for smart delivery app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
            <div className="min-h-screen bg-gray-100 text-black">
              {children}
            </div>
      </body>
    </html>
  );
}
