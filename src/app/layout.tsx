import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { AuthDebug } from "@/components/AuthDebug";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThriveUp",
  description: "Campus Pulse at your fingertips !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-[#FFD1A1] to-white text-black`}>
        <Providers>
          <div className="min-h-screen">
            {children}
          </div>
          <AuthDebug />
        </Providers>
      </body>
    </html>
  );
}
