import Navbarvendor from "../components/Navbarvendor";
import Navbarvendortop from "../components/Navbarvendortop";
import RoleGuard from "../components/RoleGuard";

export default function RootLayout({ children }) {
    return (


        <RoleGuard allowedRoles={["vendeur"]}>
            <div className="flex flex-col md:flex-row h-screen overflow-hidden">

                <Navbarvendor />
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <Navbarvendortop />
                    {children}
                </div>
            </div>
        </RoleGuard>

    );
}