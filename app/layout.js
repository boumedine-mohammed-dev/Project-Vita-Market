'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useAuthStore } from "./Store/useAuthStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  const router = useRouter();
  const { checkAuth, user } = useAuthStore();
  useEffect(() => {
    checkAuth();
    if (user) {
      if (user.role === "client") {
        router.push("/");
      } else if (user.role === "vendor") {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
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
