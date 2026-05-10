'use client'

import React from 'react'

export default function VendorApprovalWait() {
    return (
        <div className="font-display flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 min-h-[60vh]">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <span className="material-symbols-outlined text-4xl text-amber-600 dark:text-amber-400">
                    pending_actions
                </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                Compte en attente d'approbation
            </h1>

            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
                Votre boutique est actuellement en cours de vérification par notre équipe.
                Vous recevrez un e-mail dès que votre compte sera activé pour commencer à vendre.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <span className="material-symbols-outlined text-primary mb-2">verified_user</span>
                    <h3 className="text-sm font-bold mb-1">Vérification</h3>
                    <p className="text-xs text-slate-400">Validation de vos informations professionnelles.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <span className="material-symbols-outlined text-primary mb-2">inventory_2</span>
                    <h3 className="text-sm font-bold mb-1">Catalogue</h3>
                    <p className="text-xs text-slate-400">Préparez vos produits en attendant l'activation.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <span className="material-symbols-outlined text-primary mb-2">support_agent</span>
                    <h3 className="text-sm font-bold mb-1">Support</h3>
                    <p className="text-xs text-slate-400">Notre équipe est là si vous avez des questions.</p>
                </div>
            </div>

            <button
                onClick={() => window.location.reload()}
                className="mt-10 px-8 py-3 bg-primary text-slate-900 rounded-xl font-bold text-sm hover:brightness-105 transition-all flex items-center gap-2"
            >
                <span className="material-symbols-outlined text-lg">refresh</span>
                Actualiser le statut
            </button>
        </div>
    )
}
