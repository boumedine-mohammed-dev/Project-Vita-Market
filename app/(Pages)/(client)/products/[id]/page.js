"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useClientStore } from "@/app/Store/useClientStore"

function Stars({ count, total = 5, size = "text-sm" }) {
    const rating = parseFloat(count) || 0;
    return (
        <div className="flex">
            {Array.from({ length: total }).map((_, i) => (
                <span
                    key={i}
                    className={`material-symbols-outlined ${size} ${i < Math.floor(rating) ? "text-amber-400" : "text-slate-300"}`}
                    style={{ fontVariationSettings: i < Math.floor(rating) ? "'FILL' 1" : "'FILL' 0" }}
                >
                    star
                </span>
            ))}
        </div>
    )
}

export default function ProductDetailsPage() {
    const { id } = useParams()
    const { syncCart, cart } = useClientStore()
    const [product, setProduct] = useState(null)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeThumb, setActiveThumb] = useState(0)
    const [activeTab, setActiveTab] = useState(0)
    const [qty, setQty] = useState(1)
    const [isFavori, setIsFavori] = useState(false)
    const [favoriLoading, setFavoriLoading] = useState(false)
    const [addingToCart, setAddingToCart] = useState(false)
    const [cartSuccess, setCartSuccess] = useState(false)

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:8000/products/${id}/`);
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        const fetchReviews = async () => {
            try {
                const res = await fetch(`http://localhost:8000/reviews/?produit=${id}`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setReviews(Array.isArray(data) ? data : data.results ?? []);
                }
            } catch (err) {
                console.error(err);
            }
        };
        const fetchFavoriStatus = async () => {
            try {
                const res = await fetch(`http://localhost:8000/favoris/ids/`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const ids = await res.json();
                    setIsFavori(ids.includes(parseInt(id)));
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchProduct();
        fetchReviews();
        fetchFavoriStatus();
    }, [id]);

    const toggleFavori = async () => {
        if (favoriLoading) return;
        setFavoriLoading(true);
        setIsFavori((prev) => !prev); // optimistic
        try {
            const res = await fetch("http://localhost:8000/favoris/toggle/", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_produit: parseInt(id) }),
            });
            if (!res.ok) throw new Error();
        } catch {
            setIsFavori((prev) => !prev); // revert
        } finally {
            setFavoriLoading(false);
        }
    };

    const addToCart = async () => {
        if (addingToCart) return;
        setAddingToCart(true);
        try {
            const res = await fetch("http://localhost:8000/panier/add_product/", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ produit: parseInt(id), quantite: qty }),
            });
            if (!res.ok) throw new Error();
            await syncCart();
            setCartSuccess(true);
            setTimeout(() => setCartSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setAddingToCart(false);
        }
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f8f6] dark:bg-[#182111] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-slate-400">
                    <span className="material-symbols-outlined text-5xl animate-spin">progress_activity</span>
                    <p className="text-sm font-medium">Chargement du produit...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#f7f8f6] dark:bg-[#182111] flex flex-col items-center justify-center gap-4 text-slate-400">
                <span className="material-symbols-outlined text-5xl">search_off</span>
                <p className="text-lg font-medium">Produit introuvable.</p>
                <a href="/products" className="text-primary font-bold hover:underline text-sm">← Retour aux produits</a>
            </div>
        );
    }

    // Build image gallery: primary url + any extras
    const images = [
        product.url,
        ...(product.images ?? []),
    ].filter(Boolean);
    if (images.length === 0) images.push("https://via.placeholder.com/600x400?text=No+Image");

    const rating = parseFloat(product.note_moyenne || 0);
    const inStock = product.quantite_stock > 0;
    const lowStock = product.quantite_stock <= 5 && product.quantite_stock > 0;

    const tabs = [
        "Description",
        `Avis (${reviews.length})`,
    ];
    const getCartQuantity = (productId) => {
        const item = cart?.lignes?.find((l) => l.produit_ID == productId);
        return item ? item.quantite : 0;
    }
    const cartQty = getCartQuantity(id);
    const isMaxed = cartQty >= product.quantite_stock;
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f7f8f6] dark:bg-[#182111] font-display text-slate-900 dark:text-slate-100">
            <main className="flex-1 px-4 md:px-10 lg:px-20 xl:px-40 py-8">

                {/* Breadcrumbs */}
                <nav className="flex flex-wrap gap-2 pb-6 text-sm">
                    <a className="text-slate-500 hover:text-primary transition-colors" href="/">Accueil</a>
                    <span className="text-slate-400">/</span>
                    <a className="text-slate-500 hover:text-primary transition-colors" href="/products">Produits</a>
                    {product.category_name && (
                        <>
                            <span className="text-slate-400">/</span>
                            <a
                                className="text-slate-500 hover:text-primary transition-colors"
                                href={`/products?category=${encodeURIComponent(product.category_name)}`}
                            >
                                {product.category_name}
                            </a>
                        </>
                    )}
                    <span className="text-slate-400">/</span>
                    <span className="text-slate-900 dark:text-slate-100 font-semibold line-clamp-1">{product.nom}</span>
                </nav>

                {/* Product Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* ── Gallery ── */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                        {/* Main image */}
                        <div className="w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm aspect-[4/3] border border-slate-200 dark:border-slate-800 relative">
                            <img
                                src={images[activeThumb]}
                                alt={product.nom}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=No+Image"; }}
                            />
                            {/* Stock badge on image */}
                            {!inStock && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-sm">Rupture de stock</span>
                                </div>
                            )}
                            {lowStock && (
                                <div className="absolute top-4 left-4 bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                    Plus que {product.quantite_stock} !
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {images.slice(0, 4).map((url, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setActiveThumb(i)}
                                        className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activeThumb === i
                                            ? "border-primary shadow-md shadow-primary/20"
                                            : "border-slate-200 dark:border-slate-800 hover:border-primary/50"
                                            }`}
                                    >
                                        <img
                                            src={url}
                                            alt={`${product.nom} ${i + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=?"; }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Product Details ── */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                        {/* Status + Title + Rating */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${inStock ? "bg-primary/20 text-primary" : "bg-red-100 dark:bg-red-950/30 text-red-500"}`}>
                                    {inStock ? "En stock" : "Rupture de stock"}
                                </span>
                                {product.category_name && (
                                    <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold">
                                        {product.category_name}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-3">
                                {product.nom}
                            </h1>
                            <div className="flex items-center gap-3 mb-4">
                                <Stars count={rating} total={5} size="text-base" />
                                <span className="text-slate-500 text-sm font-medium">
                                    {rating.toFixed(1)} ({reviews.length} avis)
                                </span>
                            </div>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                {parseFloat(product.prix).toLocaleString("fr-DZ")}
                                <span className="text-lg font-normal text-slate-500 ml-1">دج</span>
                            </p>
                        </div>

                        {/* Vendor card */}
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary text-xl">storefront</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Vendu par</p>
                                    <p className="font-bold text-slate-900 dark:text-white">{product.seller_name || "Vendeur local"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Short description */}
                        {product.description && (
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                                {product.description}
                            </p>
                        )}

                        {/* Quantity + Add to cart */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-4">
                                {/* Qty stepper */}
                                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl h-12 bg-white dark:bg-slate-900 overflow-hidden">
                                    <button
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="px-4 h-full text-slate-500 hover:text-primary hover:bg-primary/5 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">remove</span>
                                    </button>
                                    <span className="w-10 text-center font-bold text-slate-900 dark:text-slate-100 select-none">{qty}</span>
                                    <button
                                        onClick={() => setQty(Math.min(product.quantite_stock, qty + 1))}
                                        disabled={!inStock}
                                        className="px-4 h-full text-slate-500 hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-30"
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span>
                                    </button>
                                </div>

                                {/* Add to cart button */}
                                <button
                                    onClick={addToCart}
                                    disabled={!inStock || addingToCart || isMaxed}
                                    className={`flex-1 h-12 font-bold rounded-xl flex items-center justify-center gap-2 transition-all
                                        ${cartSuccess
                                            ? "bg-green-500 text-white"
                                            : "bg-primary hover:bg-primary/90 text-slate-900"
                                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                                >
                                    {addingToCart ? (
                                        <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                    ) : cartSuccess ? (
                                        <>
                                            <span className="material-symbols-outlined text-lg">check_circle</span>
                                            Ajouté !
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                                            Ajouter au panier
                                        </>
                                    )}
                                </button>
                            </div>
                            {isMaxed && product.quantite_stock > 0 && (
                                <p className="text-[10px] text-red-500 mt-1 font-semibold">
                                    Quantité maximale atteinte dans le panier
                                </p>
                            )}
                            {/* Wishlist button */}
                            <button
                                onClick={toggleFavori}
                                disabled={favoriLoading}
                                className={`w-full h-12 border-2 font-bold rounded-xl flex items-center justify-center gap-2 transition-all
                                    ${isFavori
                                        ? "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20 text-red-500"
                                        : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                            >
                                {favoriLoading ? (
                                    <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                ) : (
                                    <span
                                        className="material-symbols-outlined text-lg"
                                        style={{ fontVariationSettings: isFavori ? "'FILL' 1" : "'FILL' 0" }}
                                    >
                                        favorite
                                    </span>
                                )}
                                {isFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
                            </button>
                        </div>

                        {/* Delivery info */}
                        <div className="flex flex-wrap items-center gap-4 py-4 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <span className="material-symbols-outlined text-primary text-base">local_shipping</span>
                                Livraison locale
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <span className="material-symbols-outlined text-primary text-base">assignment_return</span>
                                Fraîcheur garantie
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <span className="material-symbols-outlined text-primary text-base">payments</span>
                                Paiement à la livraison
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Tabs Section ── */}
                <div className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-12">
                    <div className="flex gap-10 border-b border-slate-200 dark:border-slate-800 mb-10 overflow-x-auto whitespace-nowrap">
                        {tabs.map((tab, i) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(i)}
                                className={`pb-4 border-b-2 font-medium text-lg transition-colors ${activeTab === i
                                    ? "border-primary text-slate-900 dark:text-white font-bold"
                                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        {/* Main content */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Description tab */}
                            {activeTab === 0 && (
                                <div>
                                    <h3 className="text-xl font-bold mb-4">Description</h3>
                                    {product.description ? (
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                            {product.description}
                                        </p>
                                    ) : (
                                        <p className="text-slate-400 italic">Aucune description disponible.</p>
                                    )}
                                </div>
                            )}

                            {/* Reviews tab */}
                            {activeTab === 1 && (
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Avis clients</h3>

                                    {/* Rating summary */}
                                    <div className="flex items-center gap-4 mb-8 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <div className="text-center">
                                            <p className="text-5xl font-black text-slate-900 dark:text-white">{rating.toFixed(1)}</p>
                                            <Stars count={rating} total={5} size="text-sm" />
                                            <p className="text-xs text-slate-400 mt-1">{reviews.length} avis</p>
                                        </div>
                                        <div className="flex-1 space-y-1.5 pl-4 border-l border-slate-100 dark:border-slate-800">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const count = reviews.filter((r) => Math.round(parseFloat(r.note)) === star).length;
                                                const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                                                return (
                                                    <div key={star} className="flex items-center gap-2">
                                                        <span className="text-xs text-slate-400 w-4 text-right">{star}</span>
                                                        <span className="material-symbols-outlined text-amber-400 text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                                                        </div>
                                                        <span className="text-xs text-slate-400 w-8">{pct}%</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Review list */}
                                    {reviews.length === 0 ? (
                                        <div className="flex flex-col items-center py-12 text-slate-400 gap-3">
                                            <span className="material-symbols-outlined text-4xl">rate_review</span>
                                            <p className="text-sm">Aucun avis pour ce produit.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {reviews.map((r, i) => (
                                                <div key={i} className="flex gap-4 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                        <span className="material-symbols-outlined text-primary text-lg">person</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <p className="font-bold text-slate-900 dark:text-white">
                                                                {r.user_name || r.user || "Anonyme"}
                                                            </p>
                                                            <span className="text-xs text-slate-400">
                                                                {r.created_at
                                                                    ? new Date(r.created_at).toLocaleDateString("fr-DZ", { day: "numeric", month: "long", year: "numeric" })
                                                                    : ""}
                                                            </span>
                                                        </div>
                                                        <Stars count={parseFloat(r.note || 0)} total={5} size="text-xs" />
                                                        {r.commentaire && (
                                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-3">
                                                                {r.commentaire}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sidebar — product meta */}
                        <div className="space-y-6">
                            {/* Quick info card */}
                            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Informations</h4>
                                {[
                                    { icon: "category", label: "Catégorie", value: product.category_name || "—" },
                                    { icon: "storefront", label: "Vendeur", value: product.seller_name || "—" },
                                    { icon: "inventory_2", label: "Stock", value: inStock ? `${product.quantite_stock} disponible${product.quantite_stock > 1 ? "s" : ""}` : "Rupture" },
                                    { icon: "sell", label: "Prix", value: `${parseFloat(product.prix).toLocaleString("fr-DZ")} دج` },
                                ].map(({ icon, label, value }) => (
                                    <div key={label} className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                                        <span className="material-symbols-outlined text-primary text-base">{icon}</span>
                                        <div className="flex-1 flex justify-between items-center">
                                            <span className="text-sm text-slate-500">{label}</span>
                                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Share */}
                            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Partager</h4>
                                <div className="flex gap-3">
                                    {[
                                        { icon: "share", label: "Copier le lien" },
                                        { icon: "public", label: "Web" },
                                    ].map(({ icon, label }) => (
                                        <button
                                            key={icon}
                                            className="flex-1 flex flex-col items-center gap-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition-colors text-slate-500"
                                        >
                                            <span className="material-symbols-outlined text-lg">{icon}</span>
                                            <span className="text-[10px] font-bold">{label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Back to products */}
                            <a
                                href="/products"
                                className="flex items-center gap-2 text-sm text-primary font-bold hover:underline px-2"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Retour aux produits
                            </a>
                        </div>
                    </div>
                </div >
            </main >

            {/* Footer */}
            < footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 md:px-10 lg:px-20 xl:px-40 py-12" >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100 mb-4">
                            <span className="material-symbols-outlined text-primary text-2xl">eco</span>
                            <h2 className="text-lg font-bold">VitaMarket</h2>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Rapprocher les producteurs locaux des consommateurs responsables.
                        </p>
                    </div>
                    {[
                        { title: "Marché", links: ["Toutes les catégories", "Nouveautés", "Vendeurs vedettes"] },
                        { title: "Support", links: ["Livraison", "Retours & Remboursements", "Contactez-nous"] },
                    ].map(({ title, links }) => (
                        <div key={title}>
                            <h4 className="font-bold text-sm uppercase tracking-widest mb-4">{title}</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                {links.map((l) => <li key={l}><a className="hover:text-primary transition-colors" href="#">{l}</a></li>)}
                            </ul>
                        </div>
                    ))}
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-4">Communauté</h4>
                        <div className="flex gap-3">
                            {["share", "public", "camera"].map((icon) => (
                                <a key={icon} className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-primary/10 hover:text-primary transition-colors" href="#">
                                    <span className="material-symbols-outlined text-lg">{icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-xs">© 2024 VitaMarket. Tous droits réservés.</p>
                    <div className="flex gap-6 text-xs text-slate-400">
                        <a className="hover:text-primary" href="#">Confidentialité</a>
                        <a className="hover:text-primary" href="#">CGU</a>
                    </div>
                </div>
            </footer >
        </div >
    )
}