'use client'
import { useEffect, useState } from "react";
import { useClientStore } from "@/app/Store/useClientStore";
import Link from "next/link";


export default function Categories() {
  const { categories, fetchCategories } = useClientStore();
  const icons = [
    'no_food',
    'fitness_center',
    'no_drinks',
    'local_cafe',
    'eco',
    'cookie',
    'restaurant',
    'medication',
    'spa',
    'category'
  ]

  useEffect(() => {
    fetchCategories();
  }, []);
  console.log("categories", categories)
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
      <Link
        href={`/products`}
        className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-primary transition-colors cursor-pointer group"
      >
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary transition-colors">
          <span className="material-symbols-outlined text-primary group-hover:text-white">grid_view</span>
        </div>
        <span className="text-sm font-bold text-center">All Products</span>
      </Link>
      {
        categories.map((c, index) => (
          <Link
            href={`/products?category=${encodeURIComponent(c?.nom)}`}
            key={index}
            className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-primary transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-primary group-hover:text-white">{icons[index]}</span>
            </div>
            <span className="text-sm font-bold text-center">{c?.nom}</span>
          </Link>
        ))
      }
    </div >
  )
}
