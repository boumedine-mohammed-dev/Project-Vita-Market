'use client'
import { useAuthStore } from '@/app/Store/useAuthStore'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useState } from 'react'
import Link from 'next/link'


export default function AuthPage() {
    const [activeTab, setActiveTab] = useState('login')
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        clearErrors();
    };
    const [terms, setTerms] = useState(false)
    const router = useRouter();
    const { login, register, message, error, user, clearErrors } = useAuthStore();
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
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8000/forgot-password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: forgotPasswordEmail }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Email envoyé avec succès");
                handleTabChange('login');
                setForgotPasswordEmail("");
            } else {
                toast.error(data.error || "Erreur lors de la demande");
            }
        } catch (error) {
            toast.error("Erreur de connexion au serveur");
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        const data = await register(formDataRegister);
        console.log(data);
        if (!data?.user) {
            console.log("Register failed or no user returned");
            return;
        }

        const type = data.user.type_user;
        const status = data.user.info?.statut;

        setTimeout(() => {
            if (type === "vendeur") {
                router.push(status === "approuve" ? "/dashboard" : "/waiting");
            } else {
                router.push("/");
            }
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
        const status = data.user.info?.statut;

        setTimeout(() => {
            if (type === "vendeur") {
                router.push(status === "approuve" ? "/dashboard" : "/waiting");
            } else {
                router.push("/");
            }
        }, 2000);

    }
    console.log(formDataRegister)
    const textImage = () => {
        if (activeTab === "register") { return (<h1 className="text-white text-3xl font-black leading-tight tracking-tight">Bienvenue</h1>) }
        if (activeTab === "login") { return (<h1 className="text-white text-3xl font-black leading-tight tracking-tight">Bon retour</h1>) }
        if (activeTab === "forgot-password") { return (<h1 className="text-white text-3xl font-black leading-tight tracking-tight">Mot de passe oublié</h1>) }
    }
    const getFieldError = (fieldName) => {
        if (!error || typeof error !== 'object') return null;
        const fieldError = error[fieldName];
        if (!fieldError) return null;
        if (Array.isArray(fieldError)) return fieldError[0];
        return fieldError;
    };

    const form = () => {
        if (activeTab === "register") {
            return (
                <form className="flex flex-col gap-4 px-2" onSubmit={handleRegister}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Nom d'utilisateur</label>
                        <input
                            className={`p-2 w-full rounded-lg border ${getFieldError('username') ? 'border-red-500' : 'border-slate-200'} bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                            placeholder="Boumedine Med"
                            type="text"
                            value={formDataRegister.username}
                            onChange={(e) => setFormDataRegister({ ...formDataRegister, username: e.target.value })}
                            required
                        />
                        {getFieldError('username') && <p className="text-[11px] text-red-500 font-bold ml-1">{getFieldError('username')}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Nom</label>
                        <input
                            className={`p-2 w-full rounded-lg border ${getFieldError('nom') ? 'border-red-500' : 'border-slate-200'} bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                            placeholder="Boumedine"
                            type="text"
                            value={formDataRegister.nom}
                            onChange={(e) => setFormDataRegister({ ...formDataRegister, nom: e.target.value })}
                            required
                        />
                        {getFieldError('nom') && <p className="text-[11px] text-red-500 font-bold ml-1">{getFieldError('nom')}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Prenom</label>
                        <input
                            className={`p-2 w-full rounded-lg border ${getFieldError('prenom') ? 'border-red-500' : 'border-slate-200'} bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                            placeholder="Mohammed"
                            type="text"
                            value={formDataRegister.prenom}
                            onChange={(e) => setFormDataRegister({ ...formDataRegister, prenom: e.target.value })}
                            required
                        />
                        {getFieldError('prenom') && <p className="text-[11px] text-red-500 font-bold ml-1">{getFieldError('prenom')}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Telephone</label>
                        <input
                            className={`p-2 w-full rounded-lg border ${getFieldError('telephone') ? 'border-red-500' : 'border-slate-200'} bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                            placeholder="0658531595"
                            type="tel"
                            required
                            maxLength={10}
                            value={formDataRegister.telephone}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                setFormDataRegister({ ...formDataRegister, telephone: value });
                            }}
                        />
                        {getFieldError('telephone') && <p className="text-[11px] text-red-500 font-bold ml-1">{getFieldError('telephone')}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">L'adresse mail</label>
                        <input
                            className={`p-2 w-full rounded-lg border ${getFieldError('email') ? 'border-red-500' : 'border-slate-200'} bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                            placeholder="mohammed.boumedine@outlook.fr"
                            type="email"
                            required
                            value={formDataRegister.email}
                            onChange={(e) => setFormDataRegister({ ...formDataRegister, email: e.target.value })}
                        />
                        {getFieldError('email') && <p className="text-[11px] text-red-500 font-bold ml-1">{getFieldError('email')}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Mot de passe</label>
                        <input
                            className={`p-2 w-full rounded-lg border ${getFieldError('password') ? 'border-red-500' : 'border-slate-200'} bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                            placeholder="••••••••"
                            type="password"
                            value={formDataRegister.password}
                            onChange={(e) => setFormDataRegister({ ...formDataRegister, password: e.target.value })}
                            required
                        />
                        {getFieldError('password') && <p className="text-[11px] text-red-500 font-bold ml-1">{getFieldError('password')}</p>}
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
                            <Link className="text-[#81e240] font-bold hover:underline" href="/cgu">les Conditions générales d’utilisation</Link>
                            {' '}ainsi que{' '}
                            <Link className="text-[#81e240] font-bold hover:underline" href="/cgu">la Politique de confidentialité</Link>.
                        </label>
                    </div>
                    {error && typeof error === 'object' && (
                        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 p-3 rounded-lg flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-rose-500 text-sm">error</span>
                            <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">Veuillez corriger les erreurs ci-dessous.</p>
                        </div>
                    )}
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
                            <button className="text-[#81e240] font-bold hover:underline ml-1 cursor-pointer" onClick={() => handleTabChange('login')}>Connectez-vous ici</button>
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
                            className={`p-2 w-full rounded-lg border ${getFieldError('username') ? 'border-red-500' : 'border-slate-200'} bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                            placeholder="Boumedine Med"
                            type="text"
                            required
                            value={formDataLogin.username}
                            onChange={(e) => setFormDataLogin({ ...formDataLogin, username: e.target.value })}
                        />
                        {getFieldError('username') && <p className="text-[11px] text-red-500 font-bold ml-1">{getFieldError('username')}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Mot de passe</label>
                        <input
                            className={`p-2 w-full rounded-lg border ${getFieldError('password') ? 'border-red-500' : 'border-slate-200'} bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                            placeholder="••••••••"
                            type="password"
                            required
                            value={formDataLogin.password}
                            onChange={(e) => setFormDataLogin({ ...formDataLogin, password: e.target.value })}
                        />
                        {getFieldError('password') && <p className="text-[11px] text-red-500 font-bold ml-1">{getFieldError('password')}</p>}
                    </div>
                    <div className="flex items-start justify-between gap-3 mt-2">
                        <div className="flex items-center gap-2">
                            <input
                                className="mt-1 rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                                id="terms"
                                type="checkbox"
                                onChange={(e) => setFormDataLogin({ ...formDataLogin, remember_me: e.target.checked })}
                            />

                            <label className="text-sm text-slate-600 dark:text-slate-400" htmlFor="terms">
                                Se souvenir de moi 30 jours
                            </label>
                        </div>
                        <button type="button" onClick={() => handleTabChange('forgot-password')} className="text-sm text-[#81e240] font-bold hover:underline cursor-pointer">
                            Mot de passe oublié ?
                        </button>
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
                            <button className="text-[#81e240] font-bold hover:underline ml-1 cursor-pointer" onClick={() => handleTabChange('register')}>Inscrivez-vous ici</button>
                        </p>
                    </div>
                </form>
            )
        }
        if (activeTab === "forgot-password") {
            return (
                <form className="flex flex-col gap-4 px-2" onSubmit={handleForgotPassword}>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        Entrez votre adresse email ci-dessous et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                    </p>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">L'adresse mail</label>
                        <input
                            className="p-2 w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="mohammed.boumedine@outlook.fr"
                            type="email"
                            required
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        />
                    </div>

                    <button
                        className={` cursor-pointer mt-4 w-full bg-[#81e240] hover:bg-[#81e240]/90 text-slate-900 font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-[#81e240]/20`}
                        type="submit"
                    >
                        Réinitialiser
                    </button>
                    <div className="mt-8 px-2 text-center">
                        <button type="button" className="text-sm text-[#81e240] font-bold hover:underline cursor-pointer" onClick={() => handleTabChange('login')}>
                            ← Retour à la connexion
                        </button>
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
                            <h2 onClick={() => router.push("/")} className="cursor-pointer text-xl font-bold leading-tight tracking-tight">Vita Market</h2>
                        </div>
                        <button className="flex items-center justify-center rounded-lg h-10 bg-primary/10 text-slate-900 dark:text-slate-100 gap-2 text-sm font-bold px-4 hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-primary">energy_savings_leaf</span>
                            <span className="hidden sm:inline">Bien manger, c'est facile</span>
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
                                        onClick={() => handleTabChange('login')}
                                        className={`cursor-pointer  flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 transition-colors text-sm font-bold tracking-wide ${activeTab === 'login'
                                            ? 'border-[#81e240] text-slate-900 dark:text-slate-100'
                                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-[#81e240]'
                                            }`}
                                    >
                                        Se connecter
                                    </button>
                                    <button
                                        onClick={() => handleTabChange('register')}
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
                            {activeTab === 'register' && (
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
                            )}


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
