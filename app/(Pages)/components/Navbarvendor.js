"use client"
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/app/Store/useAuthStore";

export default function Navbarvendor() {
    const { user, logout } = useAuthStore();
    const pathname = usePathname();
    const [active, setActive] = useState(pathname);
    const link = [
        { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
        { href: "/vendor-products", label: "My Products", icon: "package_2" },
        { href: "/orders", label: "Orders", icon: "shopping_cart" },
        { href: "/settings", label: "Store Settings", icon: "settings" },
    ];
    console.log(user);
    return (
        <aside className="font-display w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col justify-between p-4">
            <div className="flex flex-col gap-8">
                {/* Branding */}
                <div className="flex items-center gap-3 px-2">
                    <div className="bg-[#81e240] rounded-lg p-2 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white">eco</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-tight">
                            Organic Market
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Verified Vendor
                        </p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1">
                    {link.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${active === item.href ? "bg-[#81e240]/10 text-[#81e240] font-semibold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"}`}
                            onClick={() => {
                                setActive(item.href);
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
                            setActive("/login");
                            logout();
                        }}
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm">Logout</span>
                    </Link>
                </nav>
            </div>

        </aside>
    )
}