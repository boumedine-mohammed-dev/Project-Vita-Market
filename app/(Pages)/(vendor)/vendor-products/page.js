'use client'
import Head from 'next/head'
import { useEffect, useState } from "react";
import Modal from '../../components/Modal'

const stats = [
    { label: 'Total des produits', value: '1,284', icon: 'inventory', iconColor: 'text-[#81e240]', trend: '+5.2%', trendColor: 'text-emerald-500', trendIcon: 'trending_up' },
    { label: 'Alertes de stock bas', value: '12', icon: 'warning', iconColor: 'text-amber-500', trendText: 'Require attention', trendColor: 'text-amber-500' },
    { label: 'Produits actifs', value: '1,250', icon: 'visibility', iconColor: 'text-blue-500', trend: '-1.1%', trendColor: 'text-rose-500', trendIcon: 'trending_down' },
]

const tableTabs = ['Tous les produits', 'En stock', "Faible stock", 'Rupture de stock']



export default function VendorProductsPage() {

    const [activeTab, setActiveTab] = useState('Tous les produits')
    const [showModal, setShowModal] = useState(false)
    const [products, setProducts] = useState([{
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoy39EMku2JK_Y44vOgmykVZKn2OmIEXecFiwm1j7UNZBarMIjPg0XTtaSDXTcLyXs0cei7Lm77EYYQwfrZxPPj6ma4ebm_TWw0jk-3hFILu-9TLFAx5IwgcDMG8T3bqEFoGamuZZYeF0RqnNCBXKFjTvqlMkHoDebFtpCLtRn7uw211Bll6LksrgbdARtaIVWKmsJ_tbBOsyOzBmziGynHFJzNjas9bkQ6mO4pwE2pD0Jlw_P5woBhUJZzbpSNhgBYkvTX8L4zH3I",
        nom: 'Premium Wireless Headphones', id: 'WH-1000XM4', category_name: 'Electronics',
        status: 'In Stock', statusColor: 'text-emerald-600 dark:text-emerald-400', dotColor: 'bg-emerald-500',
        quantite_stock: '45', prix: '199.00',
    },
    ])
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:8000/products/", {
                    credentials: "include", // لإرسال الكوكيز / التوكن
                });
                const data = await res.json();
                console.log("data", data)
                const p = data.map((item) => {
                    return {
                        url: item.url,
                        nom: item.nom,
                        description: item.description,
                        id: item.id,
                        note_moyenne: item.note_moyenne,
                        category_name: item.category_name,
                        status: item.quantite_stock > 10 ? "En stock" : item.quantite_stock > 0 ? "Faible stock" : "Rupture de stock",
                        statusColor: item.quantite_stock > 10 ? 'text-emerald-600 dark:text-emerald-400' : item.quantite_stock > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400',
                        dotColor: item.quantite_stock > 10 ? 'bg-emerald-500' : item.quantite_stock > 0 ? 'bg-amber-500' : 'bg-rose-500',
                        quantite_stock: item.quantite_stock,
                        prix: item.prix,
                    }
                })
                setProducts([...products, ...p]);
                console.log(p)
            } catch (err) {
                console.error(err);
            }
        };

        fetchProducts();
    }, []);
    console.log(activeTab)
    return (
        <>
            <Head><title>Vendor Product Management Dashboard</title></Head>

            <div className="bg-[#f7f8f6] dark:bg-[#182111] font-display text-slate-900 dark:text-slate-100 min-h-screen">
                {/* Header */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 lg:px-10">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4">
                            <div className="size-8 flex items-center justify-center rounded-lg bg-[#81e240] text-slate-900">
                                <span className="material-symbols-outlined">inventory_2</span>
                            </div>
                            <h2 className="text-lg font-bold leading-tight tracking-tight">Vita Market</h2>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <a className="text-[#81e240] text-sm font-bold border-b-2 border-[#81e240] pb-1" href="#">Inventory</a>
                            <a className="text-slate-600 dark:text-slate-400 hover:text-[#81e240] transition-colors text-sm font-medium" href="#">Orders</a>
                            <a className="text-slate-600 dark:text-slate-400 hover:text-[#81e240] transition-colors text-sm font-medium" href="#">Analytics</a>
                            <a className="text-slate-600 dark:text-slate-400 hover:text-[#81e240] transition-colors text-sm font-medium" href="#">Settings</a>
                        </nav>
                    </div>
                    <div className="flex flex-1 justify-end gap-4 items-center">
                        <label className="hidden sm:flex flex-col min-w-40 h-10 max-w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 dark:bg-slate-800">
                                <div className="text-slate-500 flex items-center justify-center pl-4">
                                    <span className="material-symbols-outlined text-xl">search</span>
                                </div>
                                <input className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 placeholder:text-slate-500 text-sm" placeholder="Search products..." />
                            </div>
                        </label>
                        <div className="flex gap-2">
                            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
                                <span className="material-symbols-outlined text-[20px]">notifications</span>
                            </button>
                            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
                                <span className="material-symbols-outlined text-[20px]">account_circle</span>
                            </button>
                        </div>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#81e240]/20" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDEOUODwIRkUB4gOwTXj7C-XlXSAfGPwUOh2OGLyXcjGgiIbMBMLACsLO7P2Wp_o-Bj5K4THYjpMRfpVRmwRAmAUuQb5xtTyUEmfGgsYRZ48SIIvUVlJ0mcKycnyqlK7vSNN_g-wknWTC2VaNcS3RfN-F6wusr-BW1DYN39v6JINRsmPO-N5Bo_OGo8cIAXePrcAl8vfCzaGH06BxOU-SHDHmM2M7XJBiJcxgvtGYxpsLZEUjFhVLOHwaqIygqIYaMMRGgQ1bBgV6oB')" }} />
                    </div>
                </header>

                <main className="flex flex-col flex-1 px-4 lg:px-20 py-8 max-w-[1440px] mx-auto w-full">
                    {/* Page Header */}
                    <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-black leading-tight tracking-tight">Inventaire des Produits</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base">Gérez votre catalogue, vos niveaux de stock et la disponibilité des produits.</p>
                        </div>
                        <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-[#81e240] text-slate-900 text-sm font-bold shadow-lg shadow-[#81e240]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            <span className="material-symbols-outlined">add_circle</span>
                            Ajouter un nouveau produit
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {stats.map(({ label, value, icon, iconColor, trend, trendText, trendColor, trendIcon }) => (
                            <div key={label} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
                                    <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
                                </div>
                                <div className="flex items-baseline gap-3">
                                    <p className="text-3xl font-bold">{value}</p>
                                    {trend && (
                                        <span className={`text-sm font-bold flex items-center ${trendColor}`}>
                                            <span className="material-symbols-outlined text-xs">{trendIcon}</span> {trend}
                                        </span>
                                    )}
                                    {trendText && <span className={`text-sm font-medium ${trendColor}`}>{trendText}</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 overflow-x-auto">
                            {tableTabs.map((t, i) => (
                                <button key={i} onClick={() => setActiveTab(t)} className={`border-b-2 px-4 py-4 text-sm whitespace-nowrap ${t === activeTab ? 'border-[#81e240] text-[#81e240] font-bold' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'}`}>{t}</button>
                            ))}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                                        {['Produit', 'Catégorie', 'Statut', 'Stock', 'Prix', 'Actions'].map((h, i) => (
                                            <th key={h} className={`px-6 py-4 text-sm font-bold ${i === 5 ? 'text-slate-500 dark:text-slate-400 text-right' : 'text-slate-900 dark:text-slate-100'}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {products.filter(p => activeTab === 'Tous les produits' || p.status === activeTab).map((p, index) => (
                                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 bg-cover bg-center" style={{ backgroundImage: `url('${p.url}')` }} />
                                                    <div>
                                                        <p className="text-sm font-bold">{p.nom}</p>

                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">{p.category_name}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`flex items-center gap-1.5 text-xs font-bold ${p.statusColor}`}>
                                                    <span className={`size-2 rounded-full ${p.dotColor}`} /> {p.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm font-medium">{p.quantite_stock} unités</td>
                                            <td className="px-6 py-4 text-sm font-bold">{p.prix} دج</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 text-slate-500 hover:text-[#81e240] transition-colors">
                                                        <span className="material-symbols-outlined text-xl">edit_note</span>
                                                    </button>
                                                    <button className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 flex justify-between items-center border-t border-slate-200 dark:border-slate-800">
                            <p className="text-xs text-slate-500 font-medium tracking-tight uppercase">Affichage de 1 à 5 produits sur 1,284</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Précédent</button>
                                <button className="px-3 py-1 bg-[#81e240] text-slate-900 rounded text-sm font-bold">1</button>
                                <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">2</button>
                                <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Suivant</button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Modal */}

                <Modal showModal={showModal} setShowModal={setShowModal} />

            </div>
        </>
    )
}
