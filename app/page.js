'use client'
import Navbar from "./(Pages)/components/Navbarclient";
import Hero from "./(Pages)/components/Hero";
import Categories from "./(Pages)/components/Categories";
import FeaturedProducts from "./(Pages)/components/FeaturedProducts";
import NewArrivalsAndPromo from "./(Pages)/components/NewArrivals";
import LocalSpecialties from "./(Pages)/components/LocalSpecialties";
import Footer from "./(Pages)/components/Footer";
import { useAuthStore } from "./Store/useAuthStore";
import { useEffect } from "react";

export default function Home() {
  const { checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
      {/* Sticky Navigation Bar */}
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <Hero />
        {/* Categories Quick Links */}
        <Categories />
        {/* Featured Products */}
        <FeaturedProducts />
        {/* New Arrivals & Promo Section */}
        <NewArrivalsAndPromo />
        {/* Local Terroir Specialties */}
        <LocalSpecialties />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
