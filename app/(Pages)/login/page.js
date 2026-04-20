'use client'
import { useAuthStore } from '@/app/Store/useAuthStore'
import Head from 'next/head'
import { useRouter } from 'next/navigation'

import { useState } from 'react'


export default function AuthPage() {
    const [activeTab, setActiveTab] = useState('login')
    const [terms, setTerms] = useState(false)
    const router = useRouter();
    const { login, register, message, error, user } = useAuthStore();
    const [formDataRegister, setFormDataRegister] = useState({
        username: "",
        email: "",
        password: "",
        nom: "",
        prenom: "",
        telephone: "",
        type_user: "client",
    });
    const [formDataLogin, setFormDataLogin] = useState({
        username: "",
        password: "",
        remember_me: false,
    });
    const handleRegister = async (e) => {
        e.preventDefault();
        const data = await register(formDataRegister);
        console.log(data);
        if (!data?.user) {
            console.log("Register failed or no user returned");
            return;
        }

        const type = data.user.type_user;
        setTimeout(() => {
            router.push(type === "vendeur" ? "/dashboard" : "/");
        }, 2000);
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        const data = await login(formDataLogin);
        console.log(data);

        if (!data?.user) {
            console.log("Login failed or no user returned");
            return;
        }

        const type = data.user.type_user;
        setTimeout(() => {
            router.push(type === "vendeur" ? "/dashboard" : "/");
        }, 2000);

    }
    console.log(formDataRegister)
    const textImage = () => {
        if (activeTab === "register") { return (<h1 className="text-white text-3xl font-black leading-tight tracking-tight">Bienvenue</h1>) }
        if (activeTab === "login") { return (<h1 className="text-white text-3xl font-black leading-tight tracking-tight">Bon retour</h1>) }
    }
    const form = () => {
        if (activeTab === "register") {
            return (
                <form className="flex flex-col gap-4 px-2" onSubmit={handleRegister}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Nom d'utilisateur</label>
                        <input
                            className=" p-2 w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="Boumedine Med"
                            type="text"
                            value={formDataRegister.username}
                            onChange={(e) => setFormDataRegister({ ...formDataRegister, username: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Nom</label>
                        <input
                            className=" p-2 w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="Boumedine"
                            type="text"
                            value={formDataRegister.nom}
                            onChange={(e) => setFormDataRegister({ ...formDataRegister, nom: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Prenom</label>
                        <input
                            className=" p-2 w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="Mohammed"
                            type="text"
                            value={formDataRegister.prenom}
                            onChange={(e) => setFormDataRegister({ ...formDataRegister, prenom: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Telephone</label>
                        <input
                            className=" p-2 w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="0658531595"
                            type="text"
                            value={formDataRegister.telephone}
                            onChange={(e) => setFormDataRegister({ ...formDataRegister, telephone: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">L'adresse mail</label>
                        <input
                            className="p-2 w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="mohammed.boumedine@outlook.fr"
                            type="email"
                            value={formDataRegister.email}
                            onChange={(e) => setFormDataRegister({ ...formDataRegister, email: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Mot de passe</label>
                        <input
                            className="p-2 w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="••••••••"
                            type="password"
                            value={formDataRegister.password}
                            onChange={(e) => setFormDataRegister({ ...formDataRegister, password: e.target.value })}
                        />
                    </div>
                    <div className="flex items-start gap-3 mt-2">
                        <input
                            className="mt-1 rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                            id="terms"
                            type="checkbox"
                            onChange={(e) => setTerms(e.target.checked)}
                        />
                        <label className="text-sm text-slate-600 dark:text-slate-400" htmlFor="terms">
                            J’accepte les{' '}
                            <a className="text-[#81e240] font-bold hover:underline" href="#">les Conditions générales d’utilisation</a>
                            {' '}ainsi que{' '}
                            <a className="text-[#81e240] font-bold hover:underline" href="#">la Politique de confidentialité</a>.
                        </label>
                    </div>
                    <button
                        className={` ${terms ? 'cursor-pointer' : 'cursor-not-allowed'} mt-4 w-full bg-[#81e240] hover:bg-[#81e240]/90 text-slate-900 font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-[#81e240]/20`}
                        type="submit"
                        disabled={!terms}
                    >
                        Créer un compte
                    </button>
                    <div className="mt-8 px-2 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Vous avez déjà un compte?{' '}
                            <a className="text-[#81e240] font-bold hover:underline ml-1" href="#">Connectez-vous ici</a>
                        </p>
                    </div>
                </form>

            )
        }
        if (activeTab === "login") {
            return (
                <form className="flex flex-col gap-4 px-2" onSubmit={handleLogin}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Nom d'utilisateur</label>
                        <input
                            className=" p-2 w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="Boumedine Med"
                            type="text"
                            value={formDataLogin.username}
                            onChange={(e) => setFormDataLogin({ ...formDataLogin, username: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Mot de passe</label>
                        <input
                            className="p-2 w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="••••••••"
                            type="password"
                            value={formDataLogin.password}
                            onChange={(e) => setFormDataLogin({ ...formDataLogin, password: e.target.value })}
                        />
                    </div>
                    <div className="flex items-start gap-3 mt-2">
                        <input
                            className="mt-1 rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                            id="terms"
                            type="checkbox"
                            onChange={(e) => setFormDataLogin({ ...formDataLogin, remember_me: e.target.checked })}
                        />

                        <label className="text-sm text-slate-600 dark:text-slate-400" htmlFor="terms">
                            Se souvenir de{' '}
                            <a className="text-[#81e240] font-bold hover:underline" href="#">moi 30 jours</a>
                        </label>
                    </div>
                    {message && <p className="text-primary text-sm text-center">{message}</p>}
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        className={` cursor-pointer mt-4 w-full bg-[#81e240] hover:bg-[#81e240]/90 text-slate-900 font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-[#81e240]/20`}
                        type="submit"

                    >
                        Se connecter
                    </button>
                    <div className="mt-8 px-2 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Vous n'avez pas de compte?{' '}
                            <a className="text-[#81e240] font-bold hover:underline ml-1" href="#">Inscrivez-vous ici</a>
                        </p>
                    </div>
                </form>
            )
        }
    }
    console.log(formDataRegister.type_user)
    return (
        <>
            <Head>
                <title>EcoVibe - Authentication</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[#f7f8f6] dark:bg-[#182111] font-display text-slate-900 dark:text-slate-100">
                <div className="flex h-full grow flex-col">

                    {/* Header */}
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-[#81e240]/10 px-6 md:px-40 py-4 bg-white dark:bg-[#182111]">
                        <div className="flex items-center gap-4 text-slate-900 dark:text-slate-100">
                            <div className="size-8 flex items-center justify-center text-[#81e240]">
                                <span className="material-symbols-outlined text-3xl">eco</span>
                            </div>
                            <h2 className="text-xl font-bold leading-tight tracking-tight">EcoVibe</h2>
                        </div>
                        <button className="flex items-center justify-center rounded-lg h-10 bg-primary/10 text-slate-900 dark:text-slate-100 gap-2 text-sm font-bold px-4 hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-primary">energy_savings_leaf</span>
                            <span className="hidden sm:inline">Sustainability First</span>
                        </button>
                    </header>

                    {/* Main */}
                    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                        <div className="flex flex-col max-w-[480px] w-full bg-white dark:bg-slate-900/50 p-1 md:p-8 rounded-xl shadow-sm border border-[#81e240]/10">

                            {/* Hero Image */}
                            <div className="mb-8">
                                <div
                                    className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-lg min-h-[160px] relative"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuADz-3szeHqvC9d2PONvnWR9MRJWBb6dcMIKcREbaoPuUjPXTCV9FIhpGgncR42ddrKm4BSEWkgycpH540heAqrP_lnzPaGMUTdfYcYI4nMh2t9EG_Pptlqgqicj2TexjKWO3MAz57o_rXjx0Hh8z2sgZUGPju6jvIdWUj7G_IgDzZUi3YRfRIknFFQRdhwCAnS2XNstqYPw9ZO_WwX7ISIJUBzQeDpn1KlL-GGI36Lr5JoeoAX1B5wZDhcomRt9xZ5x9Pm1xRHHAaQ")' }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                    <div className="relative p-6">
                                        {textImage()}
                                        <p className="text-[#81e240] text-sm font-medium">Rejoignez notre communauté durable dès aujourd’hui.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="mb-6">
                                <div className="flex border-b border-slate-200 dark:border-slate-700 px-2 gap-8">
                                    <button
                                        onClick={() => setActiveTab('login')}
                                        className={`cursor-pointer  flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 transition-colors text-sm font-bold tracking-wide ${activeTab === 'login'
                                            ? 'border-[#81e240] text-slate-900 dark:text-slate-100'
                                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-[#81e240]'
                                            }`}
                                    >
                                        Se connecter
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('register')}
                                        className={`cursor-pointer flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 transition-colors text-sm font-bold tracking-wide ${activeTab === 'register'
                                            ? 'border-[#81e240] text-slate-900 dark:text-slate-100'
                                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-[#81e240]'
                                            }`}
                                    >
                                        S’inscrire
                                    </button>
                                </div>
                            </div>

                            {/* Role Toggle */}
                            <div className="flex px-2 py-3 mb-6">
                                <div className="flex h-11 flex-1 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
                                    <button
                                        onClick={() => setFormDataRegister({ ...formDataRegister, type_user: 'client' })}
                                        className={` cursor-pointer flex h-full grow items-center justify-center overflow-hidden rounded-md px-2 text-xs font-bold uppercase tracking-wider transition-all ${formDataRegister.type_user === 'client'
                                            ? 'bg-white dark:bg-slate-700 shadow-sm text-[#81e240]'
                                            : 'text-slate-500 dark:text-slate-400'
                                            }`}
                                    >
                                        Client
                                    </button>
                                    <button
                                        onClick={() => setFormDataRegister({ ...formDataRegister, type_user: 'vendeur' })}
                                        className={`cursor-pointer flex h-full grow items-center justify-center overflow-hidden rounded-md px-2 text-xs font-bold uppercase tracking-wider transition-all ${formDataRegister.type_user === 'vendeur'
                                            ? 'bg-white dark:bg-slate-700 shadow-sm text-[#81e240]'
                                            : 'text-slate-500 dark:text-slate-400'
                                            }`}
                                    >
                                        Vendeur
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            {form()}
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="py-8 px-6 text-center border-t border-[#81e240]/10">
                        <p className="text-xs text-slate-400 dark:text-slate-600 uppercase tracking-widest font-bold">
                            © 2026 Vita Market. Conçu pour une planète plus verte.
                        </p>
                    </footer>

                </div>
            </div>
        </>
    )
}
