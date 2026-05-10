"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useConfirmDialog } from '../../components/AlertDialog'
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement,
    LineElement, Title, Tooltip, Legend, Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig = {
    en_attente: { label: 'En attente', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-400' },
    confirmee: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-400' },
    en_preparation: { label: 'En préparation', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', dot: 'bg-purple-400' },
    expediee: { label: 'Expédiée', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400', dot: 'bg-indigo-400' },
    livree: { label: 'Livrée', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-400' },
    collectee: { label: 'Collectée', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-400' },
    annulee: { label: 'Annulée', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-400' },
}
const getStatusCfg = (s) => statusConfig[s] ?? { label: s, color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' }

const NEXT_STATUS = {
    en_attente: 'confirmee', confirmee: 'en_preparation',
    en_preparation: 'expediee', expediee: 'livree',
    livree: 'collectee',
}

const TERMINAL_STATUTS = ['annulee', 'livree', 'collectee']
const isTerminalOrder = (order) => TERMINAL_STATUTS.includes(order.lignes?.[0]?.statut ?? order.statut)

const patchLignes = (lignes, newStatus) =>
    Promise.all(lignes.map((l) =>
        fetch(`http://localhost:8000/lignes/${l.id}/`, {
            method: 'PATCH', credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statut: newStatus }),
        })
    ))

const fmt = (n) => parseFloat(n ?? 0).toLocaleString('fr-DZ')

// ─── Helpers ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    ['#dcfce7', '#16a34a'], ['#dbeafe', '#2563eb'], ['#fce7f3', '#db2777'],
    ['#fef3c7', '#d97706'], ['#ede9fe', '#7c3aed'], ['#ffedd5', '#ea580c'],
    ['#f0fdf4', '#15803d'], ['#f0f9ff', '#0284c7'],
]
function MiniAvatar({ name = '', size = 7 }) {
    const letter = (name?.[0] ?? '?').toUpperCase()
    const idx = letter.charCodeAt(0) % AVATAR_COLORS.length
    const [bg, text] = AVATAR_COLORS[idx]
    return (
        <div className={`w-${size} h-${size} rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0`}
            style={{ background: bg, color: text }}>
            {letter}
        </div>
    )
}

function StatusBadge({ statut }) {
    const cfg = getStatusCfg(statut)
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    )
}

// ─── Order menu (status + cancel lock + soft-delete) ─────────────────────────
function OrderMenu({ order, onUpdated, onDeleted, onClose }) {
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const { dialog, confirmAction } = useConfirmDialog()
    const statuses = Object.keys(statusConfig)
    const currentStatut = order.lignes?.[0]?.statut ?? order.statut
    const isCancelled = currentStatut === 'annulee'
    const canDelete = isTerminalOrder(order)

    const handleChange = async (newStatus) => {
        if (newStatus === currentStatut) { onClose(); return }

        if (newStatus === 'annulee') {
            confirmAction({
                title: 'Annuler la commande',
                description: 'Êtes-vous sûr de vouloir annuler cette commande ? Le stock sera restauré et cette action est irréversible.',
                confirmText: 'Oui, annuler',
                cancelText: 'Non',
                variant: 'danger',
                onConfirm: async () => {
                    setLoading(true)
                    try {
                        await patchLignes(order.lignes, newStatus)
                        onUpdated(order.id, newStatus); onClose()
                    } catch (e) { console.error(e) }
                    finally { setLoading(false) }
                }
            })
            return
        }

        setLoading(true)
        try {
            await patchLignes(order.lignes, newStatus)
            onUpdated(order.id, newStatus); onClose()
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const handleDelete = () => {
        confirmAction({
            title: 'Masquer la commande',
            description: 'Masquer cette commande de votre tableau de bord ?',
            confirmText: 'Masquer',
            cancelText: 'Annuler',
            variant: 'warning',
            onConfirm: async () => {
                setDeleting(true)
                try {
                    const res = await fetch(`http://localhost:8000/commandes/${order.id}/delete_for_vendor/`, {
                        method: 'PATCH', credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                    })
                    if (!res.ok) {
                        const data = await res.json()
                        toast.error(data.error ?? 'Erreur')
                        return
                    }
                    onDeleted(order.id); onClose()
                } catch (e) { console.error(e) }
                finally { setDeleting(false) }
            }
        })
    }

    return (
        <>
            <div className="absolute right-0 top-8 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl w-56 overflow-hidden">
                {isCancelled ? (
                    /* ── Locked: already cancelled ── */
                    <div className="p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-red-500">
                            <span className="material-symbols-outlined text-base">block</span>
                            <p className="text-xs font-bold">Commande annulée</p>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                            Le statut d&apos;une commande annulée ne peut plus être modifié.
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="px-4 pt-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {loading ? 'Mise à jour…' : 'Changer le statut'}
                        </p>
                        <div className="p-1">
                            {statuses.map((s) => {
                                const isCurrent = s === currentStatut
                                return (
                                    <button key={s} onClick={() => handleChange(s)} disabled={loading || isCurrent}
                                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50
                                        ${isCurrent ? 'bg-slate-50 dark:bg-slate-800 cursor-default' : 'hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'}`}>
                                        <StatusBadge statut={s} />
                                        {isCurrent && <span className="material-symbols-outlined text-primary text-sm">check</span>}
                                    </button>
                                )
                            })}
                        </div>
                    </>
                )}
                {canDelete && (
                    <>
                        <div className="mx-3 my-1 border-t border-slate-100 dark:border-slate-800" />
                        <div className="p-1 pb-2">
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-base">delete_outline</span>
                                {deleting ? 'Suppression…' : 'Masquer la commande'}
                            </button>
                        </div>
                    </>
                )}
            </div>
            {dialog}
        </>
    )
}


// ─── Order Detail Modal ───────────────────────────────────────────────────────
function OrderModal({ order, onClose, onStatusUpdated }) {
    const modalRef = useRef(null)
    const [advancing, setAdvancing] = useState(false)
    const currentStatut = order.lignes?.[0]?.statut ?? order.statut
    const nextStatus = NEXT_STATUS[currentStatut]

    // Close on Escape
    useEffect(() => {
        const h = (e) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', h)
        return () => document.removeEventListener('keydown', h)
    }, [onClose])

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    const handleAdvance = async () => {
        if (!nextStatus) return
        setAdvancing(true)
        try {
            await patchLignes(order.lignes, nextStatus)
            onStatusUpdated(order.id, nextStatus)
        } catch (e) { console.error(e) }
        finally { setAdvancing(false) }
    }

    const STEPS = [
        { key: 'en_attente', label: 'En attente' },
        { key: 'confirmee', label: 'Confirmée' },
        { key: 'en_preparation', label: 'En prép.' },
        { key: 'expediee', label: 'Expédiée' },
        { key: 'livree', label: 'Livrée' },
        { key: 'collectee', label: 'Collectée' },
    ]
    const stepMap = { en_attente: 0, confirmee: 1, en_preparation: 2, expediee: 3, livree: 4, collectee: 5 }
    const currentStep = stepMap[currentStatut] ?? 0
    const isCancelled = currentStatut === 'annulee'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-xl flex items-center justify-center ${getStatusCfg(currentStatut).color}`}>
                            <span className="material-symbols-outlined text-lg"
                                style={{ fontVariationSettings: "'FILL' 1" }}>
                                {currentStatut === 'annulee' ? 'cancel' :
                                    currentStatut === 'livree' || currentStatut === 'collectee' ? 'check_circle' :
                                        'shopping_bag'}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                Commande #{order.numero_commande}
                            </h2>
                            <p className="text-xs text-slate-400">
                                {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge statut={currentStatut} />
                        <button onClick={onClose}
                            className="size-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6">

                    {/* Progress bar */}
                    {!isCancelled ? (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Progression</p>
                            <div className="relative flex items-center justify-between mb-3">
                                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500"
                                    style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} />
                                {STEPS.map((step, i) => (
                                    <div key={step.key} className={`relative z-10 size-4 rounded-full shrink-0 transition-all
                                        ${i <= currentStep ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}
                                        ${i === currentStep ? 'ring-4 ring-primary/20' : ''}`} />
                                ))}
                            </div>
                            <div className="flex justify-between">
                                {STEPS.map((step, i) => (
                                    <span key={step.key} className={`text-[9px] font-bold uppercase tracking-wide flex-1 transition-colors
                                        ${i === currentStep ? 'text-primary' : i < currentStep ? 'text-slate-400' : 'text-slate-300 dark:text-slate-600'}
                                        ${i === 0 ? 'text-left' : i === STEPS.length - 1 ? 'text-right' : 'text-center'}`}>
                                        {step.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900">
                            <span className="material-symbols-outlined text-red-500">info</span>
                            <p className="text-sm font-medium text-red-600 dark:text-red-400">Cette commande a été annulée.</p>
                        </div>
                    )}

                    {/* Two columns: customer + address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Customer info */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Client</p>
                            <div className="flex items-center gap-3 mb-3">
                                <MiniAvatar name={order.nom} size={10} />
                                <div>
                                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{order.nom ?? '—'}</p>
                                    {order.email && <p className="text-xs text-slate-500">{order.email}</p>}
                                    {order.telephone && <p className="text-xs text-slate-500">{order.telephone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Delivery address */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Adresse de livraison</p>
                            {order.adresse_livraison ? (
                                <div className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">location_on</span>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{order.adresse_livraison}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">Non renseignée</p>
                            )}
                        </div>
                    </div>

                    {/* Articles */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                            Articles ({order.lignes?.length ?? 0})
                        </p>
                        <div className="space-y-2">
                            {order.lignes?.map((ligne) => (
                                <div key={ligne.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <div className="size-14 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                                        <img src={ligne.produit_url} alt={ligne.produit_nom}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/56?text=?' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{ligne.produit_nom}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Vendeur : {ligne.produit_vendeur}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-500">Qté : {ligne.quantite}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-xs text-slate-500">{fmt(ligne.prix_unitaire)} دج / unité</span>
                                            {ligne.statut && <StatusBadge statut={ligne.statut} />}
                                        </div>
                                    </div>
                                    <p className="text-sm font-black text-slate-900 dark:text-slate-100 shrink-0">
                                        {fmt(parseFloat(ligne.prix_unitaire) * ligne.quantite)} دج
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            <div className="px-5 py-3 flex justify-between text-sm">
                                <span className="text-slate-500">Livraison</span>
                                <span className="font-medium">
                                    {fmt(order.frais_livraison)} دج
                                </span>
                            </div>
                            <div className="px-5 py-4 flex justify-between font-bold text-base">
                                <span>Total</span>
                                <span className="text-primary">{fmt(order.total)} دج</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer actions */}
                {nextStatus && (
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 flex gap-3">
                        <button onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            Fermer
                        </button>
                        <button onClick={handleAdvance} disabled={advancing}
                            className="flex-1 py-2.5 rounded-xl bg-primary hover:brightness-105 disabled:opacity-60 text-slate-900 text-sm font-bold transition-all flex items-center justify-center gap-2">
                            {advancing
                                ? <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                : <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            }
                            Passer à : {getStatusCfg(nextStatus).label}
                        </button>
                    </div>
                )}
                {!nextStatus && (
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                        <button onClick={onClose}
                            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            Fermer
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function VendorDashboardPage() {
    const [stats, setStats] = useState(null)
    const [chartData, setChartData] = useState([])
    const [recentOrders, setRecentOrders] = useState([])
    const [period, setPeriod] = useState("30")
    const [loading, setLoading] = useState(true)
    const [loadingOrders, setLoadingOrders] = useState(true)
    const [openMenuId, setOpenMenuId] = useState(null)
    const [selectedOrder, setSelectedOrder] = useState(null)

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true)
            try {
                const [resStats, resChart] = await Promise.all([
                    fetch("http://localhost:8000/dashboard/stats/", { credentials: "include" }),
                    fetch(`http://localhost:8000/dashboard/chart/?period=${period}`, { credentials: "include" }),
                ])
                if (resStats.ok) setStats(await resStats.json())
                if (resChart.ok) setChartData(await resChart.json())
            } catch (err) { console.error(err) }
            finally { setLoading(false) }
        }
        fetchDashboard()
    }, [period])

    useEffect(() => {
        const fetchOrders = async (isBackground = false) => {
            if (!isBackground) setLoadingOrders(true);
            try {
                const res = await fetch("http://localhost:8000/commandes/vendeur/?limit=10", { credentials: "include" })
                if (res.ok) {
                    const data = await res.json()
                    setRecentOrders(Array.isArray(data) ? data : data.results ?? [])
                }
            } catch (err) { console.error(err) }
            finally { if (!isBackground) setLoadingOrders(false); }
        }
        fetchOrders()
        const intervalId = setInterval(() => fetchOrders(true), 5000);
        return () => clearInterval(intervalId);
    }, [])

    useEffect(() => {
        const h = () => setOpenMenuId(null)
        window.addEventListener('click', h)
        return () => window.removeEventListener('click', h)
    }, [])

    const handleStatusUpdated = (id, newStatus) => {
        const patch = (o) => o.id !== id ? o : {
            ...o,
            statut: newStatus,
            lignes: o.lignes.map((l) => ({ ...l, statut: newStatus })),
        }
        setRecentOrders((prev) => prev.map(patch))
        setSelectedOrder((prev) => prev ? patch(prev) : prev)
    }

    const handleOrderDeleted = (id) => {
        setRecentOrders((prev) => prev.filter(o => o.id !== id))
        setSelectedOrder((prev) => (prev?.id === id ? null : prev))
    }

    const chartConfig = {
        labels: chartData.map(d => {
            const date = new Date(d.date)
            return period === "7"
                ? date.toLocaleDateString("fr-DZ", { weekday: "short" })
                : date.toLocaleDateString("fr-DZ", { month: "short", day: "numeric" })
        }),
        datasets: [{
            label: "Revenus (DZD)",
            data: chartData.map(d => parseFloat(d.revenue)),
            borderColor: "#81e240",
            backgroundColor: "rgba(129, 226, 64, 0.15)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#81e240",
            pointRadius: 3,
            pointHoverRadius: 6,
        }],
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(15,23,42,0.9)",
                padding: 12,
                titleFont: { size: 13, family: "'Manrope', sans-serif" },
                bodyFont: { size: 13, family: "'Manrope', sans-serif" },
                callbacks: { label: (ctx) => `${ctx.parsed.y.toLocaleString("fr-DZ")} دج` }
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { family: "'Manrope', sans-serif", size: 11 } } },
            y: {
                border: { dash: [4, 4] },
                grid: { color: "rgba(0,0,0,0.05)" },
                ticks: { font: { family: "'Manrope', sans-serif", size: 11 }, callback: (v) => v.toLocaleString("fr-DZ") + " دج" }
            }
        }
    }

    const kpis = [
        { label: 'Revenus totaux', value: `${parseFloat(stats?.revenue || 0).toLocaleString("fr-DZ")} دج`, icon: 'payments', color: 'bg-primary/10 text-primary' },
        { label: 'Total commandes', value: stats?.total_orders || 0, icon: 'shopping_bag', color: 'bg-primary/10 text-primary' },
        { label: 'En cours', value: stats?.pending_orders || 0, icon: 'pending_actions', color: 'bg-amber-500/10 text-amber-500' },
        { label: 'Produits au catalogue', value: stats?.total_products || 0, icon: 'inventory_2', color: 'bg-blue-500/10 text-blue-500' },
    ]

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">

            {/* Order detail modal */}
            {selectedOrder && (
                <OrderModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusUpdated={handleStatusUpdated}
                />
            )}

            <div className="flex h-screen overflow-hidden">
                <main className="flex-1 flex flex-col overflow-y-auto w-full">
                    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">

                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight">Tableau de bord</h2>
                            <p className="text-slate-500 mt-1">Gérez vos ventes et suivez vos performances.</p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                            </div>
                        ) : (
                            <>
                                {/* KPIs */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {kpis.map(({ label, value, icon, color }) => (
                                        <div key={label} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500">{label}</p>
                                                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                                                </div>
                                                <div className={`p-2 rounded-lg ${color}`}>
                                                    <span className="material-symbols-outlined">{icon}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Chart */}
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h4 className="text-lg font-bold">Évolution des ventes</h4>
                                            <p className="text-sm text-slate-500">Aperçu de vos revenus</p>
                                        </div>
                                        <select value={period} onChange={(e) => setPeriod(e.target.value)}
                                            className="text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-lg py-1.5 px-3 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                                            <option value="7">7 derniers jours</option>
                                            <option value="30">30 derniers jours</option>
                                            <option value="365">Cette année</option>
                                        </select>
                                    </div>
                                    <div className="h-72 w-full">
                                        <Line data={chartConfig} options={chartOptions} />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Recent Orders Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div>
                                    <h4 className="text-lg font-bold">Commandes récentes</h4>
                                    <p className="text-sm text-slate-500 mt-0.5">Les 10 dernières commandes reçues</p>
                                </div>
                                <a href="/orders"
                                    className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                                    Voir toutes
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </a>
                            </div>

                            {loadingOrders ? (
                                <div className="flex items-center justify-center h-40 gap-3 text-slate-400">
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    Chargement...
                                </div>
                            ) : recentOrders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-3">
                                    <span className="material-symbols-outlined text-4xl">inbox</span>
                                    <p className="text-sm font-medium">Aucune commande pour l'instant.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">N° Commande</th>
                                                <th className="px-6 py-4">Client</th>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4">Articles</th>
                                                <th className="px-6 py-4">Montant</th>
                                                <th className="px-6 py-4">Statut</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {recentOrders.map((order) => {
                                                const currentStatut = order.lignes?.[0]?.statut ?? order.statut
                                                const cfg = getStatusCfg(currentStatut)
                                                return (
                                                    <tr key={order.id}
                                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                                                        onClick={() => setSelectedOrder(order)}
                                                    >
                                                        {/* Order # */}
                                                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">
                                                            <span className="hover:text-primary transition-colors">
                                                                #{order.numero_commande}
                                                            </span>
                                                        </td>

                                                        {/* Customer */}
                                                        <td className="px-6 py-4 text-sm">
                                                            <div className="flex items-center gap-2.5">
                                                                <MiniAvatar name={order.nom ?? order.client_nom ?? order.user_nom} />
                                                                <div>
                                                                    <p className="font-medium text-slate-900 dark:text-slate-100 leading-tight">
                                                                        {order.nom ?? order.client_nom ?? order.user_nom ?? '—'}
                                                                    </p>
                                                                    {order.email && <p className="text-[11px] text-slate-400">{order.email}</p>}
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Date */}
                                                        <td className="px-6 py-4 text-sm text-slate-500">
                                                            {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                                day: 'numeric', month: 'short', year: 'numeric'
                                                            })}
                                                        </td>

                                                        {/* Thumbnails */}
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                {order.lignes?.slice(0, 3).map((ligne, i) => (
                                                                    <div key={ligne.id}
                                                                        className={`w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-slate-900 bg-slate-100 shrink-0 ${i > 0 ? '-ml-2' : ''}`}
                                                                        title={ligne.produit_nom}>
                                                                        <img src={ligne.produit_url} alt={ligne.produit_nom}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/32?text=?' }} />
                                                                    </div>
                                                                ))}
                                                                {(order.lignes?.length ?? 0) > 3 && (
                                                                    <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-white dark:border-slate-900 -ml-2 flex items-center justify-center text-[10px] font-bold text-primary">
                                                                        +{order.lignes.length - 3}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* Amount */}
                                                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">
                                                            {parseFloat(order.total ?? 0).toLocaleString('fr-DZ')} دج
                                                        </td>

                                                        {/* Status */}
                                                        <td className="px-6 py-4">
                                                            <StatusBadge statut={currentStatut} />
                                                        </td>

                                                        {/* Menu */}
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="relative inline-block"
                                                                onClick={(e) => e.stopPropagation()}>
                                                                <button
                                                                    onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                                                                    className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors"
                                                                >
                                                                    more_vert
                                                                </button>
                                                                {openMenuId === order.id && (
                                                                    <OrderMenu
                                                                        order={order}
                                                                        onUpdated={handleStatusUpdated}
                                                                        onDeleted={handleOrderDeleted}
                                                                        onClose={() => setOpenMenuId(null)}
                                                                    />
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <footer className="flex items-center justify-between text-xs text-slate-400 pt-4 pb-6">
                            <p>© 2026 VitaMarket. Tous droits réservés.</p>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    )
}