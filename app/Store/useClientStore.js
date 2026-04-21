import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

export const useClientStore = create(
    persist(
        (set, get) => ({
            categories: [],
            products: [],
            count: 0,
            cart: null,
            searchTerm: "",

            setSearchTerm: (value) => set({ searchTerm: value }),

            fetchCategories: async () => {
                try {
                    const res = await fetch("http://localhost:8000/categories/");
                    const data = await res.json();
                    const roots = data.filter((c) => c.categorie_parente === null || c.categorie_parente === undefined);
                    set({ categories: roots });
                } catch (err) {
                    console.error(err);
                }
            },

            fetchProducts: async () => {
                const res = await fetch("http://localhost:8000/products/all/");
                const data = await res.json();
                set({ products: data });
            },

            setCount: (value) => set({ count: value }),
            reset: () => set({ count: 0 }),
            setCart: (cart) => set({ cart }),

            fetchCart: async () => {
                const user = useAuthStore.getState().user;
                if (!user) {
                    // Guest cart mode: update count based on existing local cart
                    const localCart = get().cart;
                    const totalItems = localCart?.lignes?.reduce((sum, item) => sum + item.quantite, 0) ?? 0;
                    set({ count: totalItems });
                    return;
                }
                try {
                    const res = await fetch("http://localhost:8000/panier/my_panier/", { credentials: "include" });
                    if(res.ok) {
                        const data = await res.json();
                        set({ cart: data || null });
                        const totalItems = data?.lignes?.reduce((sum, item) => sum + item.quantite, 0) ?? 0;
                        set({ count: totalItems });
                    }
                } catch (err) {
                    console.error(err);
                }
            },

            syncCart: async () => {
                await get().fetchCart();
            },

            addToCartLocal: (product, quantite = 1) => {
                set((state) => {
                    const cart = state.cart || { lignes: [], total: 0 };
                    const existingLigneIndex = cart.lignes.findIndex((l) => l.produit_ID === product.id);
                    let newLignes = [...cart.lignes];

                    if (existingLigneIndex >= 0) {
                        newLignes[existingLigneIndex].quantite += quantite;
                    } else {
                        newLignes.push({
                            id: "local_" + Date.now() + Math.random(),
                            produit_ID: product.id,
                            produit_nom: product.nom,
                            produit_url: product.url,
                            produit_vendeur: product.seller_name || "Vendeur",
                            produit_stock: product.quantite_stock,
                            prix_unitaire: product.prix,
                            quantite: quantite,
                        });
                    }

                    const newTotal = newLignes.reduce((sum, l) => sum + parseFloat(l.prix_unitaire) * l.quantite, 0);
                    const newCount = newLignes.reduce((sum, l) => sum + l.quantite, 0);

                    return {
                        cart: { ...cart, lignes: newLignes, total: newTotal },
                        count: newCount,
                    };
                });
            },

            removeFromCart: async (ligneId) => {
                const user = useAuthStore.getState().user;
                if (!user) {
                    set((state) => {
                        const newLignes = state.cart.lignes.filter((l) => l.id !== ligneId);
                        const newTotal = newLignes.reduce((sum, l) => sum + parseFloat(l.prix_unitaire) * l.quantite, 0);
                        const newCount = newLignes.reduce((sum, l) => sum + l.quantite, 0);
                        return { cart: { ...state.cart, lignes: newLignes, total: newTotal }, count: newCount };
                    });
                    return;
                }

                try {
                    await fetch(`http://localhost:8000/panier/retirer_ligne/${ligneId}/`, {
                        method: "DELETE",
                        credentials: "include",
                    });
                    set((state) => {
                        const newLignes = state.cart.lignes.filter((l) => l.id !== ligneId);
                        const newTotal = newLignes.reduce((sum, l) => sum + parseFloat(l.prix_unitaire) * l.quantite, 0);
                        const newCount = newLignes.reduce((sum, l) => sum + l.quantite, 0);
                        return { cart: { ...state.cart, lignes: newLignes, total: newTotal }, count: newCount };
                    });
                } catch (err) {
                    console.error(err);
                    get().fetchCart();
                }
            },

            updateQuantity: async (ligneId, newQuantite) => {
                if (newQuantite < 1) return;
                const user = useAuthStore.getState().user;

                if (!user) {
                    set((state) => {
                        const newLignes = state.cart.lignes.map((l) => l.id === ligneId ? { ...l, quantite: newQuantite } : l);
                        const newTotal = newLignes.reduce((sum, l) => sum + parseFloat(l.prix_unitaire) * l.quantite, 0);
                        const newCount = newLignes.reduce((sum, l) => sum + l.quantite, 0);
                        return { cart: { ...state.cart, lignes: newLignes, total: newTotal }, count: newCount };
                    });
                    return;
                }

                try {
                    await fetch(`http://localhost:8000/panier/modifier_ligne/${ligneId}/`, {
                        method: "PATCH",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ quantite: newQuantite }),
                    });
                    set((state) => {
                        const newLignes = state.cart.lignes.map((l) => l.id === ligneId ? { ...l, quantite: newQuantite } : l);
                        const newTotal = newLignes.reduce((sum, l) => sum + parseFloat(l.prix_unitaire) * l.quantite, 0);
                        const newCount = newLignes.reduce((sum, l) => sum + l.quantite, 0);
                        return { cart: { ...state.cart, lignes: newLignes, total: newTotal }, count: newCount };
                    });
                } catch (err) {
                    console.error(err);
                    get().fetchCart();
                }
            },
            
            clearCart: () => set({ cart: null, count: 0 }),
        }),
        {
            name: "client-storage", // name of the item in the storage (must be unique)
            partialIZE: (state) => ({ cart: state.cart }),
        }
    )
);