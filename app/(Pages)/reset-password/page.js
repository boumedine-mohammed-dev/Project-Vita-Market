'use client'

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FaLock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const getFieldError = (fieldName) => {
        const err = errors[fieldName];
        if (!err) return null;
        return Array.isArray(err) ? err[0] : err;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!password || !confirmPassword) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        if (password !== confirmPassword) {
            setErrors({ confirmPassword: "Les mots de passe ne correspondent pas" });
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/reset-password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    password: password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Mot de passe mis à jour avec succès !");
                setIsSuccess(true);
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setErrors(typeof data === 'object' ? data : { global: data.error || "Une erreur est survenue" });
                toast.error(data.error || "Une erreur est survenue");
            }
        } catch (error) {
            console.error("Erreur lors de la réinitialisation:", error);
            toast.error("Erreur de connexion au serveur");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
                <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl">
                    <div className="text-red-500 text-5xl mb-4 flex justify-center">⚠️</div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Lien invalide</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">Ce lien de réinitialisation est invalide ou a expiré.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                    >
                        <FaArrowLeft /> Retour à la connexion
                    </button>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
                <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-primary/20">
                    <div className="text-primary text-6xl mb-4 flex justify-center animate-bounce">
                        <FaCheckCircle />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Succès !</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Votre mot de passe a été réinitialisé. Vous allez être redirigé vers la page de connexion...
                    </p>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full animate-progress-bar"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 font-display">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                        Vita<span className="text-primary">Market</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Définissez votre nouveau mot de passe</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-2">
                                <FaLock className="text-primary" /> Nouveau mot de passe
                            </label>
                            <input
                                className={`p-3 w-full rounded-xl border ${getFieldError('password') ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 transition-all`}
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {getFieldError('password') && <p className="text-[11px] text-red-500 font-bold ml-1">{getFieldError('password')}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-2">
                                <FaCheckCircle className="text-primary text-xs" /> Confirmer le mot de passe
                            </label>
                            <input
                                className={`p-3 w-full rounded-xl border ${getFieldError('confirmPassword') ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 transition-all`}
                                placeholder="••••••••"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {getFieldError('confirmPassword') && <p className="text-[11px] text-red-500 font-bold ml-1">{getFieldError('confirmPassword')}</p>}
                        </div>

                        {errors.global && (
                            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-xl flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-500 text-sm">error</span>
                                <p className="text-xs text-red-600 dark:text-red-400 font-bold">{errors.global}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-primary hover:bg-primary/90 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                            ) : "Mettre à jour le mot de passe"}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push('/login')}
                            className="w-full text-center text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors mt-4"
                        >
                            Annuler et revenir à la connexion
                        </button>
                    </form>
                </div>
            </div>

            <style jsx>{`
                @keyframes progress-bar {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                .animate-progress-bar {
                    animation: progress-bar 3s linear forwards;
                }
            `}</style>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-display">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
