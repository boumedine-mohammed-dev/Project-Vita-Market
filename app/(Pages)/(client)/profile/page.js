'use client'
import { useAuthStore } from '@/app/Store/useAuthStore'
import Head from 'next/head'
import { useState } from 'react'

const tabs = [
    { icon: 'package_2', label: 'Mes commandes' },
    { icon: 'favorite', label: 'Liste de souhaits' },
    { icon: 'location_on', label: 'Adresses' },
    { icon: 'credit_card', label: 'Paiements' },
]

const wishlist = [
    {
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIrN6AaF0u7CJKuU_3XeFbCIovbpGdmyOXUqkMJR8rk9evflQJk0ybxihberbpeJxcT0J17C_XHdSY2lGJYWV17kt4OJ-SMA2GYhPD7e6rfmjlp57coZHapS-hJU7w6eo1vSn9Db3Ke3FUUaPTJbuU5BzK_faQKv3rtYimi8s80okw6dXXkC1RszwEBJXUzDjz4HD1D3qEWrg_v21zZCpE0iZkO6M4xzcI_ebs4TQu1xLhD2JVDJcWA0iG90zyDe4_stL2wxiZ0LZ9",
        vendor: 'Green Valley Farm', name: 'Organic Curly Kale', price: '$4.99/lb',
    },
    {
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCJGV-3gC99ES3bfr3LDp-tD9dLUuXGZfB72fdBAn4Kj3U-jQ76IbVXUc14l95Rs1TMqUwoDrt5Ui32cS6mLRP9bhbBtBzD7ZiQTixKhp_cG0IhOsmr6E4fgJDUxO-h7pFwku11HTBjoAmeoX_zkNoYHPlVu_VY-R9FlUUvs1yT7FrP6KzzZw0p6qIDYIbByjV2x7KXrJRLjDeFVftPkUJisJ34PqKwlSPKqZjvNbx48ZxnrHdQK2YBxxQf2tLzOGKFxwaAd8LVsTI",
        vendor: 'Sunshine Orchard', name: 'Heritage Tomatoes', price: '$6.50/lb',
    },
    {
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsZzYTavs4zqFK3fcAgcdnXROCaoijBLKJdaKagByJyx8dPvV6-78BFCcd3bPAeoBoJ754hS_-u-Hc6EJEzhEVXb28A-Sdm6sKrlT3jSqfYP8Czs67vV8s_Z9ig8Nzmsn8kUU1s10JV1XFe-BUzdx0csaSr3jeigWWUPH0A7f1SSZqXNR2zmgYXy1YPDMDy0ALfGGBpEmtzYLt1n4VuM21LDQzc1l96AMP3nturSdwvIUxHQfQ2M7N0DVJSLIMWBziLIubHm1I7gK3",
        vendor: 'BeeKind Apiary', name: 'Wildflower Honey', price: '$12.00',
    },
    {
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApHJTO-zEs-lN-jZlMAPWCB2h9LvbZLEsM7d1S0R7WjB-OkI-rnBE28oh2Ky-6bOwdIPooBq7-KYXLR7SnNeSbul4yP32qIz95Zg39L869DNHX-QBlw_SUjMvTGBDdcGjNTAjNueSFQCJuIPqM1mYKfIImZ2eJnAKi6u1kKd_TQt2hHvWNy23Vbt_2l3T3XBLYZe6IHtvOw-o5FQZZ5MPOSIJpZZtvPZwnhrJCjpFs9DcZfpGy45vFRd7xGZnwEMshaOm5eSiztjDN",
        vendor: 'Artesian Baker', name: 'Ancient Grain Sourdough', price: '$8.50',
    },
]

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState(0)
    const { user } = useAuthStore();
    console.log(user)
    return (
        <>
            <Head><title>My Account - TerraMarket</title></Head>

            <div className="bg-[#f7f8f6] dark:bg-[#182111] text-slate-900 dark:text-slate-100 font-display min-h-screen">
                {/* Header */}

                <main className="flex flex-1 justify-center py-8">
                    <div className="flex flex-col max-w-[1200px] flex-1 px-4 lg:px-40">

                        {/* Profile Header Card */}
                        <div className="flex p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm mb-6">
                            <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                                <div className="flex gap-6 items-center">
                                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 border-4 border-[#81e240]/10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAf-CaZggMfyMUnbacdt3gvsuT-4yZHTSuT6gzCCqpvSVU7f6RnJ8UWV6CMpIohf_4C_ItjJ3SPWaJfmkcY-kBOWsx-gJ3Wq7pKZ-UVdiclpt5Uw6mfTZnLGN4jO7q5b_bIbeSkuNgLf-ZEEn3Zj7PmXHiXl8sFaW_r5Xpd1n6KHdoeth4eGLDOiunVX48i5fHOsrna4slzfNQKJKjZy3tH6bIPHex7JKznyj1rE9KTRqHEG7wV0zU5CMtPaqgmNYeDEZzgmLvz5siv")' }} />
                                    <div className="flex flex-col">
                                        <h1 className="text-slate-900 dark:text-slate-100 text-2xl font-bold tracking-tight">{user?.nom.charAt(0).toUpperCase() + user?.nom.slice(1)} {user?.prenom.charAt(0).toUpperCase() + user?.prenom.slice(1)}</h1>
                                        <p className="text-slate-500 text-sm">Membre VitaMarket depuis {new Date(user?.date_joined).toLocaleString("fr-FR", {
                                            year: "numeric",
                                            month: "long",
                                        })}</p>
                                        <div className="flex gap-2 mt-2">
                                            <span className="px-2 py-0.5 bg-[#81e240]/10 text-[#81e240] text-[10px] font-bold uppercase tracking-wider rounded">Guide local</span>
                                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded">Passionné de produits bio</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                                    <span className="material-symbols-outlined text-sm">settings</span>
                                    Modifier le profil
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mb-8 overflow-x-auto">
                            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-8 min-w-max">
                                {tabs.map(({ icon, label }, i) => (
                                    <button
                                        key={label}
                                        onClick={() => setActiveTab(i)}
                                        className={`flex items-center gap-2 border-b-2 pb-3 px-1 transition-all text-sm font-bold ${i === activeTab ? 'border-[#81e240] text-[#81e240]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <span className="material-symbols-outlined text-lg">{icon}</span>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Orders */}
                        <section className="grid grid-cols-1 gap-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Commandes récentes</h3>
                                <button className="text-[#81e240] text-sm font-semibold hover:underline">Voir tout l'historique</button>
                            </div>

                            {/* Active Order */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 bg-[#81e240]/10 rounded-lg flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[#81e240] text-2xl">shopping_basket</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Order #TR-94201</p>
                                            <p className="text-xs text-slate-500">Placed on Oct 12, 2023 • 8 items • $142.50</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start md:items-end">
                                        <span className="text-xs font-bold text-[#81e240] uppercase bg-[#81e240]/10 px-2 py-1 rounded">Out for Delivery</span>
                                        <p className="text-xs text-slate-500 mt-1">Expected: Today by 6:00 PM</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="relative pt-1">
                                        <div className="flex mb-4 items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            {['Confirmed', 'Processing', 'In Transit', 'Delivered'].map((step, i) => (
                                                <div key={step} className="flex flex-col items-center relative">
                                                    <div className={`size-4 rounded-full mb-2 z-10 ${i < 3 ? 'bg-[#81e240]' : 'bg-slate-200 dark:bg-slate-700'} ${i === 2 ? 'ring-4 ring-[#81e240]/20' : ''}`} />
                                                    <span className={i === 2 ? 'text-[#81e240]' : ''}>{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="absolute top-[34px] left-[15px] right-[15px] h-1 bg-slate-100 dark:bg-slate-800">
                                            <div className="h-full bg-[#81e240]" style={{ width: '66%' }} />
                                        </div>
                                    </div>
                                    <div className="mt-8 flex gap-3">
                                        <button className="flex-1 bg-[#81e240] text-slate-900 font-bold py-2.5 rounded-lg text-sm hover:brightness-105 transition-all">Track Live Location</button>
                                        <button className="px-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                            <span className="material-symbols-outlined text-slate-500">more_horiz</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Past Order */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800 opacity-80">
                                <div className="p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                                            <span className="material-symbols-outlined text-2xl">check_circle</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Order #TR-88421</p>
                                            <p className="text-xs text-slate-500">Delivered on Oct 05, 2023 • $84.20</p>
                                        </div>
                                    </div>
                                    <button className="text-[#81e240] text-xs font-bold border border-[#81e240]/30 px-4 py-2 rounded-lg hover:bg-[#81e240]/5 transition-all">Reorder Items</button>
                                </div>
                            </div>
                        </section>

                        {/* Wishlist */}
                        <section className="mt-12">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">My Wishlist</h3>
                                <button className="text-[#81e240] text-sm font-semibold hover:underline">Edit List</button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {wishlist.map((item) => (
                                    <div key={item.name} className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                                        <div className="aspect-square bg-cover bg-center relative" style={{ backgroundImage: `url('${item.image}')` }}>
                                            <button className="absolute top-2 right-2 size-8 rounded-full bg-white/80 backdrop-blur-sm text-red-500 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                            </button>
                                        </div>
                                        <div className="p-3 text-center">
                                            <p className="text-xs text-slate-500 font-medium">{item.vendor}</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{item.name}</p>
                                            <p className="text-[#81e240] font-bold mt-1">{item.price}</p>
                                            <button className="mt-3 w-full bg-[#81e240]/10 text-[#81e240] py-2 rounded-lg text-xs font-bold hover:bg-[#81e240] hover:text-slate-900 transition-all">Add to Cart</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Delivery Address */}
                        <section className="mt-12 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-[#81e240]">contact_mail</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Primary Delivery Address</h3>
                            </div>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 p-4 rounded-lg bg-[#f7f8f6] dark:bg-[#182111] border-2 border-[#81e240]">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Home</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                                4522 Pine Needle Lane<br />
                                                Silver Spring, MD 20910<br />
                                                United States
                                            </p>
                                            <p className="text-xs text-slate-500 mt-2">+1 (555) 0123-4567</p>
                                        </div>
                                        <span className="px-2 py-0.5 bg-[#81e240] text-slate-900 text-[10px] font-bold rounded">DEFAULT</span>
                                    </div>
                                    <div className="mt-4 flex gap-4">
                                        <button className="text-[#81e240] text-xs font-bold hover:underline">Edit</button>
                                        <button className="text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors">Delete</button>
                                    </div>
                                </div>
                                <div className="flex-1 p-4 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 hover:border-[#81e240]/50 hover:text-[#81e240] transition-all cursor-pointer">
                                    <span className="material-symbols-outlined text-3xl">add_circle</span>
                                    <p className="text-sm font-bold mt-2">Add New Address</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 px-6 lg:px-40 mt-12">
                    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3 text-[#81e240]">
                            <span className="material-symbols-outlined">eco</span>
                            <span className="font-bold tracking-tight text-slate-900 dark:text-slate-100">TerraMarket</span>
                        </div>
                        <div className="flex gap-8 text-xs font-semibold text-slate-500">
                            {['Privacy Policy', 'Terms of Service', 'Contact Support'].map((l) => (
                                <a key={l} className="hover:text-[#81e240] transition-colors" href="#">{l}</a>
                            ))}
                        </div>
                        <div className="text-xs text-slate-400">© 2024 TerraMarket. Supporting local farms everywhere.</div>
                    </div>
                </footer>
            </div>
        </>
    )
}
