import Navbarvendor from "../components/Navbarvendor";
import Navbarvendortop from "../components/Navbarvendortop";
export default function RootLayout({ children }) {
    return (


        <>

            <div className="flex h-screen overflow-hidden">

                <Navbarvendor />
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <Navbarvendortop />
                    {children}
                </div>
            </div>
        </>

    );
}