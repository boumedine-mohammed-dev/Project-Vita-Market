import Navbarvendor from "../components/Navbarvendor";
export default function RootLayout({ children }) {
    return (



        <div className="flex h-screen overflow-hidden">
            <Navbarvendor />
            <div className="flex-1 flex flex-col overflow-y-auto">
                {children}
            </div>
        </div>


    );
}