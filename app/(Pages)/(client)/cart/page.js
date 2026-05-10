"use client";
import Image from "next/image";
import Link from "next/link";
import { useClientStore } from "@/app/Store/useClientStore";

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart } = useClientStore();

    const lignes = cart?.lignes ?? [];
    const total = cart?.total ?? 0;
    const uniqueVendors = new Set(lignes.map((l) => l.produit_vendeur)).size;

    if (!cart || lignes.length === 0) {
        return (
            <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center justify-center gap-6">
                <span className="material-symbols-outlined text-6xl text-slate-300">shopping_cart</span>
                <h2 className="text-2xl font-bold text-slate-500">Votre panier est vide</h2>
                <Link
                    href="/products"
                    className="bg-primary text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all"
                >
                    Parcourir les produits
                </Link>
            </div>
        );
    }
    console.log(lignes);
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-10">
                    <nav className="flex mb-4 text-sm text-slate-500 dark:text-slate-400">
                        <a className="hover:text-primary transition-colors" href="/">Accueil</a>
                        <span className="mx-2">/</span>
                        <span className="text-slate-900 dark:text-slate-100 font-medium">Votre Panier</span>
                    </nav>
                    <h1 className="text-4xl font-extrabold tracking-tight">Votre Panier</h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        Vous avez {lignes.length} article{lignes.length !== 1 ? "s" : ""} de {uniqueVendors} vendeur{uniqueVendors !== 1 ? "s" : ""} local{uniqueVendors !== 1 ? "aux" : ""}.
                    </p>
                </header>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    {/* Cart Items */}
                    <section className="lg:col-span-8">
                        <div className="bg-white dark:bg-slate-900/50 border border-primary/10 rounded-2xl overflow-hidden">
                            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-primary/10 text-xs font-bold uppercase tracking-wider text-slate-500">
                                <div className="col-span-6">Produit &amp; Vendeur</div>
                                <div className="col-span-2 text-center">Prix unit.</div>
                                <div className="col-span-2 text-center">Quantité</div>
                                <div className="col-span-2 text-right">Sous-total</div>
                            </div>

                            {lignes.map((ligne) => {
                                const subtotal = parseFloat(ligne.prix_unitaire) * ligne.quantite;
                                return (
                                    <div key={ligne.id} className="p-6 border-b border-primary/5 last:border-0 transition-all">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

                                            {/* Product info */}
                                            <div className="md:col-span-6 flex gap-4 items-center">
                                                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-primary/10 relative">
                                                    <Image
                                                        className="object-cover"
                                                        src={ligne.produit_url}
                                                        alt={ligne.produit_nom}
                                                        fill
                                                        unoptimized
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg leading-snug">{ligne.produit_nom}</h3>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <span className="material-symbols-outlined text-primary text-sm">storefront</span>
                                                        <span className="text-sm text-slate-500">{ligne.produit_vendeur}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(ligne.id)}
                                                        className="mt-2 text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-1 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-xs">delete_outline</span>
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Unit price */}
                                            <div className="md:col-span-2 text-center">
                                                <span className="md:hidden text-xs text-slate-400 block mb-1 uppercase font-bold">Prix</span>
                                                <span className="font-medium">
                                                    {parseFloat(ligne.prix_unitaire).toLocaleString("fr-DZ")} دج
                                                </span>
                                            </div>

                                            {/* Quantity controls */}
                                            <div className="md:col-span-2">
                                                <span className="md:hidden text-xs text-slate-400 block mb-1 uppercase font-bold">Quantité</span>
                                                <div className="flex items-center justify-center border border-primary/20 rounded-lg p-1 max-w-[100px] mx-auto">
                                                    <button
                                                        onClick={() => updateQuantity(ligne.id, ligne.quantite - 1)}
                                                        disabled={ligne.quantite <= 1}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">remove</span>
                                                    </button>
                                                    <span className="w-8 text-center font-bold">{ligne.quantite}</span>
                                                    <button
                                                        disabled={ligne.quantite >= ligne.produit_stock}
                                                        onClick={() => updateQuantity(ligne.id, ligne.quantite + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 rounded transition-colors text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">add</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="md:col-span-2 text-right">
                                                <span className="md:hidden text-xs text-slate-400 block mb-1 uppercase font-bold">Sous-total</span>
                                                <span className="font-bold text-lg">
                                                    {subtotal.toLocaleString("fr-DZ")} دج
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Shipping note */}
                        <div className="mt-6 flex items-start gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                            <span className="material-symbols-outlined text-primary">local_shipping</span>
                            <div>
                                <p className="text-sm font-medium">Livraison locale</p>
                                <p className="text-sm text-slate-500">
                                    Les frais de livraison seront calculés à la commande.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Order Summary Sidebar */}
                    <aside className="mt-10 lg:mt-0 lg:col-span-4 sticky top-28">
                        <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-6 shadow-xl shadow-primary/5">
                            <h2 className="text-xl font-bold mb-6">Récapitulatif</h2>

                            <div className="space-y-3">
                                {lignes.map((ligne) => (
                                    <div key={ligne.id} className="flex justify-between text-sm">
                                        <span className="text-slate-500 truncate max-w-[60%]">
                                            {ligne.produit_nom}
                                            <span className="ml-1 text-slate-400 font-medium">×{ligne.quantite}</span>
                                        </span>
                                        <span className="font-medium">
                                            {(parseFloat(ligne.prix_unitaire) * ligne.quantite).toLocaleString("fr-DZ")} دج
                                        </span>
                                    </div>
                                ))}

                                <div className="pt-4 border-t border-primary/10">
                                    <div className="flex justify-between items-end">
                                        <span className="text-lg font-bold">Total</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-primary">
                                                {Number(total).toLocaleString("fr-DZ")} دج
                                            </span>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">
                                                Livraison non incluse
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                <Link
                                    href="/checkout"
                                    className="w-full bg-primary hover:bg-primary/90 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                                >
                                    Passer la commande
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                                        arrow_forward
                                    </span>
                                </Link>
                                <Link
                                    href="/products"
                                    className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium py-3 rounded-xl transition-all flex items-center justify-center"
                                >
                                    Continuer mes achats
                                </Link>
                            </div>

                            <div className="mt-6 pt-6 border-t border-primary/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary">lock</span>
                                    </div>
                                    <div className="text-sm">
                                        <a className="font-bold text-primary hover:underline" href="#">
                                            Connexion / Inscription
                                        </a>
                                        <p className="text-slate-500">Sauvegardez vos articles</p>
                                    </div>
                                </div>
                            </div>

                            {/* Trusted Badges */}
                            <div className="mt-6 pt-6 border-t border-primary/10 flex flex-wrap justify-center gap-4 opacity-60 hover:opacity-100 transition-all duration-500">
                                {[
                                    { icon: "verified_user", label: "Sécurisé" },
                                    { icon: "payments", label: "Sans frais" },
                                ].map(({ icon, label }) => (
                                    <div key={label} className="flex flex-col items-center">
                                        <span className="material-symbols-outlined text-xl">{icon}</span>
                                        <span className="text-[10px] uppercase font-bold mt-1">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>


        </div>
    );
}