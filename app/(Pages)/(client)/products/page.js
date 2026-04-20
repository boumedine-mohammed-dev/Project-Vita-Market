"use client"
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useClientStore } from "@/app/Store/useClientStore";
import Link from "next/link";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priceInputMin, setPriceInputMin] = useState("");
    const [priceInputMax, setPriceInputMax] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedParents, setExpandedParents] = useState({});
    const [sortOption, setSortOption] = useState("recommended");
    const [minRatingFilter, setMinRatingFilter] = useState(null);
    const [activeTags, setActiveTags] = useState([]);
    const [favorisIds, setFavorisIds] = useState(new Set());
    const [loadingFavori, setLoadingFavori] = useState(new Set());
    const ITEMS_PER_PAGE = 6;
    const { searchTerm, cart, syncCart } = useClientStore();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch("http://localhost:8000/products/all/");
            const data = await res.json();
            setProducts(data);
        };
        const fetchCategories = async () => {
            try {
                const res = await fetch("http://localhost:8000/categories/");
                const data = await res.json();
                setAllCategories(data);
            } catch (err) {
                console.error(err);
            }
        };
        const fetchFavorisIds = async () => {
            try {
                const res = await fetch("http://localhost:8000/favoris/ids/", {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setFavorisIds(new Set(data));
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
        fetchProducts();
        fetchFavorisIds();
    }, []);

    useEffect(() => {
        if (allCategories.length === 0) return;
        const categoryParam = searchParams.get("category");
        if (categoryParam) {
            const match = allCategories.find(
                (c) => c.nom === decodeURIComponent(categoryParam)
            );
            if (match) {
                setSelectedCategory(match);
                if (match.categorie_parente) {
                    const parent = allCategories.find((c) => c.nom === match.categorie_parente);
                    if (parent) setExpandedParents((prev) => ({ ...prev, [parent.id]: true }));
                }
            }
        }
        const tagParam = searchParams.get("tag");
        if (tagParam) {
            setActiveTags([decodeURIComponent(tagParam)]);
        }
    }, [allCategories, searchParams]);

    const categoryTree = useMemo(() => {
        const parents = allCategories.filter((c) => !c.categorie_parente);
        return parents.map((parent) => ({
            ...parent,
            children: allCategories.filter((c) => c.categorie_parente === parent.nom),
        }));
    }, [allCategories]);

    const globalMin = useMemo(() => {
        if (!products.length) return 0;
        return Math.floor(Math.min(...products.map((p) => parseFloat(p.prix))));
    }, [products]);

    const globalMax = useMemo(() => {
        if (!products.length) return 0;
        return Math.ceil(Math.max(...products.map((p) => parseFloat(p.prix))));
    }, [products]);

    const topProductIds = useMemo(() => {
        if (!products.length) return { newest: new Set(), topRated: new Set(), bestseller: new Set() };
        const sorted_by_id = [...products].sort((a, b) => b.id - a.id);
        const sorted_by_rating = [...products].sort((a, b) => parseFloat(b.note_moyenne) - parseFloat(a.note_moyenne));
        const sorted_by_sales = [...products].sort((a, b) => (b.nombre_ventes ?? 0) - (a.nombre_ventes ?? 0));
        return {
            newest: new Set(sorted_by_id.slice(0, Math.ceil(products.length * 0.2)).map((p) => p.id)),
            topRated: new Set(sorted_by_rating.slice(0, Math.ceil(products.length * 0.2)).map((p) => p.id)),
            bestseller: new Set(sorted_by_sales.slice(0, Math.ceil(products.length * 0.2)).map((p) => p.id)),
        };
    }, [products]);

    const filteredProducts = useMemo(() => {
        let result = products.filter((p) => {
            const price = parseFloat(p.prix);

            // ✅ SEARCH
            const searchMatch =
                searchTerm === "" ||
                p.nom.toLowerCase().includes(searchTerm.toLowerCase());

            const categoryMatch = !selectedCategory || p.category_name === selectedCategory.nom;
            const minMatch = priceInputMin === "" || price >= parseFloat(priceInputMin);
            const maxMatch = priceInputMax === "" || price <= parseFloat(priceInputMax);
            const ratingMatch = minRatingFilter === null || parseFloat(p.note_moyenne) >= minRatingFilter;

            const tagMatch =
                activeTags.length === 0 ||
                activeTags.every((tag) => {
                    if (tag === "Nouveautés") return topProductIds.newest.has(p.id);
                    if (tag === "Les mieux notés") return topProductIds.topRated.has(p.id);
                    if (tag === "En stock") return p.quantite_stock > 0;
                    if (tag === "Meilleures ventes") return topProductIds.bestseller?.has(p.id);
                    if (tag === "Favoris") return favorisIds.has(p.id);
                    return true;
                });

            return searchMatch && categoryMatch && minMatch && maxMatch && ratingMatch && tagMatch;
        });

        if (sortOption === "prix_asc")
            result = [...result].sort((a, b) => parseFloat(a.prix) - parseFloat(b.prix));
        else if (sortOption === "prix_desc")
            result = [...result].sort((a, b) => parseFloat(b.prix) - parseFloat(a.prix));

        return result;
    }, [
        products,
        searchTerm,
        selectedCategory,
        priceInputMin,
        priceInputMax,
        sortOption,
        minRatingFilter,
        activeTags,
        topProductIds,
        favorisIds
    ]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleCategoryChange = (cat) => { setSelectedCategory(cat); setCurrentPage(1); };
    const toggleParent = (parentId) => setExpandedParents((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
    const handlePriceReset = () => { setPriceInputMin(""); setPriceInputMax(""); setCurrentPage(1); };
    const toggleTag = (tag) => { setActiveTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]); setCurrentPage(1); };
    const handleRatingFilter = (rating) => { setMinRatingFilter((prev) => (prev === rating ? null : rating)); setCurrentPage(1); };
    const handleClearAll = () => { handleCategoryChange(null); handlePriceReset(); setMinRatingFilter(null); setActiveTags([]); setSortOption("recommended"); };

    const toggleFavori = async (productId) => {
        // Prevent double-click
        if (loadingFavori.has(productId)) return;
        setLoadingFavori((prev) => new Set(prev).add(productId));

        // Optimistic toggle
        setFavorisIds((prev) => {
            const next = new Set(prev);
            if (next.has(productId)) next.delete(productId);
            else next.add(productId);
            return next;
        });

        try {
            const res = await fetch("http://localhost:8000/favoris/toggle/", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_produit: productId }),
            });
            if (!res.ok) throw new Error("Toggle failed");
        } catch (err) {
            // Revert on error
            setFavorisIds((prev) => {
                const next = new Set(prev);
                if (next.has(productId)) next.delete(productId);
                else next.add(productId);
                return next;
            });
            console.error(err);
        } finally {
            setLoadingFavori((prev) => {
                const next = new Set(prev);
                next.delete(productId);
                return next;
            });
        }
    };

    const addToCart = async (productId) => {
        try {
            const res = await fetch("http://localhost:8000/panier/add_product/", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ produit: productId, quantite: 1 }),
            });

            if (!res.ok) {
                alert("Erreur ajout panier");
                return;
            }

            await syncCart();

            alert("Produit ajouté au panier 🛒");
        } catch (err) {
            console.error(err);
        }
    };

    const renderStars = (note) => {
        const rating = Math.round(parseFloat(note) || 0);
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`material-symbols-outlined text-xs ${i < rating ? "fill-current text-amber-400" : "text-slate-300"}`}>star</span>
        ));
    };

    const getPaginationNumbers = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = [1];
        if (currentPage > 3) pages.push("...");
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push("...");
        if (totalPages > 1) pages.push(totalPages);
        return pages;
    };

    const getCategoryIcon = (nom = "") => {
        const n = nom.toLowerCase();
        if (n.includes("pain") || n.includes("farine") || n.includes("pate")) return "grain";
        if (n.includes("boisson")) return "local_drink";
        if (n.includes("chocolat") || n.includes("confiserie")) return "cake";
        if (n.includes("lait") || n.includes("fromage") || n.includes("laitier")) return "water_drop";
        if (n.includes("bio")) return "eco";
        if (n.includes("complément")) return "medication";
        if (n.includes("cosm")) return "spa";
        if (n.includes("tradition")) return "store";
        return "category";
    };

    const hasActiveFilters = selectedCategory || priceInputMin || priceInputMax || minRatingFilter !== null || activeTags.length > 0;
    console.log(products);
    console.log(cart);
    const getCartQuantity = (productId) => {
        const item = cart?.lignes?.find((l) => l.produit_ID == productId);
        return item ? item.quantite : 0;
    }
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
            <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
                <div className="mb-10">
                    <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <a className="hover:text-primary transition-colors" href="/">Home</a>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-slate-900 dark:text-slate-100 font-medium">Produits</span>
                    </nav>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
                                Organic &amp; Local
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 max-w-md">
                                Sourced with love from local farmers and producers.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-500">
                                {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""}
                            </span>
                            <select
                                value={sortOption}
                                onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
                                className="bg-white dark:bg-slate-800 border-[1px] border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium focus:ring-primary focus:border-primary px-3 py-1.5 cursor-pointer"
                            >
                                <option value="recommended">Recommandé</option>
                                <option value="prix_asc">Prix : Croissant</option>
                                <option value="prix_desc">Prix : Décroissant</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-72 shrink-0 space-y-8">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Catégories</h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => handleCategoryChange(null)}
                                    className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all ${!selectedCategory ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"}`}
                                >
                                    <span className="material-symbols-outlined text-xl">apps</span>
                                    <span className="text-sm">Tous les produits</span>
                                </button>
                                {categoryTree.map((parent) => (
                                    <div key={parent.id}>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleCategoryChange(parent)}
                                                className={`flex items-center gap-3 flex-1 px-4 py-2.5 rounded-xl transition-all text-left ${selectedCategory?.id === parent.id ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"}`}
                                            >
                                                <span className="material-symbols-outlined text-xl">{getCategoryIcon(parent.nom)}</span>
                                                <span className="text-sm flex-1">{parent.nom}</span>
                                                {parent.children.length > 0 && (
                                                    <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full px-1.5 py-0.5">
                                                        {parent.children.length}
                                                    </span>
                                                )}
                                            </button>
                                            {parent.children.length > 0 && (
                                                <button
                                                    onClick={() => toggleParent(parent.id)}
                                                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all shrink-0"
                                                >
                                                    <span
                                                        className="material-symbols-outlined text-sm block transition-transform duration-200"
                                                        style={{ transform: expandedParents[parent.id] ? "rotate(90deg)" : "rotate(0deg)" }}
                                                    >
                                                        chevron_right
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                        {parent.children.length > 0 && expandedParents[parent.id] && (
                                            <div className="ml-5 mt-0.5 mb-1 space-y-0.5 border-l-2 border-slate-100 dark:border-slate-800 pl-3">
                                                {parent.children.map((child) => (
                                                    <button
                                                        key={child.id}
                                                        onClick={() => handleCategoryChange(child)}
                                                        className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all text-left ${selectedCategory?.id === child.id ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer"}`}
                                                    >
                                                        <span className="material-symbols-outlined text-base">{getCategoryIcon(child.nom)}</span>
                                                        <span className="text-xs">{child.nom}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">Prix</h3>
                            <div className="px-2 space-y-3">
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="text-xs text-slate-400 mb-1 block">Min</label>
                                        <input
                                            type="number"
                                            placeholder={globalMin.toString()}
                                            value={priceInputMin}
                                            onChange={(e) => { setPriceInputMin(e.target.value); setCurrentPage(1); }}
                                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs text-slate-400 mb-1 block">Max</label>
                                        <input
                                            type="number"
                                            placeholder={globalMax.toString()}
                                            value={priceInputMax}
                                            onChange={(e) => { setPriceInputMax(e.target.value); setCurrentPage(1); }}
                                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handlePriceReset}
                                    className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold px-3 py-1.5 rounded-lg text-xs transition-all"
                                >
                                    Réinitialiser
                                </button>
                                {(priceInputMin !== "" || priceInputMax !== "") && (
                                    <p className="text-xs text-primary font-medium">
                                        {priceInputMin !== "" ? `${priceInputMin} دج` : "0 دج"} – {priceInputMax !== "" ? `${priceInputMax} دج` : "∞"}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Rating Filter */}
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Note</h3>
                            <div className="space-y-2">
                                {[4, 3, 2, 1].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => handleRatingFilter(rating)}
                                        className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all text-left ${minRatingFilter === rating ? "bg-primary/10 text-primary" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                                    >
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <span key={i} className={`material-symbols-outlined text-sm ${i < rating ? (minRatingFilter === rating ? "text-primary" : "text-amber-400") : "text-slate-300"}`}>star</span>
                                            ))}
                                        </div>
                                        <span className="text-xs font-semibold">& +</span>
                                        {minRatingFilter === rating && <span className="material-symbols-outlined text-xs ml-auto">check</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tags — with Favoris */}
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {["Nouveautés", "Les mieux notés", "Meilleures ventes", "En stock", "Favoris"].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${activeTags.includes(tag)
                                            ? tag === "Favoris"
                                                ? "bg-red-50 dark:bg-red-950/30 border-red-400 text-red-500"
                                                : "bg-primary/10 border-primary text-primary"
                                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary"
                                            }`}
                                    >
                                        {tag === "Favoris" ? (
                                            <span
                                                className="material-symbols-outlined text-xs"
                                                style={{ fontVariationSettings: activeTags.includes("Favoris") ? "'FILL' 1" : "'FILL' 0" }}
                                            >
                                                favorite
                                            </span>
                                        ) : activeTags.includes(tag) ? (
                                            <span className="mr-0.5">✓</span>
                                        ) : null}
                                        {tag}
                                        {tag === "Favoris" && favorisIds.size > 0 && (
                                            <span className="ml-1 bg-red-100 dark:bg-red-900/40 text-red-500 text-[10px] font-bold px-1.5 rounded-full">
                                                {favorisIds.size}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <div className="pt-2">
                                <button
                                    onClick={handleClearAll}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-bold transition-all"
                                >
                                    <span className="material-symbols-outlined text-sm">filter_alt_off</span>
                                    Effacer tous les filtres
                                </button>
                            </div>
                        )}
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {(selectedCategory || activeTags.length > 0 || minRatingFilter !== null) && (
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                <span className="text-xs text-slate-500">Filtres actifs :</span>
                                {selectedCategory && (
                                    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                                        {selectedCategory.categorie_parente && <span className="text-primary/60 font-medium">{selectedCategory.categorie_parente} / </span>}
                                        {selectedCategory.nom}
                                        <button onClick={() => handleCategoryChange(null)} className="ml-1 hover:text-primary/60">
                                            <span className="material-symbols-outlined text-xs">close</span>
                                        </button>
                                    </span>
                                )}
                                {minRatingFilter !== null && (
                                    <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 text-xs font-bold px-3 py-1 rounded-full">
                                        {minRatingFilter}★ & +
                                        <button onClick={() => setMinRatingFilter(null)} className="ml-1 hover:opacity-60">
                                            <span className="material-symbols-outlined text-xs">close</span>
                                        </button>
                                    </span>
                                )}
                                {activeTags.map((tag) => (
                                    <span key={tag} className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${tag === "Favoris" ? "bg-red-50 dark:bg-red-950/30 text-red-500" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>
                                        {tag === "Favoris" && <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>}
                                        {tag}
                                        <button onClick={() => toggleTag(tag)} className="ml-1 hover:opacity-60">
                                            <span className="material-symbols-outlined text-xs">close</span>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {paginatedProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4">
                                <span className="material-symbols-outlined text-5xl">search_off</span>
                                <p className="text-lg font-medium">Aucun produit ne correspond à vos filtres.</p>
                                <button onClick={handleClearAll} className="text-primary text-sm font-bold hover:underline">
                                    Effacer tous les filtres
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {paginatedProducts.map((product) => {
                                    const isFavori = favorisIds.has(product.id);
                                    const isFavoriLoading = loadingFavori.has(product.id);
                                    const cartQty = getCartQuantity(product.id);
                                    const isMaxed = cartQty >= product.quantite_stock;
                                    return (
                                        <div key={product.id} className="group bg-white dark:bg-slate-900/40 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                                            <div className="aspect-[4/3] overflow-hidden relative">
                                                <Link href={`/products/${product.id}`}>
                                                    <img
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        alt={product.nom}
                                                        src={product.url}
                                                        onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
                                                    />
                                                </Link>
                                                {/* Category badge */}
                                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-slate-900">
                                                    {product.category_name || "Produit"}
                                                </div>

                                                {/* NEW badge */}
                                                {topProductIds.newest.has(product.id) && (
                                                    <div className="absolute bottom-4 left-4 bg-primary text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                                        NOUVEAU
                                                    </div>
                                                )}

                                                {/* Favorite button */}
                                                <button
                                                    onClick={() => toggleFavori(product.id)}
                                                    disabled={isFavoriLoading}
                                                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm
                                                        ${isFavori
                                                            ? "bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800"
                                                            : "bg-white/90 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-700 opacity-0 group-hover:opacity-100"
                                                        }
                                                        ${isFavoriLoading ? "cursor-not-allowed opacity-60" : "hover:scale-110 cursor-pointer"}
                                                    `}
                                                    title={isFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
                                                >
                                                    {isFavoriLoading ? (
                                                        <span className="material-symbols-outlined text-slate-400 text-sm animate-spin">progress_activity</span>
                                                    ) : (
                                                        <span
                                                            className={`material-symbols-outlined text-sm transition-colors ${isFavori ? "text-red-500" : "text-slate-400 hover:text-red-400"}`}
                                                            style={{ fontVariationSettings: isFavori ? "'FILL' 1" : "'FILL' 0" }}
                                                        >
                                                            favorite
                                                        </span>
                                                    )}
                                                </button>
                                            </div>

                                            <div className="p-6">
                                                <p className="text-[11px] font-bold text-primary uppercase mb-1">
                                                    {product.seller_name || "Vendeur local"}
                                                </p>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 leading-snug line-clamp-2">
                                                    {product.nom}
                                                </h3>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="flex">{renderStars(product.note_moyenne)}</div>
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        ({parseFloat(product.note_moyenne || 0).toFixed(1)})
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                                                            {parseFloat(product.prix).toLocaleString("fr-DZ")} دج
                                                        </span>
                                                        {product.quantite_stock <= 5 && product.quantite_stock > 0 && (
                                                            <p className="text-[10px] text-amber-500 font-semibold mt-0.5">Plus que {product.quantite_stock} !</p>
                                                        )}
                                                        {product.quantite_stock === 0 && (
                                                            <p className="text-[10px] text-red-500 font-semibold mt-0.5">Rupture de stock</p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => addToCart(product.id)}
                                                        disabled={product.quantite_stock === 0 || isMaxed}
                                                        className="bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-bold px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-2"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">
                                                            add_shopping_cart
                                                        </span>
                                                        Ajouter
                                                    </button>

                                                </div>
                                                {isMaxed && product.quantite_stock > 0 && (
                                                    <p className="text-[10px] text-red-500 mt-1 font-semibold">
                                                        Quantité maximale atteinte
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-primary hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                {getPaginationNumbers().map((page, idx) =>
                                    page === "..." ? (
                                        <span key={`e-${idx}`} className="mx-2 text-slate-400">...</span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${currentPage === page ? "bg-primary text-slate-900" : "border-[1px] border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"}`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-primary hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 py-12 px-4 md:px-10 lg:px-20 bg-white dark:bg-background-dark">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 mb-6">
                            <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-xl">eco</span>
                            </div>
                            <h2 className="text-xl font-extrabold">VitaMarket</h2>
                        </div>
                        <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
                            Connecting you directly with local farmers and artisans. Promoting sustainable living and fair trade for a healthier planet.
                        </p>
                        <div className="flex gap-4">
                            <a className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary/20 transition-colors" href="#">
                                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">public</span>
                            </a>
                            <a className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary/20 transition-colors" href="#">
                                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">alternate_email</span>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-6">Communauté</h4>
                        <ul className="space-y-3 text-slate-500 text-sm font-medium">
                            <li><a className="hover:text-primary transition-colors" href="#">Nos producteurs</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Guide vendeur</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Événements locaux</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Newsletter</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-6">Support</h4>
                        <ul className="space-y-3 text-slate-500 text-sm font-medium">
                            <li><a className="hover:text-primary transition-colors" href="#">Livraison</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Retours &amp; Remboursements</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Politique de confidentialité</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Contactez-nous</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-400">© 2024 VitaMarket. Tous droits réservés.</p>
                    <div className="flex items-center gap-6">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">language</span> Français (DZ)
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">monetization_on</span> DZD
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}