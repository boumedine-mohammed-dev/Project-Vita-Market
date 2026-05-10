'use client'

import { create } from "zustand";
import { toast } from "react-toastify";
export const useAuthStore = create((set) => ({
    user: null,
    loading: true,
    message: "",
    error: "",
    setUser: (user) => set({ user }),
    clearErrors: () => set({ message: "", error: "" }),
    checkAuth: async () => {
        try {
            const res = await fetch("http://localhost:8000/auth/me/", {
                method: "GET",
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                set({ user: data });
            } else {
                set({ user: null });
            }

        } catch (error) {
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },
    login: async (formData) => {
        try {
            const res = await fetch("http://localhost:8000/login/", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);

            if (res.ok && data.user) {
                toast.success(data.message || "Connexion réussie");
                set({ user: data.user, message: data.message, error: "" });
            } else {
                const errorData = data.error || data;
                if (typeof errorData !== 'object') {
                    toast.error(errorData || "Erreur de connexion");
                }
                set({ user: null, error: errorData });
            }
            return data;
        } catch (error) {
            toast.error("Erreur de connexion au serveur");
            set({ error: error.message });
        }
    },
    register: async (formData) => {
        try {
            const res = await fetch("http://localhost:8000/register/", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);

            if (res.ok && data.user) {
                toast.success(data.message || "Inscription réussie");
                set({ user: data.user, message: data.message, error: "" });
            } else {
                const errorData = data.error || data;
                if (typeof errorData !== 'object') {
                    toast.error(errorData || "Erreur d'inscription");
                }
                set({ error: errorData });
            }
            return data;
        } catch (error) {
            toast.error("Erreur de connexion au serveur");
            set({ error: error.message });
        }
    },
    logout: async () => {
        try {
            await fetch("http://localhost:8000/auth/me/logout/", {
                method: "POST",
                credentials: "include",
            });
            toast.success("Déconnexion réussie");
            set({ user: null });
        } catch (error) {
            toast.error("Erreur de déconnexion");
        }
    },
}));
