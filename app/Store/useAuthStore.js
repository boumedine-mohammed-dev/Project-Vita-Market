'use client'
import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    loading: true,
    message: "",
    error: "",
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
        set({ user: data.user, message: data.message, error: data.error });
    },
    register: async (formData) => {
        const res = await fetch("http://localhost:8000/register/", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        set({ user: data.user, message: data.message, error: data.error });
    },
    logout: async () => {
        await fetch("http://localhost:8000/logout/", {
            method: "POST",
            credentials: "include",
        });
        set({ user: null });
    },
}));
