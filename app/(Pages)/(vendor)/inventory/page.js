'use client'
import Head from 'next/head'
import { useState } from 'react'

const inventoryItems = [
    {
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVhoia8vWGpIEPwHTBLVFJNOzr8_J7C_JOJmQZdZCi6YTC1_i1ek5DdfuY0vBnIQsy_6Mct8pxBmDsj-bWmj4HOuS4fZ--p9CZz4mp2A7cfYdTUs_l2sOR9_Zravh655dFx12vCcknh-emRxtlvknNOKzqUOz65dF4VdIGGW7-he0i-iUB6Movt3SCrcXibLFFgbZ8mIdWgIUXGnzimAmwg0im9Ib2GbpJzQepwQqmp77F3xvbBko44YGlZRarVcG3JrLujzIyVtFl',
        name: 'Heritage Organic Carrots', sku: 'HOC-001-OR',
        category: 'Vegetables', categoryStyle: 'bg-[#81e240]/10 text-emerald-700 dark:text-emerald-400',
        stock: '42 kg', percent: 80, barColor: 'bg-[#81e240]', stockLabel: '80%', disabled: false,
        price: '$3.50', unit: '/kg',
    },
    {
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFsA358dGwDFvDI_XkitydOAn3xtdp8jVfDvaINyxVzRQ3NCDcW9UCD3B1VbjS-EGFGmm3pVKq2bW1AbSsO-u9mc2soFC4-ekhfDe7l4bTbmdB7zImW1Lz8R8gsR7nnhgzlMMcHMZDoJuzw0Oj078sBjwE2TXyHZ4dVxa0IKgrLm9lYgs70nkpUTolSNNtwkfuEdwJ_MiEMX3Lpcoix-EvUEu8AAMKkRRLOkQdfXccrO7y6ImwHFChEm6dqEdRiBFTluoEmF--9rmK',
        name: 'Spring Garden Strawberries', sku: 'SGS-500-OR',
        category: 'Fruits', categoryStyle: 'bg-[#81e240]/10 text-emerald-700 dark:text-emerald-400',
        stock: '5 Units', percent: 15, barColor: 'bg-[#f97316]', stockLabel: 'Low', lowStock: true, disabled: false,
        price: '$6.25', unit: '/unit',
    },
    {
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA96ExuxtSqDtyCpIZ8x1YnD8r4LeD-RVGBNYAtf3oNUWbP23Jyfg5qBX_8UQH73GkKKj45W2gig254fjAbjEf5Dk_zxWOBiav3vtkDtm8KswiyjcPl96CEsPNT3FQPWSogugls__PETWtx5pDeeJIaA8v-OqafTKTtBb094SOaGuwg2LwBgn5ei5m7lyqLv873_cVqVB9oUB0LfoUq3fem5gb1WE-1Ui3Wb9a-Gw8_7U9AhBfmgjsoan4XtiFLJFGkSlkxOX6xNBGX',
        name: 'Grass-Fed Whole Milk', sku: 'GFM-001-DA',
        category: 'Dairy', categoryStyle: 'bg-[#81e240]/10 text-emerald-700 dark:text-emerald-400',
        stock: '18 Bottles', percent: 45, barColor: 'bg-[#81e240]', stockLabel: '45%', disabled: false,
        price: '$4.90', unit: '/1L',
    },
    {
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOEZNIv_GNk1CHfkZcS256Cg3g_S0NP0zOdslTLWtNoF_PVOu0rHnTFRj0a9MbGF4Fa-sHmm13GWNoy57XulctVBx5p_JsLJbdEsddIw4faIKyHdwjfYrSouyY7CeSWgFjcX-e4ITCNNr6MOxWfjDycaztYz2bMYUTrpFoXBemypNQNKMBtB3s4Kt5R4qvi1-F5upPkMVuvfdXl_p_c0Qu4H7mfY0ZAhO7v7kYHu2DV0K9w2bAmVAKFc1ypzzkvERAWMWfrDCZKPyw',
        name: 'Wild Shiitake Mushrooms', sku: 'WSM-250-OR',
        category: 'Vegetables', categoryStyle: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
        disabled: true,
        price: '$12.00', unit: '',
    },
]

const stats = [
    { icon: 'inventory_2', iconBg: 'bg-[#81e240]/10 text-[#81e240]', badge: '+3 this week', badgeBg: 'text-emerald-600 bg-emerald-50', label: 'Total Products', value: '124' },
    { icon: 'priority_high', iconBg: 'bg-[#f97316]/10 text-[#f97316]', badge: 'Action Needed', badgeBg: 'text-[#f97316] bg-orange-50', label: 'Low Stock Items', value: '8' },
    { icon: 'block', iconBg: 'bg-red-100 text-red-600', badge: null, label: 'Out of Stock', value: '2' },
    { icon: 'trending_up', iconBg: 'bg-blue-100 text-blue-600', badge: 'Top Category', badgeBg: 'text-blue-600 bg-blue-50', label: 'Active Categories', value: '12' },
]

const tabFilters = ['All Items', 'Active', 'Low Stock', 'Drafts']

export default function VendorInventoryPage() {
    const [showModal, setShowModal] = useState(false)
    const [activeFilter, setActiveFilter] = useState(0)

    return (
        <>
            <Head><title>Vendor Inventory Management | NatureMarket</title></Head>

            <div className="bg-[#f7f8f6] dark:bg-[#182111] text-slate-900 dark:text-slate-100 font-display min-h-screen relative">

                {/* Header */}
                <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#182111]/80 backdrop-blur-md border-b border-[#728764]/20 px-4 lg:px-10 py-3">
                    <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <div className="size-8 bg-[#81e240] rounded-lg flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined">eco</span>
                                </div>
                                <h2 className="text-lg font-bold leading-tight tracking-tight">NatureMarket <span className="text-[#81e240]">Vendor</span></h2>
                            </div>
                            <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                <span className="material-symbols-outlined text-[#728764] ml-2">search</span>
                                <input className="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-[#728764]" placeholder="Search inventory..." />
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <nav className="hidden xl:flex items-center gap-8">
                                {[
                                    { label: 'Dashboard', active: false },
                                    { label: 'Inventory', active: true },
                                    { label: 'Orders', active: false },
                                    { label: 'Analytics', active: false },
                                ].map(({ label, active }) => (
                                    <a key={label} className={`text-sm font-${active ? 'bold border-b-2 border-[#81e240] py-1 text-[#81e240]' : 'medium text-[#728764] hover:text-[#81e240] transition-colors'}`} href="#">{label}</a>
                                ))}
                            </nav>
                            <div className="flex items-center gap-4 border-l border-[#728764]/20 pl-6">
                                <button className="relative p-2 text-[#728764] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="absolute top-2 right-2 size-2 bg-[#f97316] rounded-full" />
                                </button>
                                <div className="size-10 rounded-full bg-[#81e240]/20 flex items-center justify-center border-2 border-[#81e240]/30 overflow-hidden">
                                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxbjaB2_vLuCxQqBwuYqBRX5MI_lGJNTn7Nfea-cFm-MVk_6OoUUXSFBwqeT4lnm_rXwrPxnqlzcB4cO2lO-t7m1njfNfSiWVpV1QAt6A1VKpSftopBEqp08gpm8yU1TCwGdkfPlVCG9wzB5U7mrDm5xNe97EMAE_iIaSihO1iQ3OeJOQ5x-Rfv4uxdVdv2-F2iN_0SxYBkiUOWa6uYH16d73qvKV5XimUckkrDMD3aAVq6nlPRe7AI1hwulYaVP0kvN7JUVqK06gw" alt="Vendor" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-[1440px] mx-auto w-full px-4 lg:px-10 py-8">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-[#728764] mb-2">
                                <span className="material-symbols-outlined text-sm">potted_plant</span>
                                <span className="text-sm font-medium uppercase tracking-wider">Organic Roots Farm</span>
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight">Inventory Management</h1>
                            <p className="text-[#728764] max-w-lg">Manage your organic products, monitor stock levels, and update pricing in real-time.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
                                <span className="material-symbols-outlined">file_download</span>
                                Export CSV
                            </button>
                            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-2.5 bg-[#81e240] text-slate-900 rounded-lg font-bold shadow-lg shadow-[#81e240]/20 hover:brightness-105 active:scale-95 transition-all">
                                <span className="material-symbols-outlined">add</span>
                                Add New Product
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map(({ icon, iconBg, badge, badgeBg, label, value }) => (
                            <div key={label} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-[#728764]/10 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-lg ${iconBg}`}>
                                        <span className="material-symbols-outlined">{icon}</span>
                                    </div>
                                    {badge && <span className={`text-xs font-bold px-2 py-1 rounded ${badgeBg}`}>{badge}</span>}
                                </div>
                                <p className="text-[#728764] text-sm font-medium">{label}</p>
                                <h3 className="text-2xl font-bold mt-1">{value}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#728764]/10 overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-[#728764]/10 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                {tabFilters.map((t, i) => (
                                    <button key={t} onClick={() => setActiveFilter(i)} className={`px-4 py-1.5 text-sm rounded-md transition-all ${i === activeFilter ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100 font-bold' : 'font-medium text-[#728764] hover:text-[#81e240]'}`}>{t}</button>
                                ))}
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#728764] text-xl">filter_list</span>
                                <select className="pl-10 pr-8 py-2 text-sm bg-white dark:bg-slate-800 border border-[#728764]/20 rounded-lg focus:ring-[#81e240] focus:border-[#81e240] appearance-none min-w-[140px]">
                                    <option>Category: All</option>
                                    <option>Vegetables</option>
                                    <option>Fruits</option>
                                    <option>Dairy</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[#728764] text-xs font-bold uppercase tracking-wider">
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Stock Level</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#728764]/10">
                                    {inventoryItems.map((item) => (
                                        <tr key={item.sku} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${item.disabled ? 'opacity-60 bg-slate-50/50 dark:bg-slate-800/20 grayscale' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                                        <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
                                                    </div>
                                                    <div>
                                                        <p className={`font-bold ${item.disabled ? 'italic' : ''}`}>{item.name}</p>
                                                        <p className="text-xs text-[#728764]">{item.sku}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm px-2.5 py-1 rounded-full font-medium ${item.categoryStyle}`}>{item.category}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.disabled ? (
                                                    <span className="text-xs font-bold px-2 py-0.5 border border-[#728764]/20 rounded uppercase">Disabled</span>
                                                ) : (
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                                                            {item.lowStock ? (
                                                                <div className="flex items-center gap-1 text-[#f97316]">
                                                                    <span className="material-symbols-outlined text-xs">warning</span>
                                                                    <span>{item.stock}</span>
                                                                </div>
                                                            ) : (
                                                                <span>{item.stock}</span>
                                                            )}
                                                            <span className={item.lowStock ? 'text-[#f97316]' : 'text-[#728764]'}>{item.stockLabel}</span>
                                                        </div>
                                                        <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full ${item.barColor}`} style={{ width: `${item.percent}%` }} />
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold">{item.price}<span className="text-xs font-normal text-[#728764] ml-1">{item.unit}</span></p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-[#728764] hover:text-[#81e240] hover:bg-[#81e240]/10 rounded-lg transition-all">
                                                        <span className="material-symbols-outlined text-xl">edit</span>
                                                    </button>
                                                    <button className={`p-2 rounded-lg transition-all ${item.disabled ? 'text-[#81e240] hover:bg-[#81e240]/20' : 'text-[#728764] hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                                                        <span className="material-symbols-outlined text-xl">{item.disabled ? 'visibility' : 'visibility_off'}</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-[#728764]/10 flex items-center justify-between">
                            <p className="text-sm text-[#728764]">Showing <span className="font-bold text-slate-900 dark:text-slate-100">1-4</span> of <span className="font-bold text-slate-900 dark:text-slate-100">124</span> items</p>
                            <div className="flex gap-2">
                                <button disabled className="size-9 flex items-center justify-center rounded-lg border border-[#728764]/20 text-[#728764] hover:bg-slate-50 transition-colors disabled:opacity-30">
                                    <span className="material-symbols-outlined text-xl">chevron_left</span>
                                </button>
                                <button className="size-9 flex items-center justify-center rounded-lg border border-[#728764]/20 bg-[#81e240] text-slate-900 font-bold">1</button>
                                <button className="size-9 flex items-center justify-center rounded-lg border border-[#728764]/20 hover:bg-slate-50 transition-colors">2</button>
                                <button className="size-9 flex items-center justify-center rounded-lg border border-[#728764]/20 hover:bg-slate-50 transition-colors text-[#728764]">
                                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
                            <div className="p-6 border-b border-[#728764]/10 flex justify-between items-center bg-[#81e240]/5">
                                <div>
                                    <h2 className="text-xl font-bold">Add New Product</h2>
                                    <p className="text-sm text-[#728764]">Enter the details for your new inventory item.</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold mb-1.5">Product Name</label>
                                        <input className="w-full rounded-lg border-[#728764]/20 focus:ring-[#81e240] focus:border-[#81e240]" placeholder="e.g. Organic Gala Apples" type="text" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1.5">Category</label>
                                        <select className="w-full rounded-lg border-[#728764]/20 focus:ring-[#81e240] focus:border-[#81e240]">
                                            <option>Select category</option>
                                            <option>Vegetables</option>
                                            <option>Fruits</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1.5">Price ($)</label>
                                        <input className="w-full rounded-lg border-[#728764]/20 focus:ring-[#81e240] focus:border-[#81e240]" placeholder="0.00" type="number" min="0" step="0.01" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button onClick={() => setShowModal(false)} className="px-6 py-2 border border-[#728764]/20 rounded-lg font-bold hover:bg-slate-50">Cancel</button>
                                    <button className="px-6 py-2 bg-[#81e240] text-slate-900 rounded-lg font-bold shadow-lg shadow-[#81e240]/20">Save Product</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
