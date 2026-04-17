'use client'
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    // get user when refresh
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch("http://localhost:8000/auth/me/", {
                method: "GET",
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data);
                console.log(data);
            } else {
                setUser(null);
            }

        } catch (error) {
            console.error(error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    //  login
    const login = async (formData) => {
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
            setMessage(data?.message);
            setError(data?.error);
            if (res.ok) {
                await checkAuth(); // get user directly
            }

            return data;
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };

    //  register
    const register = async (formData) => {
        const res = await fetch("http://localhost:8000/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        return await res.json();
    };

    //  logout
    const logout = async () => {
        await fetch("http://localhost:8000/logout/", {
            method: "POST",
            credentials: "include",
        });

        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, message, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// hook
export const useAuth = () => useContext(AuthContext);