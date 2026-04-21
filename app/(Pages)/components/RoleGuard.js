"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/Store/useAuthStore";

export default function RoleGuard({ children, allowedRoles, requireAuth = true }) {
    const router = useRouter();
    const { user, loading } = useAuthStore();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            if (requireAuth) {
                router.push("/login");
            } else {
                setAuthorized(true);
            }
        } else if (allowedRoles && !allowedRoles.includes(user.type_user)) {
            if (user.type_user === "client") {
                router.push("/");
            } else if (user.type_user === "vendeur") {
                router.push("/dashboard");
            } else {
                router.push("/");
            }
        } else {
            setAuthorized(true);
        }
    }, [user, allowedRoles, requireAuth, router, loading]);

    if (!authorized) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
                <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
            </div>
        );
    }

    return <>{children}</>;
}
