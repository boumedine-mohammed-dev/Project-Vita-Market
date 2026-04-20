import React from 'react'

export default function Navbarvendortop() {
    return (
        <header className="p-5 h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark sticky top-0 z-10 font-display">
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
    )
}