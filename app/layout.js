'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useAuthStore } from "./Store/useAuthStore";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  const { checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="antialiased">


        {children}

      </body>
    </html>
  );
}
