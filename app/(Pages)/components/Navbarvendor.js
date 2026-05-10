"use client"
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/app/Store/useAuthStore";

export default function NavbarVendeur() {
    const { user, logout } = useAuthStore();
    const pathname = usePathname();
    const [actif, setActif] = useState(pathname);

    const liens = [
        { href: "/dashboard", label: "Tableau de bord", icon: "dashboard" },
        { href: "/vendor-products", label: "Mes produits", icon: "package_2" },
        { href: "/orders", label: "Commandes", icon: "shopping_cart" },
        { href: "/settings", label: "Paramètres de la boutique", icon: "settings" },
    ];

    console.log(user);

    return (
        <aside className="font-display w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col justify-between p-4">
            <div className="flex flex-col gap-8">
                {/* Marque */}
                <Link onClick={() => setActif("/dashboard")} href="/dashboard" className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-3xl">eco</span>
                    <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                        Vita<span className="text-primary">Market</span>
                    </span>
                </Link>

                {/* Liens de navigation */}
                <nav className="flex flex-col gap-1">
                    {liens.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${actif === item.href
                                ? "bg-[#81e240]/10 text-[#81e240] font-semibold"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                }`}
                            onClick={() => {
                                setActif(item.href);
                            }}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    ))}

                    <Link
                        href="/login"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => {
                            setActif("/login");
                            logout();
                        }}
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm">Se déconnecter</span>
                    </Link>
                </nav>
            </div>
        </aside>
    );
}