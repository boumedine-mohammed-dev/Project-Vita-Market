import { create } from "zustand";

export const useClientStore = create((set, get) => ({
    categories: [],
    products: [],
    count: 0,
    cart: null,

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

    fetchCart: async () => {
        try {
            const res = await fetch("http://localhost:8000/panier/my_panier/", {
                credentials: "include",
            });
            const data = await res.json();
            set({ cart: data || null });
            const totalItems = data?.lignes?.reduce((sum, item) => sum + item.quantite, 0) ?? 0;
            set({ count: totalItems });
        } catch (err) {
            console.error(err);
        }
    },

    removeFromCart: async (ligneId) => {
        try {
            await fetch(`http://localhost:8000/panier/retirer_ligne/${ligneId}/`, {
                method: "DELETE",
                credentials: "include",
            });
            // Optimistic update: remove the line locally
            set((state) => {
                const newLignes = state.cart.lignes.filter((l) => l.id !== ligneId);
                const newTotal = newLignes.reduce(
                    (sum, l) => sum + parseFloat(l.prix_unitaire) * l.quantite, 0
                );
                const newCount = newLignes.reduce((sum, l) => sum + l.quantite, 0);
                return {
                    cart: { ...state.cart, lignes: newLignes, total: newTotal },
                    count: newCount,
                };
            });
        } catch (err) {
            console.error(err);
            // Re-fetch on error to sync with server
            get().fetchCart();
        }
    },

    updateQuantity: async (ligneId, newQuantite) => {
        if (newQuantite < 1) return;
        try {
            await fetch(`http://localhost:8000/panier/modifier_ligne/${ligneId}/`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantite: newQuantite }),
            });
            // Optimistic update: update quantity locally
            set((state) => {
                const newLignes = state.cart.lignes.map((l) =>
                    l.id === ligneId ? { ...l, quantite: newQuantite } : l
                );
                const newTotal = newLignes.reduce(
                    (sum, l) => sum + parseFloat(l.prix_unitaire) * l.quantite, 0
                );
                const newCount = newLignes.reduce((sum, l) => sum + l.quantite, 0);
                return {
                    cart: { ...state.cart, lignes: newLignes, total: newTotal },
                    count: newCount,
                };
            });
        } catch (err) {
            console.error(err);
            get().fetchCart();
        }
    },
    setCart: (cart) => set({ cart }),

    syncCart: async () => {
        try {
            const res = await fetch("http://localhost:8000/panier/my_panier/", {
                credentials: "include",
            });
            const data = await res.json();

            set({ cart: data || null });

            const totalItems =
                data?.lignes?.reduce((sum, item) => sum + item.quantite, 0) ?? 0;

            set({ count: totalItems });
        } catch (err) {
            console.error(err);
        }
    },
    searchTerm: "",
    setSearchTerm: (value) => set({ searchTerm: value }),
}))