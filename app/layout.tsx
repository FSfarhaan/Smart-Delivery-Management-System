import type { Metadata } from "next";
import "./globals.css";

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
