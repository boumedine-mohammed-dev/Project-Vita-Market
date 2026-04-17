'use client'

import { useAuthStore } from "@/app/Store/useAuthStore";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const getCategoryIcon = (nom = "") => {
  const n = nom.toLowerCase();
  if (n.includes("pain") || n.includes("farine") || n.includes("pate")) return "grain";
  if (n.includes("boisson")) return "local_drink";
  if (n.includes("chocolat") || n.includes("confiserie")) return "cookie";
  if (n.includes("lait") || n.includes("fromage") || n.includes("laitier")) return "water_drop";
  if (n.includes("bio")) return "eco";
  if (n.includes("complément")) return "medication";
  if (n.includes("cosm")) return "spa";
  if (n.includes("tradition")) return "restaurant";
  if (n.includes("sucre") || n.includes("cétogène")) return "local_cafe";
  if (n.includes("gluten") || n.includes("lactose")) return "no_food";
  return "category";
};

export default function Navbar() {
  const { user } = useAuthStore();
  const [allCategories, setAllCategories] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);
  const [hoveredParent, setHoveredParent] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/categories/");
        const data = await res.json();
        setAllCategories(data);
        const parents = data.filter((c) => !c.categorie_parente);
        const tree = parents.map((p) => ({
          ...p,
          children: data.filter((c) => c.categorie_parente === p.nom),
        }));
        setCategoryTree(tree);
        if (tree.length > 0) setHoveredParent(tree[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const openMenu = () => {
    clearTimeout(closeTimer.current);
    setMenuOpen(true);
  };

  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setMenuOpen(false), 120);
  };

  return (
    <nav className="font-display sticky top-0 z-50 bg-white/80 dark:bg-[#182111]/80 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">eco</span>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Vita<span className="text-primary">Market</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full focus:ring-2 focus:ring-primary text-sm"
                placeholder="Rechercher des produits biologiques…"
                type="text"
              />
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Categories trigger */}
            <div
              className="relative"
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
              ref={menuRef}
            >
              <button
                className={`flex items-center gap-1 text-sm font-semibold transition-colors ${menuOpen ? "text-primary" : "hover:text-primary"}`}
              >
                Catégories
                <span
                  className="material-symbols-outlined text-sm transition-transform duration-200"
                  style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  expand_more
                </span>
              </button>

              {/* Mega-menu dropdown */}
              {menuOpen && categoryTree.length > 0 && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[560px] bg-white dark:bg-[#182111] rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-100 dark:border-slate-800 overflow-hidden"
                  onMouseEnter={openMenu}
                  onMouseLeave={closeMenu}
                >
                  {/* small arrow pointer */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#182111] border-l border-t border-slate-100 dark:border-slate-800 rotate-45" />

                  <div className="flex h-[320px]">
                    {/* Left column — parent categories */}
                    <div className="w-52 shrink-0 border-r border-slate-100 dark:border-slate-800 overflow-y-auto py-3">
                      <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Familles
                      </p>
                      {categoryTree.map((parent) => (
                        <button
                          key={parent.id}
                          onMouseEnter={() => setHoveredParent(parent)}
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center justify-between w-full px-4 py-2.5 text-left transition-all group ${hoveredParent?.id === parent.id
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`material-symbols-outlined text-base transition-colors ${hoveredParent?.id === parent.id ? "text-primary" : "text-slate-400"
                                }`}
                            >
                              {getCategoryIcon(parent.nom)}
                            </span>
                            <span className="text-sm font-semibold">{parent.nom}</span>
                          </div>
                          {parent.children.length > 0 && (
                            <span
                              className={`material-symbols-outlined text-sm ${hoveredParent?.id === parent.id ? "text-primary" : "text-slate-300"
                                }`}
                            >
                              chevron_right
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Right column — children of hovered parent */}
                    <div className="flex-1 overflow-y-auto py-3 px-2">
                      {hoveredParent && (
                        <>
                          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {hoveredParent.nom}
                          </p>
                          {hoveredParent.children.length > 0 ? (
                            <div className="grid grid-cols-2 gap-1">
                              {hoveredParent.children.map((child) => (
                                <Link
                                  key={child.id}
                                  href={`/products?category=${encodeURIComponent(child.nom)}`}
                                  onClick={() => setMenuOpen(false)}
                                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary text-slate-600 dark:text-slate-400 transition-all group"
                                >
                                  <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-primary transition-colors">
                                    {getCategoryIcon(child.nom)}
                                  </span>
                                  <span className="text-sm font-medium">{child.nom}</span>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-300 gap-2">
                              <span className="material-symbols-outlined text-4xl">inbox</span>
                              <p className="text-xs">Aucune sous-catégorie</p>
                            </div>
                          )}

                          {/* View all link */}
                          <div className="mt-3 px-3">
                            <Link
                              href={`/products?category=${encodeURIComponent(hoveredParent.nom)}`}
                              onClick={() => setMenuOpen(false)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                            >
                              Voir tout — {hoveredParent.nom}
                              <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">Notre histoire</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button className="cursor-pointer flex size-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#81e240]/20 hover:text-[#81e240] transition-all">
                <span className="material-symbols-outlined text-[20px]">favorite</span>
              </button>
              <button className="cursor-pointer flex size-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#81e240]/20 hover:text-[#81e240] transition-all relative">
                <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                <span className="absolute top-0.5 right-0.5 bg-primary text-[10px] font-bold px-1.5 rounded-full border-2 border-white dark:border-background-dark"> 3 </span>
              </button>
            </div>
            <Link href={user ? "/profile" : "/login"}>
              {user ? (
                <button className="cursor-pointer flex size-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#81e240]/20 hover:text-[#81e240] transition-all">
                  <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">person</span>
                </button>
              ) : (
                <button className="cursor-pointer hidden sm:block px-5 py-2 text-sm font-bold bg-primary text-slate-900 rounded-full hover:bg-primary/90 transition-all shadow-sm">
                  Se connecter
                </button>
              )}
            </Link>
            <button className="md:hidden p-2">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}