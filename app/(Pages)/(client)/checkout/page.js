"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useClientStore } from "@/app/Store/useClientStore"
import { useAuthStore } from "@/app/Store/useAuthStore"
import jsPDF from "jspdf";
const WILAYAS = [
    "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi",
    "05 - Batna", "06 - Béjaïa", "07 - Biskra", "08 - Béchar",
    "09 - Blida", "10 - Bouira", "11 - Tamanrasset", "12 - Tébessa",
    "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou", "16 - Alger",
    "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda",
    "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma",
    "25 - Constantine", "26 - Médéa", "27 - Mostaganem", "28 - M'Sila",
    "29 - Mascara", "30 - Ouargla", "31 - Oran", "32 - El Bayadh",
    "33 - Illizi", "34 - Bordj Bou Arréridj", "35 - Boumerdès",
    "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued",
    "40 - Khenchela", "41 - Souk Ahras", "42 - Tipaza", "43 - Mila",
    "44 - Aïn Defla", "45 - Naâma", "46 - Aïn Témouchent", "47 - Ghardaïa",
    "48 - Relizane", "49 - Timimoun", "50 - Bordj Badji Mokhtar",
    "51 - Ouled Djellal", "52 - Béni Abbès", "53 - In Salah",
    "54 - In Guezzam", "55 - Touggourt", "56 - Djanet",
    "57 - El M'Ghair", "58 - El Meniaa",
];

export default function CheckoutPage() {
    const { cart } = useClientStore();
    const { user } = useAuthStore();
    useEffect(() => {
        if (user) {
            setForm((prev) => ({
                ...prev,
                fullName: user.full_name || user.username || "",
                email: user.email || "",
                phone: user.telephone || "",
                address: user.info?.adresse_livraison || "",
            }));
        }
    }, [user]);
    const lignes = cart?.lignes ?? [];
    const cartSubtotal = cart?.total ?? 0;
    const DELIVERY_FEE = 500;
    const grandTotal = cartSubtotal + DELIVERY_FEE;

    const [form, setForm] = useState({
        fullName: user?.full_name || user?.username || "",
        email: user?.email || "",
        phone: user?.telephone || "",
        address: user?.info?.adresse_livraison || "",
        wilaya: "",
        postalCode: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const generateFacture = (commande) => {
        try {
            const doc = new jsPDF();

            // 🧾 Header
            doc.setFontSize(18);
            doc.text("Facture", 14, 20);

            doc.setFontSize(10);
            doc.text(`Commande #${commande.numero_commande}`, 14, 30);
            doc.text(`Date: ${new Date(commande.created_at ?? Date.now()).toLocaleDateString("fr-DZ")}`, 14, 36);

            // 👤 Client
            doc.text(`Nom: ${commande.nom}`, 14, 46);
            doc.text(`Email: ${commande.email ?? form.email}`, 14, 52);
            doc.text(`Téléphone: ${commande.telephone}`, 14, 58);
            doc.text(`Adresse: ${commande.adresse_livraison}`, 14, 64);

            // 📦 Produits
            let y = 76;
            doc.text("Produits:", 14, y);
            y += 6;

            const lines = commande.lignes ?? lignes;
            lines.forEach((ligne) => {
                const nom = ligne.produit_nom ?? ligne.produit_nom ?? "Produit";
                const qte = ligne.quantite;
                const prix = parseFloat(ligne.prix_unitaire ?? 0);
                doc.text(`${nom} x${qte} - ${(prix * qte).toLocaleString("fr-DZ")} DA`, 14, y);
                y += 6;
            });

            // 💰 Totaux
            y += 10;
            doc.text(`Sous-total: ${Number(commande.sous_total ?? cartSubtotal).toLocaleString("fr-DZ")} DA`, 14, y);
            y += 6;
            doc.text(`Livraison: ${Number(commande.frais_livraison ?? DELIVERY_FEE).toLocaleString("fr-DZ")} DA`, 14, y);
            y += 6;
            doc.setFontSize(12);
            doc.text(`TOTAL: ${Number(commande.total ?? grandTotal).toLocaleString("fr-DZ")} DA`, 14, y);

            // 📥 Auto-download
            doc.save(`facture-${commande.numero_commande ?? "commande"}.pdf`);

        } catch (e) {
            console.error("Erreur génération facture:", e.message);
        }
    };
    const handleSubmit = async () => {
        if (!form.fullName || !form.phone || !form.address || !form.wilaya) {
            setError("Veuillez remplir tous les champs obligatoires.");
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const isGuest = !user;
            const lignesPayload = isGuest ? lignes.map(l => ({
                produit: l.produit_ID ?? l.produit,
                quantite: l.quantite
            })) : undefined;

            const res = await fetch("http://localhost:8000/commandes/", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nom: form.fullName,
                    email: form.email,
                    telephone: form.phone,
                    adresse_livraison: `${form.address}, ${form.wilaya}, ${form.postalCode}`,
                    statut: "en_attente",
                    total: grandTotal,
                    sous_total: cartSubtotal,
                    frais_livraison: DELIVERY_FEE,
                    numero_suivi: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                    numero_commande: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                    ...(isGuest && { lignes: lignesPayload })
                }),
            });
            const data = await res.json();
            console.log(data);
            if (!res.ok) throw new Error(data.error);

            // ✅ Auto-generate & download invoice
            generateFacture(data);

            setSubmitted(true);
            useClientStore.getState().clearCart();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Success screen
    if (submitted) {
        return (
            <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center justify-center gap-6 px-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
                </div>
                <h1 className="text-3xl font-extrabold text-center">Commande confirmée !</h1>
                <p className="text-slate-500 text-center max-w-sm">
                    Merci pour votre commande. Vous serez contacté(e) pour la livraison.
                </p>
                <Link
                    href="/products"
                    className="bg-primary text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-primary/90 transition-all"
                >
                    Continuer mes achats
                </Link>
            </div>
        );
    }

    // Empty cart guard
    if (lignes.length === 0) {
        return (
            <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center justify-center gap-6">
                <span className="material-symbols-outlined text-6xl text-slate-300">shopping_cart</span>
                <h2 className="text-2xl font-bold text-slate-500">Votre panier est vide</h2>
                <Link href="/products" className="bg-primary text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all">
                    Parcourir les produits
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
            <main className="max-w-[1200px] mx-auto w-full px-6 py-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 mb-8 text-sm font-medium">
                    <Link href="/cart" className="text-slate-500 hover:text-primary transition-colors">Panier</Link>
                    <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
                    <span className="text-slate-900 dark:text-white font-bold">Commande</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* ── LEFT COLUMN ── */}
                    <div className="lg:col-span-8 space-y-8">
                        <div>
                            <h1 className="text-4xl font-extrabold mb-2">Finaliser la commande</h1>
                            <p className="text-slate-500">Remplissez vos informations pour valider votre achat.</p>
                        </div>

                        {/* Error banner */}
                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 text-sm font-medium">
                                <span className="material-symbols-outlined text-base">error</span>
                                {error}
                            </div>
                        )}

                        {/* Customer Info */}
                        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">person</span>
                                <h3 className="text-xl font-bold">Informations client</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold mb-2">
                                        Nom complet <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                        placeholder="Nom et prénom"
                                        type="text"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Adresse email</label>
                                    <input
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                        placeholder="email@exemple.com"
                                        type="email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Numéro de téléphone <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                        placeholder="0555 000 000"
                                        type="tel"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Shipping Address */}
                        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                                <h3 className="text-xl font-bold">Adresse de livraison</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold mb-2">
                                        Adresse <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                        placeholder="Rue, numéro, quartier..."
                                        type="text"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Wilaya <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="wilaya"
                                        value={form.wilaya}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm cursor-pointer"
                                    >
                                        <option value="">— Choisir une wilaya —</option>
                                        {WILAYAS.map((w) => (
                                            <option key={w} value={w}>{w}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Code postal</label>
                                    <input
                                        name="postalCode"
                                        value={form.postalCode}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                        placeholder="ex: 31000"
                                        type="text"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Payment Method — Cash only */}
                        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="material-symbols-outlined text-primary">payments</span>
                                <h3 className="text-xl font-bold">Méthode de paiement</h3>
                            </div>
                            <div className="flex items-center gap-4 p-5 rounded-xl border-2 border-primary bg-primary/5">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary text-2xl">payments</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900 dark:text-white">Paiement à la livraison</p>
                                    <p className="text-sm text-slate-500 mt-0.5">Payez en espèces lors de la réception de votre commande.</p>
                                </div>
                                <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary flex items-center justify-center shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                            </div>
                            <p className="mt-4 text-xs text-slate-400 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm">info</span>
                                Ayez le montant exact si possible. Notre livreur vous contactera avant l'arrivée.
                            </p>
                        </section>
                    </div>

                    {/* ── RIGHT COLUMN — Order Summary ── */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">

                                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                    <h3 className="text-xl font-bold">Récapitulatif</h3>
                                    <p className="text-xs text-slate-400 mt-1">{lignes.length} article{lignes.length !== 1 ? "s" : ""}</p>
                                </div>

                                {/* Line items */}
                                <div className="p-6 space-y-4 max-h-[360px] overflow-y-auto">
                                    {lignes.map((ligne) => (
                                        <div key={ligne.id} className="flex gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700">
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src={ligne.produit_url}
                                                    alt={ligne.produit_nom}
                                                    onError={(e) => { e.target.src = "https://via.placeholder.com/64?text=?"; }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                                                    {ligne.produit_nom}
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-0.5">{ligne.produit_vendeur}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-xs text-slate-400">Qté : {ligne.quantite}</span>
                                                    <span className="text-sm font-extrabold text-primary">
                                                        {(parseFloat(ligne.prix_unitaire) * ligne.quantite).toLocaleString("fr-DZ")} دج
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 space-y-3 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                        <span>Sous-total</span>
                                        <span className="font-semibold">{Number(cartSubtotal).toLocaleString("fr-DZ")} دج</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                        <span>Frais de livraison</span>
                                        <span className="font-semibold">{DELIVERY_FEE.toLocaleString("fr-DZ")} دج</span>
                                    </div>
                                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end">
                                        <span className="text-lg font-bold">Total</span>
                                        <span className="text-2xl font-extrabold text-primary">
                                            {grandTotal.toLocaleString("fr-DZ")} دج
                                        </span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="p-6">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-extrabold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                                Traitement...
                                            </>
                                        ) : (
                                            <>
                                                Confirmer la commande
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </>
                                        )}
                                    </button>
                                    <p className="text-[10px] text-center text-slate-400 mt-4 leading-tight uppercase tracking-widest font-bold">
                                        Emballage écologique garanti
                                    </p>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 px-2 leading-relaxed text-center">
                                En passant votre commande, vous acceptez nos{" "}
                                <a className="underline text-primary" href="#">Conditions d'utilisation</a>
                                {" "}et notre{" "}
                                <a className="underline text-primary" href="#">Politique de confidentialité</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </main>


        </div>
    );
}