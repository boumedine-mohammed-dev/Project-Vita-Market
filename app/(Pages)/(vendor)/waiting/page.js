'use client'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/app/Store/useAuthStore'
import { useEffect } from 'react'

export default function WaitingPage() {
    const { user, logout } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push('/login')
        } else if (user.type_user === 'vendeur' && user.info?.statut === 'approuve') {
            router.push('/dashboard')
        } else if (user.type_user === 'client') {
            router.push('/')
        }
    }, [user, router])

    return (
        <div className="min-h-screen bg-[#f7f8f6] dark:bg-[#182111] flex items-center justify-center p-4 font-display">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6">
                <div className="size-24 bg-[#81e240]/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <span className="material-symbols-outlined text-5xl text-[#81e240]">hourglass_empty</span>
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Compte en attente d'approbation</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Votre demande d'inscription en tant que vendeur est en cours de révision par notre équipe.
                    </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-2xl p-4 text-left flex gap-3">
                    <span className="material-symbols-outlined text-amber-500 shrink-0">info</span>
                    <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                        Cette étape peut prendre jusqu'à 24-48 heures. Vous recevrez un email dès que votre boutique sera activée.
                    </p>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-[#81e240] text-slate-900 rounded-xl font-bold shadow-lg shadow-[#81e240]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-xl">refresh</span>
                        Vérifier le statut
                    </button>
                    <button 
                        onClick={() => logout()}
                        className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-xl">logout</span>
                        Se déconnecter
                    </button>
                </div>

                <p className="text-xs text-slate-400">
                    Besoin d'aide ? Contactez notre support à support@vitamarket.com
                </p>
            </div>
        </div>
    )
}
