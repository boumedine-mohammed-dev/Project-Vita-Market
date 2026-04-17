import { navigate } from "next/dist/client/components/segment-cache/navigation";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-white">eco</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">EcoMarket</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a
                                className="text-sm font-medium hover:text-primary transition-colors"
                                href="/"
                            >
                                Shop
                            </a>
                            <a
                                className="text-sm font-medium hover:text-primary transition-colors"
                                href="#"
                            >
                                Vendors
                            </a>
                            <a
                                className="text-sm font-medium hover:text-primary transition-colors"
                                href="#"
                            >
                                Our Mission
                            </a>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 hover:bg-primary/10 rounded-full transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined">search</span>
                            </button>
                            <button className="p-2 hover:bg-primary/10 rounded-full transition-colors relative flex items-center justify-center">
                                <span className="material-symbols-outlined">
                                    shopping_basket
                                </span>
                                <span className="absolute top-1 right-1 bg-primary text-xs font-bold px-1.5 py-0.5 rounded-full text-slate-900">
                                    3
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-10">
                    <nav className="flex mb-4 text-sm text-slate-500 dark:text-slate-400">
                        <a className="hover:text-primary transition-colors" href="/">
                            Home
                        </a>
                        <span className="mx-2">/</span>
                        <span className="text-slate-900 dark:text-slate-100 font-medium">
                            Your Shopping Cart
                        </span>
                    </nav>
                    <h1 className="text-4xl font-extrabold tracking-tight">Your Cart</h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        You have 3 items from 2 different local vendors.
                    </p>
                </header>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    {/* Cart Items */}
                    <section className="lg:col-span-8">
                        <div className="bg-white dark:bg-slate-900/50 border border-primary/10 rounded-2xl overflow-hidden">
                            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-primary/10 text-xs font-bold uppercase tracking-wider text-slate-500">
                                <div className="col-span-6">Product &amp; Vendor</div>
                                <div className="col-span-2 text-center">Price</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-2 text-right">Subtotal</div>
                            </div>

                            {/* Item 1 */}
                            <div className="p-6 border-b border-primary/5 last:border-0">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                    <div className="md:col-span-6 flex gap-4 items-center">
                                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-primary/10 relative">
                                            <Image
                                                className="object-cover"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqK2pkr87NSA4ud4efYr_oEDvFdBx_i5PGJrBhVB7BeFiYekPcCH36fsS-tctE_tGvu-k4HqC5MYW5IqlK1j8C-APPx8IgjcLgiQSEmvwi0upg0RQRSPkujC1kkC83dwijCU3HFJ3icEXG-CiHI0KCXxMlTJVvQiDfTEZk4SNeF3DUgKh3HZ8pVTCLdM_UdLWHmYOZwIEwf8voxYKucb-s1gxGW_mpDs4MRcGzgWY_AOIGc-yzsJ3C27WTZLJ_OuqDQYGgMIY44Kaf"
                                                alt="Fresh organic green salad vegetables in bowl"
                                                fill
                                                unoptimized
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Heirloom Salad Mix</h3>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className="material-symbols-outlined text-primary text-sm">
                                                    storefront
                                                </span>
                                                <span className="text-sm text-slate-500">
                                                    Green Valley Organic Farm
                                                </span>
                                            </div>
                                            <button className="mt-2 text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">
                                                    delete_outline
                                                </span>{" "}
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 text-center">
                                        <span className="md:hidden text-xs text-slate-400 block mb-1 uppercase font-bold">
                                            Price
                                        </span>
                                        <span className="font-medium">$12.50</span>
                                    </div>
                                    <div className="md:col-span-2">
                                        <span className="md:hidden text-xs text-slate-400 block mb-1 uppercase font-bold">
                                            Quantity
                                        </span>
                                        <div className="flex items-center justify-center border border-primary/20 rounded-lg p-1 max-w-[100px] mx-auto">
                                            <button className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 rounded transition-colors">
                                                <span className="material-symbols-outlined text-sm">
                                                    remove
                                                </span>
                                            </button>
                                            <span className="w-8 text-center font-bold">1</span>
                                            <button className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 rounded transition-colors text-primary">
                                                <span className="material-symbols-outlined text-sm">
                                                    add
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 text-right">
                                        <span className="md:hidden text-xs text-slate-400 block mb-1 uppercase font-bold">
                                            Subtotal
                                        </span>
                                        <span className="font-bold text-lg">$12.50</span>
                                    </div>
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className="p-6 border-b border-primary/5 last:border-0">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                    <div className="md:col-span-6 flex gap-4 items-center">
                                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-primary/10 relative">
                                            <Image
                                                className="object-cover"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVhWhgrVfrAmWIpsAiprtLwSsqC5RNLhEDit5-3jj2_y4jryZ9CaqpmXiG5LdkamGgDb6-BBEGx2LrTjlshvP7cICZ3bxQdvEikje7OD_fZ38dM8ONNFV5bU7Qrq_Ikt6NAEotmPcDkpYZzg348MUDwclaQztZfPaNtfozyXxoSzypcbTYBhfc1eYZXYguFXyw9VZr_a-kOvs6lEA9UjSZzpvJQo5-eLWXbDQf9xGwX1z6-TBG8GsTlYm7gdMKiBZ2KN8G327CiMX8"
                                                alt="Jar of local golden honey on wood"
                                                fill
                                                unoptimized
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">
                                                Wildflower Honey (500g)
                                            </h3>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className="material-symbols-outlined text-primary text-sm">
                                                    storefront
                                                </span>
                                                <span className="text-sm text-slate-500">
                                                    BeeKind Apiaries
                                                </span>
                                            </div>
                                            <button className="mt-2 text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">
                                                    delete_outline
                                                </span>{" "}
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 text-center">
                                        <span className="md:hidden text-xs text-slate-400 block mb-1 uppercase font-bold">
                                            Price
                                        </span>
                                        <span className="font-medium">$18.00</span>
                                    </div>
                                    <div className="md:col-span-2">
                                        <span className="md:hidden text-xs text-slate-400 block mb-1 uppercase font-bold">
                                            Quantity
                                        </span>
                                        <div className="flex items-center justify-center border border-primary/20 rounded-lg p-1 max-w-[100px] mx-auto">
                                            <button className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 rounded transition-colors">
                                                <span className="material-symbols-outlined text-sm">
                                                    remove
                                                </span>
                                            </button>
                                            <span className="w-8 text-center font-bold">2</span>
                                            <button className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 rounded transition-colors text-primary">
                                                <span className="material-symbols-outlined text-sm">
                                                    add
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 text-right">
                                        <span className="md:hidden text-xs text-slate-400 block mb-1 uppercase font-bold">
                                            Subtotal
                                        </span>
                                        <span className="font-bold text-lg">$36.00</span>
                                    </div>
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="p-6 border-b border-primary/5 last:border-0">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                    <div className="md:col-span-6 flex gap-4 items-center">
                                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-primary/10 relative">
                                            <Image
                                                className="object-cover"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfdQNANRyabgkeVYv2EhLjq9jh2lYEm1W5KMBKIwL8UsXd_HI95LtZV65X8py59P92EPH2VKW_Q7ETObDfxCaFJS6fU_RYzlVC-lFq0uQerEGjnTHaq_-NbI9yZvezsqsCOWk879ZN1ifdfJbAHhHvsvPoVmkCAEpsgD7I4Z059D3TygdxZypPRHG0n85VXuoty3kBFrLIx4_EoKebYxi8p6UvujBWZbuE2c1PwnmFb1MuUPnaHTbSmh-NL97tBwPRgT50piuLtJB2"
                                                alt="Loaf of sourdough bread on linen"
                                                fill
                                                unoptimized
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Artisan Sourdough</h3>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className="material-symbols-outlined text-primary text-sm">
                                                    storefront
                                                </span>
                                                <span className="text-sm text-slate-500">
                                                    Ancient Grains Bakery
                                                </span>
                                            </div>
                                            <button className="mt-2 text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">
                                                    delete_outline
                                                </span>{" "}
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 text-center">
                                        <span className="md:hidden text-xs text-slate-400 block mb-1 uppercase font-bold">
                                            Price
                                        </span>
                                        <span className="font-medium">$8.50</span>
                                    </div>
                                    <div className="md:col-span-2">
                                        <span className="md:hidden text-xs text-slate-400 block mb-1 uppercase font-bold">
                                            Quantity
                                        </span>
                                        <div className="flex items-center justify-center border border-primary/20 rounded-lg p-1 max-w-[100px] mx-auto">
                                            <button className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 rounded transition-colors">
                                                <span className="material-symbols-outlined text-sm">
                                                    remove
                                                </span>
                                            </button>
                                            <span className="w-8 text-center font-bold">1</span>
                                            <button className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 rounded transition-colors text-primary">
                                                <span className="material-symbols-outlined text-sm">
                                                    add
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 text-right">
                                        <span className="md:hidden text-xs text-slate-400 block mb-1 uppercase font-bold">
                                            Subtotal
                                        </span>
                                        <span className="font-bold text-lg">$8.50</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Message */}
                        <div className="mt-6 flex items-start gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                            <span className="material-symbols-outlined text-primary">
                                local_shipping
                            </span>
                            <div>
                                <p className="text-sm font-medium">Almost there!</p>
                                <p className="text-sm text-slate-500">
                                    Add{" "}
                                    <span className="font-bold text-slate-900 dark:text-slate-100">
                                        $3.00
                                    </span>{" "}
                                    more to your cart to qualify for{" "}
                                    <span className="text-primary font-bold">
                                        Free Local Delivery
                                    </span>
                                    .
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Order Summary Sidebar */}
                    <aside className="mt-10 lg:mt-0 lg:col-span-4 sticky top-28">
                        <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-6 shadow-xl shadow-primary/5">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Subtotal (3 items)</span>
                                    <span className="font-medium">$57.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Estimated Shipping</span>
                                    <span className="font-medium">$5.95</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Tax</span>
                                    <span className="font-medium">$4.56</span>
                                </div>
                                <div className="pt-4 border-t border-primary/10">
                                    <div className="flex justify-between items-end">
                                        <span className="text-lg font-bold">Total</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-primary">
                                                $67.51
                                            </span>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">
                                                VAT Included where applicable
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                <button className="w-full bg-primary hover:bg-opacity-90 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group">
                                    <Link href="/checkout">Proceed to Checkout</Link>
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                                        arrow_forward
                                    </span>
                                </button>
                                <button className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium py-3 rounded-xl transition-all">
                                    Checkout as Guest
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-primary/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary">
                                            lock
                                        </span>
                                    </div>
                                    <div className="text-sm">
                                        <a className="font-bold text-primary hover:underline" href="#">
                                            Login or Sign up
                                        </a>
                                        <p className="text-slate-500">
                                            Save items for later &amp; earn points
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Trusted Badges */}
                            <div className="mt-6 flex flex-wrap justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="flex flex-col items-center">
                                    <span className="material-symbols-outlined text-xl">
                                        verified_user
                                    </span>
                                    <span className="text-[10px] uppercase font-bold mt-1">
                                        Secure
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="material-symbols-outlined text-xl">
                                        local_florist
                                    </span>
                                    <span className="text-[10px] uppercase font-bold mt-1">
                                        Organic
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="material-symbols-outlined text-xl">
                                        support_agent
                                    </span>
                                    <span className="text-[10px] uppercase font-bold mt-1">
                                        24/7 Care
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="material-symbols-outlined text-xl">
                                        payments
                                    </span>
                                    <span className="text-[10px] uppercase font-bold mt-1">
                                        No Fees
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Continue Shopping */}
                <div className="mt-12 text-center">
                    <a
                        className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all"
                        href="/products"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Continue Shopping
                    </a>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="mt-20 border-t border-primary/10 bg-white dark:bg-slate-950 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-sm">
                                eco
                            </span>
                        </div>
                        <span className="text-lg font-bold tracking-tight">EcoMarket</span>
                    </div>
                    <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
                        Connecting local producers with conscious consumers. Sustainability
                        in every bite.
                    </p>
                    <div className="flex justify-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-400">
                        <a className="hover:text-primary" href="#">
                            Privacy
                        </a>
                        <a className="hover:text-primary" href="#">
                            Terms
                        </a>
                        <a className="hover:text-primary" href="#">
                            Returns
                        </a>
                        <a className="hover:text-primary" href="#">
                            Contact
                        </a>
                    </div>
                    <p className="mt-8 text-xs text-slate-500">
                        © 2024 EcoMarket Marketplace. Built with nature in mind.
                    </p>
                </div>
            </footer>
        </div>
    );
}
