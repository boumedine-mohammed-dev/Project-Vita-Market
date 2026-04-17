import Image from "next/image";
import Link from "next/link";

export default function VendorDashboardPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            <div className="flex h-screen overflow-hidden">
                {/* Side Navigation */}

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col overflow-y-auto">
                    {/* Header */}
                    <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark sticky top-0 z-10">
                        <div className="flex items-center gap-4 w-96">
                            <div className="relative w-full">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                    search
                                </span>
                                <input
                                    className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#81e240]/50"
                                    placeholder="Search orders, products..."
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative flex items-center justify-center">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
                            </button>
                            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined">chat_bubble</span>
                            </button>
                            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Monday, Oct 23</span>
                                <span className="material-symbols-outlined text-slate-400">
                                    calendar_today
                                </span>
                            </div>
                        </div>
                    </header>

                    {/* Content Body */}
                    <div className="p-8 space-y-8">
                        {/* Page Title */}
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight">
                                Vendor Dashboard
                            </h2>
                            <p className="text-slate-500 mt-1">
                                Manage your organic farm sales and monitor customer engagement.
                            </p>
                        </div>

                        {/* KPI Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            Total Sales
                                        </p>
                                        <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">
                                            $14,285.50
                                        </h3>
                                    </div>
                                    <div className="p-2 bg-[#81e240]/10 rounded-lg text-[#81e240]">
                                        <span className="material-symbols-outlined text-[#81e240]">
                                            payments
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mt-4">
                                    <span className="material-symbols-outlined text-emerald-500 text-sm">
                                        trending_up
                                    </span>
                                    <span className="text-sm font-bold text-emerald-500">
                                        +12.4%
                                    </span>
                                    <span className="text-xs text-slate-400 ml-1">
                                        vs last month
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            Active Orders
                                        </p>
                                        <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">
                                            42
                                        </h3>
                                    </div>
                                    <div className="p-2 bg-[#81e240]/10 rounded-lg text-[#81e240]">
                                        <span className="material-symbols-outlined text-[#81e240]">
                                            local_shipping
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mt-4">
                                    <span className="material-symbols-outlined text-emerald-500 text-sm">
                                        trending_up
                                    </span>
                                    <span className="text-sm font-bold text-emerald-500">
                                        +8.1%
                                    </span>
                                    <span className="text-xs text-slate-400 ml-1">
                                        8 pending delivery
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            Customer Satisfaction
                                        </p>
                                        <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">
                                            4.9/5.0
                                        </h3>
                                    </div>
                                    <div className="p-2 bg-[#81e240]/10 rounded-lg text-[#81e240]">
                                        <span className="material-symbols-outlined text-[#81e240]">
                                            star
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mt-4">
                                    <span className="material-symbols-outlined text-amber-500 text-sm">
                                        check_circle
                                    </span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                        Top Rated Vendor
                                    </span>
                                    <span className="text-xs text-slate-400 ml-1">
                                        based on 124 reviews
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Sales Trends Chart Section */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h4 className="text-lg font-bold">Sales Trends</h4>
                                    <p className="text-sm text-slate-500">
                                        Weekly revenue overview from October 2023
                                    </p>
                                </div>
                                <select className="text-sm border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-lg py-1 px-3 outline-none ring-[#81e240]/20 focus:ring-4">
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                    <option>This Year</option>
                                </select>
                            </div>
                            <div className="h-64 w-full flex flex-col">
                                <div className="flex-1 flex items-end gap-2 px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                                    {/* Simulated Chart Bars */}
                                    <div className="flex-1 flex flex-col justify-end gap-1 group">
                                        <div
                                            className="w-full bg-[#81e240]/20 hover:bg-[#81e240] transition-all rounded-t-lg"
                                            style={{ height: "40%" }}
                                        ></div>
                                        <span className="text-[10px] text-center text-slate-400">
                                            Mon
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-end gap-1 group">
                                        <div
                                            className="w-full bg-[#81e240]/20 hover:bg-[#81e240] transition-all rounded-t-lg"
                                            style={{ height: "65%" }}
                                        ></div>
                                        <span className="text-[10px] text-center text-slate-400">
                                            Tue
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-end gap-1 group">
                                        <div
                                            className="w-full bg-[#81e240]/20 hover:bg-[#81e240] transition-all rounded-t-lg"
                                            style={{ height: "55%" }}
                                        ></div>
                                        <span className="text-[10px] text-center text-slate-400">
                                            Wed
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-end gap-1 group">
                                        <div
                                            className="w-full bg-[#81e240]/20 hover:bg-[#81e240] transition-all rounded-t-lg"
                                            style={{ height: "85%" }}
                                        ></div>
                                        <span className="text-[10px] text-center text-slate-400">
                                            Thu
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-end gap-1 group">
                                        <div
                                            className="w-full bg-[#81e240]/20 hover:bg-[#81e240] transition-all rounded-t-lg"
                                            style={{ height: "70%" }}
                                        ></div>
                                        <span className="text-[10px] text-center text-slate-400">
                                            Fri
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-end gap-1 group">
                                        <div
                                            className="w-full bg-[#81e240]/20 hover:bg-[#81e240] transition-all rounded-t-lg"
                                            style={{ height: "95%" }}
                                        ></div>
                                        <span className="text-[10px] text-center text-slate-400">
                                            Sat
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-end gap-1 group">
                                        <div
                                            className="w-full bg-[#81e240]/20 hover:bg-[#81e240] transition-all rounded-t-lg"
                                            style={{ height: "60%" }}
                                        ></div>
                                        <span className="text-[10px] text-center text-slate-400">
                                            Sun
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <h4 className="text-lg font-bold">Recent Orders</h4>
                                <button className="text-sm font-semibold text-[#81e240] hover:underline">
                                    View All Orders
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Order ID</th>
                                            <th className="px-6 py-4">Customer</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        <tr>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                #ORD-2849
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-7 h-7 rounded-full bg-slate-200 bg-cover bg-center"
                                                        style={{
                                                            backgroundImage:
                                                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAktoCt8e8FviJ69neUQc2r85QB1kDoflHQW1D453x__3Lz6s34Wrpa_MykdJTYK-OBCFsnd0lt_NDUDebDn_-FxJQxJh7urAVU1aNFaSOLo6fF8iXvgrn8X8Fi5s2mA-HVUDev34_XJ4O2yPiJnJgKmmee8QCSz1DdQWHjrJe5Kubrjb9NvIUTq_cB6f1UrHFljSX8Jjcu056_SXVdIsMj6Hsj4vvwW4C_Qkl4bufhBfLOmobdyL-jllLL6PG0RogIWiprrH89SVOA')",
                                                        }}
                                                    ></div>
                                                    Sarah Johnson
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                Oct 23, 2023
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold">$124.00</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                                    Pending
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="material-symbols-outlined text-slate-400 hover:text-[#81e240]">
                                                    more_vert
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                #ORD-2848
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-7 h-7 rounded-full bg-slate-200 bg-cover bg-center"
                                                        style={{
                                                            backgroundImage:
                                                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCOIgnxQYIOoanEz2fWO4I9HB9aSdYKDxpSuklgi7wxVOg7Mrlu4aLxPIIZYlCyh1L9MW7VH2kV64uzHkfJolcFaPi6mSWT53fhjO8FpKPdY2udKi5YqaoYxjfJinWTxBOgcUEo8LKmJuz8Z96D9SqX3NpcS3UARU2Mr0vMcrtIPPZSdNZWpOFOzbapyd1yrVywSo0_wFyX-NLgqk5EU6BVNiKHNxH7s3bbO27zyQvLGaeN8SCJ_Frx1p-tQ-5XbLZhc6XzR0xwZ0Vt')",
                                                        }}
                                                    ></div>
                                                    Michael Chen
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                Oct 22, 2023
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold">$89.50</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                    Shipped
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="material-symbols-outlined text-slate-400 hover:text-[#81e240]">
                                                    more_vert
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                #ORD-2847
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-7 h-7 rounded-full bg-slate-200 bg-cover bg-center"
                                                        style={{
                                                            backgroundImage:
                                                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD4Sx4BwcZnjE2aOOrqrR1TohpfIX3nIiM5nIivQZIGI-nB2q7KiBj9m1bOLrXD_DwGA53kAmSzG8S9wiHPRbr42QwGnV4Um2hN07yVIbivT2oFFD5pgZInJnkUip2w0YCF7YZNGkkDDKOAS15UCiA958OhyWuuVdDo_gBRvdSCRTqev0jIXcnnysuSm0B2LlGzehP6ptAxk6_iJxRecovOEPZiC6qICQMDfVhX_-2Hrt3mQjQ6FWQ5oxDSWfEokSKiApTMHqA1HBDX')",
                                                        }}
                                                    ></div>
                                                    Robert Wilson
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                Oct 22, 2023
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold">$210.25</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    Delivered
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="material-symbols-outlined text-slate-400 hover:text-[#81e240]">
                                                    more_vert
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                #ORD-2846
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-7 h-7 rounded-full bg-slate-200 bg-cover bg-center"
                                                        style={{
                                                            backgroundImage:
                                                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOKceon9226vHYmQpIHGI1vGdkDRIOj7JORg3vmeCkFDcsgSDtG3r2wh5s1LwpJI4vTnxhZhFwLk3keYfoQxMyAHc_oxGSZgsn-NGUiEXQWx7E3blKvnghuFdqTp28gVh_zJCsOEnhqQxZ_8zXzkg_7_TgbqQLqogz82H3og6ZPJUlRayk6of1zG-jnzrtkxWhmWCJ2paBcmwYPJyMTIUPEjUgEwyA7upjOolli8GRekiht6V6k6KF-V6kWiDhd9diu46MdriD31aB')",
                                                        }}
                                                    ></div>
                                                    Emily Davis
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                Oct 21, 2023
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold">$45.00</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    Delivered
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="material-symbols-outlined text-slate-400 hover:text-[#81e240]">
                                                    more_vert
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Footer Section */}
                        <footer className="flex items-center justify-between text-xs text-slate-400 pt-8 pb-4">
                            <p>
                                © 2023 Organic Multi-Vendor Marketplace. All rights reserved.
                            </p>
                            <div className="flex gap-4">
                                <a className="hover:text-[#81e240]" href="#">
                                    Privacy Policy
                                </a>
                                <a className="hover:text-[#81e240]" href="#">
                                    Merchant Terms
                                </a>
                                <a className="hover:text-[#81e240]" href="#">
                                    Support
                                </a>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
}
