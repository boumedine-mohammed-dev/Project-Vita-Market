import { create } from "zustand";

export const useClientStore = create((set) => ({
    categories: [],
    products: [],
    fetchCategories: async () => {
        try {
            const res = await fetch("http://localhost:8000/categories/");
            const data = await res.json();
            console.log("oooooooo", data)
            const roots = data.filter((c) => c.categorie_parente === null || c.categorie_parente === undefined);
            set({ categories: roots });
            console.log("oooooooo", roots)
        } catch (err) {
            console.error(err);
        }
    },
    fetchProducts: async () => {
        const res = await fetch("http://localhost:8000/products/all/");
        const data = await res.json();
        set({ products: data });
    },
}));