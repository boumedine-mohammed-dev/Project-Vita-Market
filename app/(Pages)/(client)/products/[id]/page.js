"use client"
import Head from 'next/head'
import { useState } from 'react'

const thumbnails = [
    {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfrgIYbThej4hs32K18Ughw6C0iCh9NcubgiEptdtNqEapUXmB7PVOECoSkc7ah-jhnUfFts4H3R_CDXejFZCn2ixjryHH7NN-wm5aSU_V1jXdoV_ds_mZ4QE6A32Onx2MjPvb1Eq7Skr1lLTAvQInTaVmP4adD6WOQ2B_PAX1Xp07CDTtoOTnBLgjjxEhO0LWzosr8a_s3o8vDtd8YdLpsUBp15vZSJ4Z1AOYGzQQpIx-PA53slsWxo6lrJFC9aTEq6kMONHwl59U',
        alt: 'Fresh red honeycrisp apples in a basket',
    },
    {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6LT2kXGFN3xIV-LpxT860IgS22pcvASSZZrFvAqFERdlkYkjDtlaX6UCh_Icsx0t3fhqj4Ejhw2W3aZz8pSqnFkeErTZHiRJZ2xXDsvXwg7vudGjUOllraL70BzG4ibYbTHK_jHm1whmtqr-mtjXBR69zxvrYTn1-jG6jJSbOQ3t_aG66Y1NyIk0TEjN7up9R0G4SPQQaTswmboXQDfoR7UiG1Js_gO1t4kZkdsiRtv57oOF7B_Y-ueOlbCo1HqWSWIGaRIbM4zXA',
    },
    {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4xYbMrvjTyAQvkI_vcMd5iVJtJcIl-yb-Lv0vanDiu1XOpYSvd0UanZgbqDb0wcxP--OJRnJJNAfp7ds6HW2w_WO1X1afaVMvqjSH4-HlkzN4qlgzsZujpt9WUK2Q36LtJsdhVloOAakfbUP-jUsT9taCkjUwwMPbkstsO00hhZFwzIo6mpFspHF07Whb5i222HaX5fUhTo8Oe_h0cDmBaukQRfc-UZ7OhZR25fRVlrr9Xs16itl2L-F7rFNnxqM7-2O87HLdjwDB',
    },
    {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXNDfHKaLy5uC1ybbDZHYbO5G_IDzqyquRkLzRfGH2a6h4-4jHdW1qTnl0mL7ELeFnaD42n4cn-4kbVE5FbBYmkujKhkpg0gYc3k7mmRFqmx2sFsIoqDdh9HWNVq3PKCQABcppOWUYe_EzG9anBcrpZEG8nsNbeBowowlS61SdwuRvqqpO07tWzNSO8S0eN-nCVe8fb9Y06KoLGE1HlOeSIhb1Jb8kRUbcgstIiDY5IT6iWgGYoyfB9aUQ8u10bM8EsM8G_cpM0jvm',
    },
    {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBspObewuOBG0hytEdYNH6yre7EiW2SmXyX_8Xa1J55jDqDipggpGAIJz5BESdUstwKdjazgU60kFcP9rU41xHwSKRP4xiu49WtVXyiUc54j5FIWD30O8IGyhjxGl6s7uKzk-MiosfB5GeF8OxCCDIHba1UKz5POq7jWVR5UefvFdiGflmJmr6t39Pbfiv-3Ew20FOxE3i4Z--cJIzsDCrUqQBCHnX-yEuX5iG5mVzUQXAiqpAqd9tut-ss3lW_QZHiriUjoRMlSpIA',
    },
]

const tabs = ['Description', 'Nutritional Facts', 'Vendor Story', 'Reviews (124)']

const reviews = [
    {
        name: 'Sarah Jenkins',
        time: '2 days ago',
        stars: 5,
        text: "Best apples I've ever had delivered! They were crisp, perfectly sweet, and arrived without a single bruise. You can really taste the difference between these and store-bought organic ones.",
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzRJFPwDd0yTn9NwuLKULPdZKXC6ORETnepLzILjArlHR6no5OyAl15N2qIwnAg8dn91wRNGvY5vLrl6UoSweOMLA8OE5Iq6u70Mxv6_FjBLHAVCSfPgzzwZsNKyWFvGmjHNXGtKtdlumyEgjWXXQGucAA56iIh9WJX4NnBmBMJrDqlrPE4hTnIlOo9yoEcWb9iSyw27wrQtE9U8pQu4gK5LhptBSVAR5ifdZUXAB37a9JRXuYkVZ5cPrEyCh8K_nodffO42TD0VRS',
    },
    {
        name: 'Mark Thompson',
        time: '1 week ago',
        stars: 4,
        text: 'Fast shipping and very fresh. One was slightly smaller than the rest, but the quality overall is incredible. Definitely subscribing to these weekly.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcUoxsEyfRrlA2dTZtWis8orG-RTtpwwzEOOTG2opGzWrOz9qVX46dycQRNqCUZHn5Ev5yH5vnYCnuMQQMaVTyqsFsNIyjFltYUWjulh7Gw1y4ICEh1JaRwDvPyHlWTjfeLztBZdIorj3iRcIXtiUoFaMlhRFCoSIGUngq93XxqAp1VZc2ly7zTNuBUHBUNmsEJj9uwhNMRWU04ekUZ3THh9LvFAnLSmhLQMv-jXs0v5_aBu61rT3bgrncm7R930vEBZXqu7Ue0WTH',
    },
]

function Stars({ count, total = 5, size = 'text-yellow-400' }) {
    return (
        <div className="flex">
            {Array.from({ length: total }).map((_, i) => (
                <span key={i} className={`material-symbols-outlined ${size}`} style={{ fontVariationSettings: i < count ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                    star
                </span>
            ))}
        </div>
    )
}

export default function ProductDetailsPage() {
    const [activeThumb, setActiveThumb] = useState(0)
    const [activeTab, setActiveTab] = useState(0)
    const [qty, setQty] = useState(1)

    return (
        <>
            <Head>
                <title>Organic Honeycrisp Apples - EcoMarket</title>
            </Head>

            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f7f8f6] dark:bg-[#182111] font-display text-slate-900 dark:text-slate-100">

                {/* Header */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-20 lg:px-40 py-3 sticky top-0 z-50">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4">
                            <div className="size-6 text-[#81e240] flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl">eco</span>
                            </div>
                            <h2 className="text-lg font-bold leading-tight tracking-tight">EcoMarket</h2>
                        </div>
                        <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 dark:bg-slate-800">
                                <div className="text-slate-500 flex items-center justify-center pl-4">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 h-full placeholder:text-slate-500 px-4 text-base" placeholder="Search products..." />
                            </div>
                        </label>
                    </div>
                    <div className="flex flex-1 justify-end gap-6 items-center">
                        <nav className="hidden lg:flex items-center gap-6">
                            <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-[#81e240] transition-colors" href="#">Shop</a>
                            <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-[#81e240] transition-colors" href="#">Vendors</a>
                            <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-[#81e240] transition-colors" href="#">Organic Guide</a>
                        </nav>
                        <div className="flex gap-2">
                            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                <span className="material-symbols-outlined text-xl">favorite</span>
                            </button>
                            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 relative">
                                <span className="material-symbols-outlined text-xl">shopping_cart</span>
                                <span className="absolute -top-1 -right-1 bg-[#81e240] text-slate-900 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">2</span>
                            </button>
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10 border border-slate-200 dark:border-slate-700" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBxfiZ3H8lZ13xAxmC8RZeM8o41ifGZGfINMNIKKKPEJzTNK3h8fKQXFJUFUnfz1l4ZtFV61pQyu0QIzOzyN2u4N4BYLhD_YvQ6_8N7xjEaKC-wK3MAdH6gjvCqplnwzfNvFjz3hVSLsccfIrg5hui3ga5v47DizRZDyEOrn_pee5Ll126wjqc6HKv4G_t_CZTi5jbzvBAj_mM6ciuutUjWzn--zSNL_TQvceQMId1csO91Z8QcHuvwLun2k5TH8CAb5fu5TyelYGco")' }} />
                        </div>
                    </div>
                </header>

                <main className="flex-1 px-4 md:px-20 lg:px-40 py-8">
                    {/* Breadcrumbs */}
                    <nav className="flex flex-wrap gap-2 pb-6 text-sm">
                        <a className="text-slate-500 hover:text-[#81e240] transition-colors" href="#">Home</a>
                        <span className="text-slate-400">/</span>
                        <a className="text-slate-500 hover:text-[#81e240] transition-colors" href="#">Organic Produce</a>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-900 dark:text-slate-100 font-semibold">Fresh Honeycrisp Apples</span>
                    </nav>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Gallery */}
                        <div className="lg:col-span-7 flex flex-col gap-4">
                            <div className="w-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm aspect-[4/3] border border-slate-200 dark:border-slate-800">
                                <div className="w-full h-full bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url('${thumbnails[activeThumb].url}')` }} />
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {thumbnails.slice(0, 4).map((t, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setActiveThumb(i)}
                                        className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${activeThumb === i ? 'border-[#81e240]' : 'border-slate-200 dark:border-slate-800 hover:border-[#81e240]'} transition-colors`}
                                    >
                                        <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url('${t.url}')` }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            <div>
                                <span className="inline-block px-2 py-1 rounded bg-[#81e240]/20 text-[#81e240] text-xs font-bold uppercase tracking-wider mb-2">In Stock</span>
                                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">Organic Honeycrisp Apples</h1>
                                <div className="flex items-center gap-4 mb-4">
                                    <Stars count={4} total={5} />
                                    <span className="material-symbols-outlined text-yellow-400" style={{ fontVariationSettings: "'FILL' 0.5, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>star_half</span>
                                    <span className="text-slate-500 text-sm font-medium">4.8 (124 reviews)</span>
                                </div>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">$4.99 <span className="text-lg font-normal text-slate-500">/ lb</span></p>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { icon: 'verified', label: 'USDA Organic' },
                                    { icon: 'nature', label: 'Non-GMO' },
                                    { icon: 'location_on', label: 'Local (12 mi)' },
                                ].map(({ icon, label }) => (
                                    <div key={label} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-[#81e240] text-lg">{icon}</span>
                                        <span className="text-xs font-semibold">{label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Vendor */}
                            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDkw1CoCbGNKw7fFET6QybPd-cxxxB2EUhN7VF6ieoHKxNi3ZZrtq4aWI4CXCFc9DGhUiaS3cdtOah7tLPn-pbts6h1t29xAG6Yx7clD6_oxSp6Sj_hLiP68BDOdQc97x3ZL-epPrDsPS9r89i9KsTgBeGD1Y3G20gujnDG27PM2SyxqtG7jzNHAuMz8lZ8sxqzyvTx_Ueu3IWoo8ENEsVoVsTDtF0wvis6YIHci_VlRKG2jlP4pVaK9Z8vb7v9MehVdPlIpYP-DyQF")' }} />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Sold by</p>
                                        <p className="font-bold text-slate-900 dark:text-white">Willow Creek Farms</p>
                                    </div>
                                </div>
                                <a className="text-[#81e240] text-sm font-bold flex items-center gap-1 hover:underline" href="#">
                                    Visit Store <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                                </a>
                            </div>

                            {/* Add to cart */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg h-12 bg-white dark:bg-slate-900">
                                        <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 text-slate-500 hover:text-[#81e240]">
                                            <span className="material-symbols-outlined">remove</span>
                                        </button>
                                        <input className="w-12 text-center border-none bg-transparent focus:ring-0 font-bold" type="number" value={qty} readOnly />
                                        <button onClick={() => setQty(qty + 1)} className="px-4 text-slate-500 hover:text-[#81e240]">
                                            <span className="material-symbols-outlined">add</span>
                                        </button>
                                    </div>
                                    <button className="flex-1 h-12 bg-[#81e240] text-slate-900 font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                        <span className="material-symbols-outlined">shopping_basket</span>
                                        Add to Cart
                                    </button>
                                </div>
                                <button className="w-full h-12 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <span className="material-symbols-outlined">favorite</span>
                                    Add to Wishlist
                                </button>
                            </div>

                            {/* Delivery info */}
                            <div className="flex items-center gap-6 py-4 border-t border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <span className="material-symbols-outlined text-[#81e240]">local_shipping</span>
                                    Free local delivery
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <span className="material-symbols-outlined text-[#81e240]">assignment_return</span>
                                    2-day freshness guarantee
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-12">
                        <div className="flex gap-10 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto whitespace-nowrap">
                            {tabs.map((tab, i) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(i)}
                                    className={`pb-4 border-b-2 font-medium text-lg ${activeTab === i ? 'border-[#81e240] text-slate-900 dark:text-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                            {/* Description & Reviews */}
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold mb-4">About Our Honeycrisp Apples</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                        Our Honeycrisp apples are harvested at the peak of ripeness from the sunny hillsides of Willow Creek Farms. Known for their explosive crunch and perfect balance of sweet and tart flavors, these apples are grown without synthetic pesticides or fertilizers.
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Each apple is hand-picked and carefully inspected to ensure you receive the highest quality fruit. Perfect for snacking, slicing into salads, or baking into a seasonal galette.
                                    </p>
                                    <ul className="mt-6 space-y-2">
                                        {['Pesticide-free and non-GMO certified', 'Directly sourced from Willow Creek, Oregon', 'Compostable packaging used for all shipments'].map((item) => (
                                            <li key={item} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                <span className="material-symbols-outlined text-[#81e240] text-sm">check_circle</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Reviews */}
                                <div className="pt-12">
                                    <h3 className="text-xl font-bold mb-8">Customer Reviews</h3>
                                    <div className="space-y-8">
                                        {reviews.map((r) => (
                                            <div key={r.name} className="flex gap-4 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                                <div className="h-10 w-10 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                                                    <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url('${r.avatar}')` }} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-bold">{r.name}</p>
                                                        <span className="text-xs text-slate-400">• {r.time}</span>
                                                    </div>
                                                    <Stars count={r.stars} total={5} size="text-yellow-400 text-sm" />
                                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-3">{r.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-8">
                                {/* Nutritional Facts */}
                                <div className="p-6 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Nutritional Facts</h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Serving Size', value: '1 Medium Apple (182g)', bold: false },
                                            { label: 'Calories', value: '95', bold: true },
                                            { label: 'Total Fat', value: '0.3g', bold: false },
                                            { label: 'Total Carbohydrate', value: '25g', bold: false },
                                        ].map(({ label, value, bold }) => (
                                            <div key={label} className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                                                <span className={`text-sm ${bold ? 'font-bold' : 'font-medium'}`}>{label}</span>
                                                <span className={`text-sm ${bold ? 'font-bold' : ''}`}>{value}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2 ml-4">
                                            <span className="text-xs text-slate-500">Dietary Fiber</span>
                                            <span className="text-xs font-bold">4.4g</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2 ml-4">
                                            <span className="text-xs text-slate-500">Sugars</span>
                                            <span className="text-xs">19g</span>
                                        </div>
                                        <div className="flex justify-between pb-2">
                                            <span className="text-sm font-medium">Protein</span>
                                            <span className="text-sm">0.5g</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Origin */}
                                <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Origin</h4>
                                    <div className="w-full h-40 rounded-lg mb-4 grayscale opacity-80 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-slate-400">map</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                                        &ldquo;Grown with love in the heart of the Willamette Valley since 1984.&rdquo;
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 md:px-20 lg:px-40 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1">
                            <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100 mb-4">
                                <span className="material-symbols-outlined text-[#81e240] text-2xl">eco</span>
                                <h2 className="text-lg font-bold">EcoMarket</h2>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">Connecting local farmers with conscious consumers for a healthier planet and a better future.</p>
                        </div>
                        {[
                            { title: 'Marketplace', links: ['All Categories', 'New Arrivals', 'Featured Vendors', 'Bulk Orders'] },
                            { title: 'Support', links: ['Shipping Info', 'Returns & Refunds', 'Sustainability Report', 'Contact Us'] },
                        ].map(({ title, links }) => (
                            <div key={title}>
                                <h4 className="font-bold text-sm uppercase tracking-widest mb-4">{title}</h4>
                                <ul className="space-y-2 text-sm text-slate-500">
                                    {links.map((l) => <li key={l}><a className="hover:text-[#81e240]" href="#">{l}</a></li>)}
                                </ul>
                            </div>
                        ))}
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-widest mb-4">Join Our Community</h4>
                            <div className="flex gap-4">
                                {['share', 'public', 'camera'].map((icon) => (
                                    <a key={icon} className="h-10 w-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" href="#">
                                        <span className="material-symbols-outlined text-xl">{icon}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-400 text-xs">© 2024 EcoMarket. All rights reserved. Locally sourced, globally minded.</p>
                        <div className="flex gap-6 text-xs text-slate-400">
                            <a className="hover:text-[#81e240]" href="#">Privacy Policy</a>
                            <a className="hover:text-[#81e240]" href="#">Terms of Service</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}
