'use client'
import { useState, useEffect, useRef } from "react";

// ─── Status config (Django choices) ──────────────────────────────────────────
const STATUS_CONFIG = {
    en_attente: { label: 'En attente', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-400' },
    confirmee: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-400' },
    en_preparation: { label: 'En préparation', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', dot: 'bg-purple-400' },
    expediee: { label: 'Expédiée', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400', dot: 'bg-indigo-400' },
    livree: { label: 'Livrée', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-400' },
    collectee: { label: 'Collectée', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-400' },
    annulee: { label: 'Annulée', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-400' },
}
const getStatus = (s) => STATUS_CONFIG[s] ?? { label: s ?? '—', color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' }
const ALL_STATUSES = Object.keys(STATUS_CONFIG)

const TAB_FILTERS = {
    'Toutes': null,
    'En attente': ['en_attente'],
    'Confirmée': ['confirmee'],
    'En préparation': ['en_preparation'],
    'Expédiée': ['expediee'],
    'Livrée': ['livree'],
    'Collectée': ['collectee'],
    'Annulée': ['annulee'],
}
const TABS = Object.keys(TAB_FILTERS)

const NEXT_STATUS = {
    en_attente: 'confirmee',
    confirmee: 'en_preparation',
    en_preparation: 'expediee',
    expediee: 'livree',
    livree: 'collectee',
}

const getOrderStatut = (order) => order.lignes?.[0]?.statut ?? order.statut

const patchLignes = async (lignes, newStatus) => {
    await Promise.all(
        lignes.map((ligne) =>
            fetch(`http://localhost:8000/lignes/${ligne.id}/`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ statut: newStatus }),
            })
        )
    )
}

const fmt = (n) => parseFloat(n ?? 0).toLocaleString('fr-DZ')

// ─── Mini avatar ──────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    ['#dcfce7', '#16a34a'], ['#dbeafe', '#2563eb'], ['#fce7f3', '#db2777'],
    ['#fef3c7', '#d97706'], ['#ede9fe', '#7c3aed'], ['#ffedd5', '#ea580c'],
    ['#f0fdf4', '#15803d'], ['#f0f9ff', '#0284c7'],
]
function MiniAvatar({ name = '', size = 8 }) {
    const letter = (name?.[0] ?? '?').toUpperCase()
    const idx = letter.charCodeAt(0) % AVATAR_COLORS.length
    const [bg, text] = AVATAR_COLORS[idx]
    return (
        <div
            className={`w-${size} h-${size} rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0`}
            style={{ background: bg, color: text }}
        >
            {letter}
        </div>
    )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ statut }) {
    const cfg = getStatus(statut)
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    )
}

// ─── Status change dropdown ───────────────────────────────────────────────────
function StatusDropdown({ order, onUpdated, onClose }) {
    const [loading, setLoading] = useState(false)
    const currentStatut = getOrderStatut(order)

    const handleChange = async (newStatus) => {
        if (newStatus === currentStatut) { onClose(); return }
        setLoading(true)
        try {
            await patchLignes(order.lignes, newStatus)
            onUpdated(order.id, newStatus)
            onClose()
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    return (
        <div className="absolute right-0 top-9 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-52 overflow-hidden">
            <p className="px-4 pt-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {loading ? 'Mise à jour...' : 'Changer le statut'}
            </p>
            <div className="p-1 pb-2">
                {ALL_STATUSES.map((s) => {
                    const cfg = getStatus(s)
                    const isCurrent = s === currentStatut
                    return (
                        <button key={s} onClick={() => handleChange(s)} disabled={loading || isCurrent}
                            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors
                                ${isCurrent ? 'bg-slate-50 dark:bg-slate-800 cursor-default' : 'hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'}
                                disabled:opacity-60`}>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                {cfg.label}
                            </span>
                            {isCurrent && <span className="material-symbols-outlined text-primary text-sm">check</span>}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

// ─── Order Detail Modal (same as dashboard) ───────────────────────────────────
const STEPS = [
    { key: 'en_attente', label: 'En attente' },
    { key: 'confirmee', label: 'Confirmée' },
    { key: 'en_preparation', label: 'En prép.' },
    { key: 'expediee', label: 'Expédiée' },
    { key: 'livree', label: 'Livrée' },
    { key: 'collectee', label: 'Collectée' },
]
const STEP_MAP = { en_attente: 0, confirmee: 1, en_preparation: 2, expediee: 3, livree: 4, collectee: 5 }

function OrderModal({ order, onClose, onStatusChange }) {
    const modalRef = useRef(null)
    const [advancing, setAdvancing] = useState(false)
    const currentStatut = getOrderStatut(order)
    const nextStatus = NEXT_STATUS[currentStatut]
    const currentStep = STEP_MAP[currentStatut] ?? 0
    const isCancelled = currentStatut === 'annulee'

    useEffect(() => {
        const h = (e) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', h)
        return () => document.removeEventListener('keydown', h)
    }, [onClose])

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    const handleAdvance = async () => {
        if (!nextStatus) return
        setAdvancing(true)
        try {
            await patchLignes(order.lignes, nextStatus)
            onStatusChange(order.id, nextStatus)
        } catch (e) { console.error(e) }
        finally { setAdvancing(false) }
    }

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
                        <div className={`size-10 rounded-xl flex items-center justify-center ${getStatus(currentStatut).color}`}>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
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
                                <div
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500"
                                    style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                                />
                                {STEPS.map((step, i) => (
                                    <div key={step.key}
                                        className={`relative z-10 size-4 rounded-full shrink-0 transition-all
                                            ${i <= currentStep ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}
                                            ${i === currentStep ? 'ring-4 ring-primary/20' : ''}`}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between">
                                {STEPS.map((step, i) => (
                                    <span key={step.key}
                                        className={`text-[9px] font-bold uppercase tracking-wide flex-1 transition-colors
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
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
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
                                <span className="text-slate-500">Sous-total</span>
                                <span className="font-medium">{fmt(order.sous_total)} دج</span>
                            </div>
                            <div className="px-5 py-3 flex justify-between text-sm">
                                <span className="text-slate-500">Livraison</span>
                                <span className={`font-medium ${parseFloat(order.frais_livraison ?? 0) === 0 ? 'text-primary' : ''}`}>
                                    {parseFloat(order.frais_livraison ?? 0) === 0 ? 'Gratuite' : `${fmt(order.frais_livraison)} دج`}
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
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 flex gap-3">
                    <button onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        Fermer
                    </button>
                    {nextStatus && (
                        <button onClick={handleAdvance} disabled={advancing}
                            className="flex-1 py-2.5 rounded-xl bg-primary hover:brightness-105 disabled:opacity-60 text-slate-900 text-sm font-bold transition-all flex items-center justify-center gap-2">
                            {advancing
                                ? <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                : <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            }
                            Passer à : {getStatus(nextStatus).label}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OrderManagement() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('Toutes')
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [openMenuId, setOpenMenuId] = useState(null)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const ITEMS_PER_PAGE = 10

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("http://localhost:8000/commandes/vendeur/", { credentials: "include" })
                if (res.ok) {
                    const data = await res.json()
                    setOrders(Array.isArray(data) ? data : data.results ?? [])
                }
            } catch (e) { console.error(e) }
            finally { setLoading(false) }
        }
        load()
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
        setOrders((prev) => prev.map(patch))
        setSelectedOrder((prev) => prev ? patch(prev) : prev)
    }

    const tabCounts = TABS.reduce((acc, tab) => {
        const filter = TAB_FILTERS[tab]
        acc[tab] = filter
            ? orders.filter((o) => filter.includes(getOrderStatut(o))).length
            : orders.length
        return acc
    }, {})

    const filtered = orders.filter((o) => {
        const filter = TAB_FILTERS[activeTab]
        const tabMatch = !filter || filter.includes(getOrderStatut(o))
        const searchMatch = !search
            || o.numero_commande?.toLowerCase().includes(search.toLowerCase())
            || o.nom?.toLowerCase().includes(search.toLowerCase())
            || o.email?.toLowerCase().includes(search.toLowerCase())
        return tabMatch && searchMatch
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const handleTabChange = (tab) => { setActiveTab(tab); setCurrentPage(1) }
    const handleSearch = (v) => { setSearch(v); setCurrentPage(1) }

    const kpis = [
        { label: 'Total commandes', value: orders.length, icon: 'shopping_bag', color: 'bg-primary/10 text-primary' },
        { label: 'En attente', value: orders.filter(o => getOrderStatut(o) === 'en_attente').length, icon: 'schedule', color: 'bg-amber-500/10 text-amber-500' },
        { label: 'En cours', value: orders.filter(o => ['confirmee', 'en_preparation', 'expediee'].includes(getOrderStatut(o))).length, icon: 'pending_actions', color: 'bg-blue-500/10 text-blue-500' },
        { label: 'Livrées', value: orders.filter(o => ['livree', 'collectee'].includes(getOrderStatut(o))).length, icon: 'check_circle', color: 'bg-emerald-500/10 text-emerald-600' },
    ]

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">

            {selectedOrder && (
                <OrderModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={handleStatusUpdated}
                />
            )}

            <div className="flex h-screen overflow-hidden">
                <main className="flex-1 flex flex-col overflow-y-auto w-full">
                    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">

                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight">Gestion des commandes</h2>
                            <p className="text-slate-500 mt-1">Suivez et mettez à jour toutes vos commandes.</p>
                        </div>

                        {/* KPIs */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {kpis.map(({ label, value, icon, color }) => (
                                <div key={label} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">{label}</p>
                                            <h3 className="text-3xl font-black mt-1">{value}</h3>
                                        </div>
                                        <div className={`p-2 rounded-xl ${color}`}>
                                            <span className="material-symbols-outlined">{icon}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Table card */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

                            {/* Tabs + search */}
                            <div className="border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-0 overflow-x-auto px-6 pt-2">
                                    {TABS.map((tab) => (
                                        <button key={tab} onClick={() => handleTabChange(tab)}
                                            className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-3 border-b-2 text-sm font-semibold transition-all
                                                ${activeTab === tab
                                                    ? 'border-primary text-primary'
                                                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>
                                            {tab}
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                                                ${activeTab === tab ? 'bg-primary/20 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                                {tabCounts[tab]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <div className="px-6 py-3 flex items-center gap-3">
                                    <div className="relative flex-1 max-w-sm">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                        <input value={search} onChange={(e) => handleSearch(e.target.value)}
                                            placeholder="Rechercher par n° commande, client..."
                                            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                                        {search && (
                                            <button onClick={() => handleSearch('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        )}
                                    </div>
                                    <span className="text-xs text-slate-400 ml-auto">
                                        {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">N° Commande</th>
                                            <th className="px-6 py-4">Client</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Articles</th>
                                            <th className="px-6 py-4">Total</th>
                                            <th className="px-6 py-4">Statut lignes</th>
                                            <th className="px-6 py-4">Action rapide</th>
                                            <th className="px-6 py-4 text-right">Menu</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={8} className="py-20 text-center">
                                                    <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                                                </td>
                                            </tr>
                                        ) : paginated.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="py-20 text-center text-slate-400">
                                                    <span className="material-symbols-outlined text-4xl block mb-2">search_off</span>
                                                    Aucune commande trouvée.
                                                </td>
                                            </tr>
                                        ) : paginated.map((order) => {
                                            const currentStatut = getOrderStatut(order)
                                            const nextStatus = NEXT_STATUS[currentStatut]
                                            const nextCfg = nextStatus ? getStatus(nextStatus) : null

                                            return (
                                                <tr key={order.id}
                                                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    {/* Order # */}
                                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                        <button onClick={() => setSelectedOrder(order)}
                                                            className="text-sm font-bold hover:text-primary transition-colors">
                                                            #{order.numero_commande}
                                                        </button>
                                                    </td>

                                                    {/* Customer */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <MiniAvatar name={order.nom} />
                                                            <div>
                                                                <p className="text-sm font-medium leading-tight">{order.nom ?? '—'}</p>
                                                                {order.email && <p className="text-[11px] text-slate-400">{order.email}</p>}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Date */}
                                                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                                                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })}
                                                    </td>

                                                    {/* Article thumbnails */}
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

                                                    {/* Total */}
                                                    <td className="px-6 py-4 text-sm font-bold whitespace-nowrap">
                                                        {parseFloat(order.total ?? 0).toLocaleString('fr-DZ')} دج
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-6 py-4">
                                                        <StatusBadge statut={currentStatut} />
                                                    </td>

                                                    {/* Quick advance */}
                                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                        {nextCfg ? (
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        await patchLignes(order.lignes, nextStatus)
                                                                        handleStatusUpdated(order.id, nextStatus)
                                                                    } catch (e) { console.error(e) }
                                                                }}
                                                                className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-slate-900 transition-all"
                                                            >
                                                                <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                                                {nextCfg.label}
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                                                        )}
                                                    </td>

                                                    {/* Menu */}
                                                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                        <div className="relative inline-block">
                                                            <button
                                                                onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                                                                className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors"
                                                            >
                                                                more_vert
                                                            </button>
                                                            {openMenuId === order.id && (
                                                                <StatusDropdown
                                                                    order={order}
                                                                    onUpdated={handleStatusUpdated}
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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <p className="text-xs text-slate-400">
                                        {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} sur {filtered.length}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                            .reduce((acc, p, i, arr) => {
                                                if (i > 0 && p - arr[i - 1] > 1) acc.push('...')
                                                acc.push(p)
                                                return acc
                                            }, [])
                                            .map((p, i) =>
                                                p === '...' ? (
                                                    <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">…</span>
                                                ) : (
                                                    <button key={p} onClick={() => setCurrentPage(p)}
                                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all
                                                            ${currentPage === p ? 'bg-primary text-slate-900' : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                                        {p}
                                                    </button>
                                                )
                                            )}
                                        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <footer className="text-xs text-slate-400 pt-4 pb-6">
                            © 2024 VitaMarket. Tous droits réservés.
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    )
}