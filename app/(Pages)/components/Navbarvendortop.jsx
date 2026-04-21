'use client'
import { useState, useEffect, useRef } from 'react'

const NOTIF_CONFIG = {
    nouvelle_commande: { icon: 'shopping_bag', color: 'bg-primary/10 text-primary', label: 'Nouvelle commande' },
    commande_annulee: { icon: 'cancel', color: 'bg-red-100 text-red-500', label: 'Commande annulée' },
    commande_livree: { icon: 'check_circle', color: 'bg-emerald-100 text-emerald-600', label: 'Commande livrée' },
    paiement_recu: { icon: 'payments', color: 'bg-blue-100 text-blue-600', label: 'Paiement reçu' },
    nouveau_avis: { icon: 'rate_review', color: 'bg-amber-100 text-amber-600', label: 'Nouvel avis' },
    stock_faible: { icon: 'inventory_2', color: 'bg-orange-100 text-orange-600', label: 'Stock faible' },
}
const getNotifCfg = (type) => NOTIF_CONFIG[type] ?? { icon: 'notifications', color: 'bg-slate-100 text-slate-500', label: type }

function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
    if (diff < 60) return "À l'instant"
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`
    return `Il y a ${Math.floor(diff / 86400)} j`
}

export default function NavbarVendorTop() {
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1)

    const [notifOpen, setNotifOpen] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [loadingNotifs, setLoadingNotifs] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [deletingId, setDeletingId] = useState(null)
    const [clearingAll, setClearingAll] = useState(false)
    const panelRef = useRef(null)
    const btnRef = useRef(null)

    useEffect(() => {
        const handler = (e) => {
            if (
                panelRef.current && !panelRef.current.contains(e.target) &&
                btnRef.current && !btnRef.current.contains(e.target)
            ) setNotifOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const load = async () => {
        setLoadingNotifs(true)
        try {
            const res = await fetch('http://localhost:8000/notifications/', { credentials: 'include' })
            if (res.ok) {
                const data = await res.json()
                const list = Array.isArray(data) ? data : data.results ?? []
                setNotifications(list)
                setUnreadCount(list.filter((n) => !n.lu).length)
            }
        } catch (e) { console.error(e) }
        finally { setLoadingNotifs(false) }
    }

    useEffect(() => { load() }, [])

    const markAllRead = async () => {
        try {
            await fetch('http://localhost:8000/notifications/mark_all_read/', { method: 'POST', credentials: 'include' })
            setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })))
            setUnreadCount(0)
        } catch (e) { console.error(e) }
    }

    const markOneRead = async (id) => {
        try {
            await fetch(`http://localhost:8000/notifications/${id}/mark_read/`, { method: 'PATCH', credentials: 'include' })
            setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, lu: true } : n))
            setUnreadCount((prev) => Math.max(0, prev - 1))
        } catch (e) { console.error(e) }
    }

    // ── Delete one ──────────────────────────────────────────────────────────
    const deleteOne = async (e, notif) => {
        e.stopPropagation() // don't trigger markOneRead
        setDeletingId(notif.id)
        try {
            await fetch(`http://localhost:8000/notifications/${notif.id}/`, {
                method: 'DELETE', credentials: 'include',
            })
            setNotifications((prev) => prev.filter((n) => n.id !== notif.id))
            if (!notif.lu) setUnreadCount((prev) => Math.max(0, prev - 1))
        } catch (e) { console.error(e) }
        finally { setDeletingId(null) }
    }

    // ── Delete all ──────────────────────────────────────────────────────────
    const deleteAll = async () => {
        setClearingAll(true)
        try {
            await fetch('http://localhost:8000/notifications/delete_all/', {
                method: 'DELETE', credentials: 'include',
            })
            setNotifications([])
            setUnreadCount(0)
        } catch (e) { console.error(e) }
        finally { setClearingAll(false) }
    }

    return (
        <header className="h-16 py-3 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark sticky top-0 z-30 font-display">

            {/* Search */}
            <div className="flex items-center gap-4 w-80" />


            {/* Right side */}
            <div className="flex items-center gap-3">

                {/* Today's date */}
                <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-primary text-base">calendar_today</span>
                    {todayCapitalized}
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

                {/* Chat */}
                <button className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined">chat_bubble</span>
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button
                        ref={btnRef}
                        onClick={() => setNotifOpen((p) => !p)}
                        className={`p-2 rounded-lg transition-colors relative flex items-center justify-center
                            ${notifOpen ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <span className="material-symbols-outlined"
                            style={{ fontVariationSettings: notifOpen ? "'FILL' 1" : "'FILL' 0" }}>
                            notifications
                        </span>
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-background-dark leading-none">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {notifOpen && (
                        <div
                            ref={panelRef}
                            className="absolute right-0 top-12 w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50"
                        >
                            {/* Panel header */}
                            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <p className="text-xs text-slate-400 mt-0.5">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    {unreadCount > 0 && (
                                        <button onClick={markAllRead} className="text-xs font-semibold text-primary hover:underline">
                                            Tout marquer lu
                                        </button>
                                    )}
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={deleteAll}
                                            disabled={clearingAll}
                                            className="text-xs font-semibold text-red-500 hover:underline disabled:opacity-50 flex items-center gap-1"
                                        >
                                            {clearingAll
                                                ? <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span>
                                                : <span className="material-symbols-outlined text-xs">delete_sweep</span>
                                            }
                                            Tout effacer
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Notification list */}
                            <div className="max-h-[420px] overflow-y-auto">
                                {loadingNotifs ? (
                                    <div className="flex items-center justify-center py-12 gap-3 text-slate-400">
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                        <span className="text-sm">Chargement...</span>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                                        <span className="material-symbols-outlined text-4xl">notifications_off</span>
                                        <p className="text-sm font-medium">Aucune notification</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {notifications.map((notif) => {
                                            const cfg = getNotifCfg(notif.type)
                                            const isDeleting = deletingId === notif.id
                                            return (
                                                <div
                                                    key={notif.id}
                                                    className={`group relative flex items-start gap-3 px-5 py-4 transition-colors
                                                        ${!notif.lu ? 'bg-primary/[0.03]' : ''}
                                                        hover:bg-slate-50 dark:hover:bg-slate-800/50`}
                                                >
                                                    {/* Clickable area (mark read) */}
                                                    <button
                                                        onClick={() => !notif.lu && markOneRead(notif.id)}
                                                        className="flex items-start gap-3 flex-1 text-left min-w-0"
                                                    >
                                                        {/* Icon */}
                                                        <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.color}`}>
                                                            <span className="material-symbols-outlined text-sm"
                                                                style={{ fontVariationSettings: "'FILL' 1" }}>
                                                                {cfg.icon}
                                                            </span>
                                                        </div>

                                                        {/* Text */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <p className={`text-sm leading-snug ${!notif.lu ? 'font-semibold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                                                                    {notif.message ?? cfg.label}
                                                                </p>
                                                                {!notif.lu && (
                                                                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-slate-400 mt-0.5">
                                                                {notif.created_at ? timeAgo(notif.created_at) : ''}
                                                            </p>
                                                        </div>
                                                    </button>

                                                    {/* Delete button — visible on hover */}
                                                    <button
                                                        onClick={(e) => deleteOne(e, notif)}
                                                        disabled={isDeleting}
                                                        title="Supprimer"
                                                        className={`shrink-0 size-7 rounded-lg flex items-center justify-center transition-all
                                                            opacity-0 group-hover:opacity-100
                                                            hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500
                                                            disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    >
                                                        {isDeleting
                                                            ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                                            : <span className="material-symbols-outlined text-sm">delete_outline</span>
                                                        }
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 text-center">
                                    <a href="/dashboard/notifications" className="text-xs font-semibold text-primary hover:underline">
                                        Voir toutes les notifications
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}