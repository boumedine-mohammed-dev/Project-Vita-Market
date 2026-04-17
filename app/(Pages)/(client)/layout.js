import { Suspense } from "react";
import Navbar from "../components/Navbarclient";

export default function RootLayout({ children }) {
    return (

        <>
            <Suspense fallback={null}>
                <Navbar />
            </Suspense>
            {children}
        </>

    );
}