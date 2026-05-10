'use client'

import Navbarvendor from "../components/Navbarvendor";
import Navbarvendortop from "../components/Navbarvendortop";
import RoleGuard from "../components/RoleGuard";
import { useAuthStore } from "../../Store/useAuthStore";
import VendorApprovalWait from "../components/VendorApprovalWait";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
    const { user } = useAuthStore();
    const pathname = usePathname();
    const isApproved = user?.info?.statut === "approuve";
    
    // Allow settings even if not approved so they can update their info
    const isSettingsPage = pathname.includes("/settings");
    const canAccess = isApproved || isSettingsPage;

    return (
        <RoleGuard allowedRoles={["vendeur"]}>
            <div className="flex flex-col md:flex-row h-screen overflow-hidden">
                <Navbarvendor />
                <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
                    <Navbarvendortop />
                    {canAccess ? children : <VendorApprovalWait />}
                </div>
            </div>
        </RoleGuard>
    );
}