'use client'
import { useState, createContext, useContext, useCallback } from 'react'

// ─── Context ─────────────────────────────────────────────────────────────────
const AlertDialogContext = createContext()

// ─── Root ────────────────────────────────────────────────────────────────────
export function AlertDialog({ children }) {
    const [open, setOpen] = useState(false)
    return (
        <AlertDialogContext.Provider value={{ open, setOpen }}>
            {children}
        </AlertDialogContext.Provider>
    )
}

// ─── Trigger ─────────────────────────────────────────────────────────────────
export function AlertDialogTrigger({ children, render }) {
    const { setOpen } = useContext(AlertDialogContext)
    if (render) {
        return (
            <span onClick={() => setOpen(true)} className="inline-flex">
                {render}
            </span>
        )
    }
    return (
        <span onClick={() => setOpen(true)} className="inline-flex cursor-pointer">
            {children}
        </span>
    )
}

// ─── Content (Overlay + Panel) ───────────────────────────────────────────────
export function AlertDialogContent({ children }) {
    const { open, setOpen } = useContext(AlertDialogContext)
    if (!open) return null
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
                onClick={() => setOpen(false)}
            />
            {/* Panel */}
            <div className="relative z-10 w-full max-w-md mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-[scaleIn_200ms_ease-out] overflow-hidden">
                {children}
            </div>
        </div>
    )
}

// ─── Header ──────────────────────────────────────────────────────────────────
export function AlertDialogHeader({ children }) {
    return <div className="px-6 pt-6 pb-2">{children}</div>
}

// ─── Title ───────────────────────────────────────────────────────────────────
export function AlertDialogTitle({ children }) {
    return (
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {children}
        </h3>
    )
}

// ─── Description ─────────────────────────────────────────────────────────────
export function AlertDialogDescription({ children }) {
    return (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            {children}
        </p>
    )
}

// ─── Footer ──────────────────────────────────────────────────────────────────
export function AlertDialogFooter({ children }) {
    return (
        <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            {children}
        </div>
    )
}

// ─── Cancel button ───────────────────────────────────────────────────────────
export function AlertDialogCancel({ children, onClick }) {
    const { setOpen } = useContext(AlertDialogContext)
    return (
        <button
            type="button"
            onClick={() => { setOpen(false); onClick?.() }}
            className="cursor-pointer px-4 py-2 rounded-lg text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
            {children}
        </button>
    )
}

// ─── Action button ───────────────────────────────────────────────────────────
export function AlertDialogAction({ children, onClick, variant = 'danger' }) {
    const { setOpen } = useContext(AlertDialogContext)
    const variants = {
        danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20',
        primary: 'bg-[#81e240] hover:bg-[#81e240]/90 text-slate-900 shadow-lg shadow-[#81e240]/20',
        warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20',
    }
    return (
        <button
            type="button"
            onClick={() => { setOpen(false); onClick?.() }}
            className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${variants[variant] || variants.danger}`}
        >
            {children}
        </button>
    )
}

// ─── Imperative hook (optional convenience) ──────────────────────────────────
// Usage:  const { dialog, confirmAction } = useConfirmDialog()
//         confirmAction({ title, description, onConfirm, variant })
//         return <>{dialog}</>
export function useConfirmDialog() {
    const [state, setState] = useState(null)

    const confirmAction = useCallback(({ title, description, confirmText = 'Continuer', cancelText = 'Annuler', variant = 'danger', onConfirm }) => {
        setState({ title, description, confirmText, cancelText, variant, onConfirm })
    }, [])

    const close = useCallback(() => setState(null), [])

    const dialog = state ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={close} />
            <div className="relative z-10 w-full max-w-md mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-[scaleIn_200ms_ease-out]">
                <div className="px-6 pt-6 pb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-500">warning</span>
                        {state.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                        {state.description}
                    </p>
                </div>
                <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <button
                        type="button"
                        onClick={close}
                        className="cursor-pointer px-4 py-2 rounded-lg text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        {state.cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={() => { close(); state.onConfirm?.() }}
                        className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${state.variant === 'primary' ? 'bg-[#81e240] hover:bg-[#81e240]/90 text-slate-900 shadow-lg shadow-[#81e240]/20'
                            : state.variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20'
                                : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                            }`}
                    >
                        {state.confirmText}
                    </button>
                </div>
            </div>
        </div>
    ) : null

    return { dialog, confirmAction }
}
