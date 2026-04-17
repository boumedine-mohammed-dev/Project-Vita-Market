"use client"
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbarvendor() {
    const pathname = usePathname();
    const [active, setActive] = useState(pathname);
    const link = [
        { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
        { href: "/vendor-products", label: "My Products", icon: "package_2" },
        { href: "/inventory", label: "Manage Inventory", icon: "inventory_2" },
        { href: "/analytics", label: "Analytics", icon: "analytics" },
        { href: "/settings", label: "Store Settings", icon: "settings" },
    ];
    console.log(link);
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
                </nav>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <div
                        className="w-10 h-10 rounded-full bg-slate-200 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAxiTd_zsht7_tm4mFQ6AsA7SrUcCnFz_XODkQYUutbGFK9u0vwHq3C3rgnn09Y_1v42GL05u6mFDs07Agb9RSqj5d9uO3F6N2Knivvw_HOFInOTm1vAm9bQeKbVDWlsxJR9aRkWyOmLOsrWatYGtxjZXTlfwlsKRhaLvMkVGbAXl8xOV4j2fEdsL4ToKLBi9ASaszmPROF4I7SLqsknRMr79c5svxaBzAH3rZHGcnWgb42y8iNPRlNL6C_t3LLbBz4_8DdW3fGNtEf')",
                        }}
                    ></div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">Fresh Greens Co.</p>
                        <p className="text-xs text-slate-500 truncate">
                            Pro Plan Member
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}