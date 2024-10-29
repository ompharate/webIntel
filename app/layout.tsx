"use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import MouseCircle from "@/components/ui/MouseCircle";
import { AlertProvider } from "@/context/AlertContext";
import AuthProvider from "./providers/AuthProvider";
import Navbar from "@/components/ui/Navbar";
import { useEffect } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <AlertProvider>
            <MouseCircle />
            <Navbar />
            {children}
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
