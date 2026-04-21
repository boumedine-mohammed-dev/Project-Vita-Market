import { Suspense } from "react";
import Navbar from "../components/Navbarclient";
import RoleGuard from "../components/RoleGuard";

export default function RootLayout({ children }) {
    return (

        <RoleGuard allowedRoles={["client"]} requireAuth={false}>
            <Suspense fallback={null}>
                <Navbar />
            </Suspense>
            {children}
        </RoleGuard>

    );
}