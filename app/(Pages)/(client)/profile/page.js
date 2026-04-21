'use client'
import { useAuthStore } from '@/app/Store/useAuthStore'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useClientStore } from "@/app/Store/useClientStore";
import jsPDF from "jspdf"
const tabs = [
    { icon: 'package_2', label: 'Mes commandes' },
    { icon: 'favorite', label: 'Liste de souhaits' },
]

const statusConfig = {
    en_attente: { label: 'En attente', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30', icon: 'schedule' },
    confirmee: { label: 'Confirmée', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30', icon: 'verified' },
    en_preparation: { label: 'En préparation', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/30', icon: 'inventory_2' },
    expediee: { label: 'Expédiée', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30', icon: 'local_shipping' },
    livree: { label: 'Livrée', color: 'text-primary bg-primary/10', icon: 'check_circle' },
    collectee: { label: 'Collectée', color: 'text-primary bg-primary/10', icon: 'storefront' },
    annulee: { label: 'Annulée', color: 'text-red-500 bg-red-50 dark:bg-red-950/30', icon: 'cancel' },
}
const getStatusCfg = (s) => statusConfig[s] ?? { label: s, color: 'text-slate-500 bg-slate-100 dark:bg-slate-800', icon: 'info' }

const statusStepMap = {
    en_attente: 0, confirmee: 1, en_preparation: 2,
    expediee: 3, livree: 4, collectee: 5,
}
const STEPS = [
    { key: 'en_attente', label: 'En attente' },
    { key: 'confirmee', label: 'Confirmée' },
    { key: 'en_preparation', label: 'En prép.' },
    { key: 'expediee', label: 'Expédiée' },
    { key: 'livree', label: 'Livrée' },
    { key: 'collectee', label: 'Collectée' },
]

const isCancelled = (s) => s === 'annulee'
const isTerminal = (s) => s === 'livree' || s === 'collectee' || s === 'annulee'
const isDeletable = (s) => s === 'annulee' || s === 'collectee'
const isActive = (s) => !isTerminal(s) && s !== undefined
const isReviewable = (s) => s === 'livree' || s === 'collectee'

const fmt = (n) => parseFloat(n ?? 0).toLocaleString('fr-DZ')

// ─── Avatar with initials ─────────────────────────────────────────────────────
const AVATAR_COLORS = [
    ['#dcfce7', '#16a34a'], ['#dbeafe', '#2563eb'], ['#fce7f3', '#db2777'],
    ['#fef3c7', '#d97706'], ['#ede9fe', '#7c3aed'], ['#ffedd5', '#ea580c'],
    ['#f0fdf4', '#15803d'], ['#f0f9ff', '#0284c7'],
]
function Avatar({ nom, prenom, size = 96 }) {
    const letter1 = (nom?.[0] ?? 'A').toUpperCase()
    const letter2 = (prenom?.[0] ?? 'A').toUpperCase()

    const code1 = letter1.charCodeAt(0) || 65
    const code2 = letter2.charCodeAt(0) || 65

    const idx = (code1 + code2) % AVATAR_COLORS.length
    const [bg, text] = AVATAR_COLORS[idx]

    return (
        <div
            className="rounded-full border-4 border-primary/10 flex items-center justify-center font-extrabold select-none shrink-0"
            style={{ width: size, height: size, background: bg, color: text, fontSize: size * 0.36 }}
        >
            {letter1}{letter2}
        </div>
    )
}

// ─── Star picker ──────────────────────────────────────────────────────────────
function StarPicker({ value, onChange }) {
    const [hovered, setHovered] = useState(0)
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110"
                >
                    <span
                        className={`material-symbols-outlined text-2xl transition-colors ${(hovered || value) >= star ? 'text-amber-400' : 'text-slate-300'}`}
                        style={{ fontVariationSettings: (hovered || value) >= star ? "'FILL' 1" : "'FILL' 0" }}
                    >
                        star
                    </span>
                </button>
            ))}
        </div>
    )
}

// ─── Review Modal ─────────────────────────────────────────────────────────────
function ReviewModal({ ligne, onClose, onSaved }) {
    const [note, setNote] = useState(0)
    const [commentaire, setCommentaire] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async () => {
        if (note === 0) { setError('Veuillez sélectionner une note.'); return }
        setLoading(true); setError('')
        try {
            const res = await fetch('http://localhost:8000/reviews/', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ligne_commande: ligne.id,
                    note,
                    commentaire,
                }),
            })
            if (!res.ok) throw new Error('Erreur lors de l\'envoi de l\'avis')
            onSaved(); onClose()
        } catch (e) { setError(e.message) }
        finally { setLoading(false) }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Laisser un avis</h2>
                    <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-slate-500">close</span>
                    </button>
                </div>

                {/* Product preview */}
                <div className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-6 border border-slate-100 dark:border-slate-700">
                    <div className="size-14 rounded-lg overflow-hidden shrink-0">
                        <img src={ligne.produit_url} alt={ligne.produit_nom} className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/56?text=?' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{ligne.produit_nom}</p>
                        <p className="text-xs text-slate-500">{ligne.produit_vendeur}</p>
                    </div>
                </div>

                {/* Stars */}
                <div className="mb-5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Note</label>
                    <StarPicker value={note} onChange={setNote} />
                    {note > 0 && (
                        <p className="text-xs text-slate-500 mt-1">
                            {['', 'Très mauvais', 'Mauvais', 'Correct', 'Bon', 'Excellent'][note]}
                        </p>
                    )}
                </div>

                {/* Comment */}
                <div className="mb-5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Commentaire (optionnel)</label>
                    <textarea
                        value={commentaire}
                        onChange={(e) => setCommentaire(e.target.value)}
                        rows={3}
                        placeholder="Partagez votre expérience avec ce produit..."
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                    />
                </div>

                {error && <p className="mb-4 text-xs text-red-500 font-medium">{error}</p>}

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        Annuler
                    </button>
                    <button onClick={handleSubmit} disabled={loading || note === 0}
                        className="flex-1 py-2.5 rounded-xl bg-primary text-slate-900 text-sm font-bold hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Envoi...' : 'Publier l\'avis'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function OrderProgressBar({ statut }) {
    const currentStep = statusStepMap[statut] ?? 0
    const total = STEPS.length
    return (
        <div className="py-4">
            <div className="relative flex items-center justify-between mb-3">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${(currentStep / (total - 1)) * 100}%` }} />
                {STEPS.map((step, i) => (
                    <div key={step.key} className={`relative z-10 size-4 rounded-full flex-shrink-0 transition-all
                        ${i < currentStep ? 'bg-primary' : ''}
                        ${i === currentStep ? 'bg-primary ring-4 ring-primary/20' : ''}
                        ${i > currentStep ? 'bg-slate-200 dark:bg-slate-700' : ''}`}
                    />
                ))}
            </div>
            <div className="flex justify-between">
                {STEPS.map((step, i) => (
                    <span key={step.key} className={`text-[10px] font-bold uppercase tracking-wide flex-1 transition-colors
                        ${i === currentStep ? 'text-primary' : i < currentStep ? 'text-slate-400' : 'text-slate-300 dark:text-slate-600'}
                        ${i === 0 ? 'text-left' : i === STEPS.length - 1 ? 'text-right' : 'text-center'}`}>
                        {step.label}
                    </span>
                ))}
            </div>
        </div>
    )
}

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
function EditProfileModal({ user, onClose, onSaved }) {
    const [form, setForm] = useState({
        nom: user?.nom ?? '', prenom: user?.prenom ?? '',
        telephone: user?.telephone ?? '', email: user?.email ?? '',
        adresse_livraison: user?.info?.adresse_livraison ?? '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async () => {
        setLoading(true); setError('')
        try {
            const res = await fetch('http://localhost:8000/auth/me/update/', {
                method: 'PATCH', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            console.log(data)
            if (!res.ok) throw new Error(data.error)
            onSaved(data); onClose()
        } catch (e) { setError(e.message) }
        finally { setLoading(false) }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 font-display">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-8 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Modifier le profil</h2>
                    <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-slate-500">close</span>
                    </button>
                </div>
                <div className="space-y-4">
                    {[
                        { name: 'nom', label: 'Nom' }, { name: 'prenom', label: 'Prénom' },
                        { name: 'telephone', label: 'Téléphone' }, { name: 'email', label: 'Email', type: 'email' },
                        { name: "adresse_livraison", label: "Adresse de livraison", type: "text" }

                    ].map(({ name, label, type = 'text' }) => (
                        <div key={name}>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">{label}</label>
                            <input type={type} value={form[name]}
                                onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            />
                        </div>
                    ))}
                </div>
                {error && <p className="mt-4 text-xs text-red-500 font-medium">{error}</p>}
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Annuler</button>
                    <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 rounded-lg bg-primary text-slate-900 text-sm font-bold hover:brightness-105 transition-all disabled:opacity-60">
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Order Actions Dropdown ───────────────────────────────────────────────────
function OrderActionsMenu({ commande, onCancel, onDelete, onClose }) {
    const [cancelling, setCancelling] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const handleCancel = async () => {
        setCancelling(true)
        try {
            await fetch(`http://localhost:8000/commandes/${commande.id}/cancel/`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            })
            onCancel(commande.id); onClose()
        } catch (e) { console.error(e) }
        finally { setCancelling(false) }
    }

    const handleDelete = async () => {
        if (!confirm('Supprimer définitivement cette commande ?')) return
        setDeleting(true)
        try {
            const res = await fetch(`http://localhost:8000/commandes/${commande.id}/delete_for_client/`, {
                method: 'PATCH',
                credentials: 'include',
            })
            onDelete(commande.id); onClose()
        } catch (e) { console.error(e) }
        finally { setDeleting(false) }
    }

    const handleFacture = () => {
        try {
            const doc = new jsPDF()

            // 🧾 Header
            doc.setFontSize(18)
            doc.text("Facture", 14, 20)

            doc.setFontSize(10)
            doc.text(`Commande #${commande.numero_commande}`, 14, 30)
            doc.text(`Date: ${new Date(commande.created_at).toLocaleDateString()}`, 14, 36)

            // 👤 Client
            doc.text(`Nom: ${commande.nom}`, 14, 46)
            doc.text(`Email: ${commande.email}`, 14, 52)
            doc.text(`Téléphone: ${commande.telephone}`, 14, 58)

            // 📦 Produits
            let y = 70
            doc.text("Produits:", 14, y)

            y += 6

            commande.lignes?.forEach((ligne) => {
                doc.text(
                    `${ligne.produit_nom} x${ligne.quantite} - ${ligne.prix_unitaire} DA`,
                    14,
                    y
                )
                y += 6
            })

            // 💰 Totaux
            y += 10
            doc.text(`Sous-total: ${commande.sous_total} DA`, 14, y)
            y += 6
            doc.text(`Livraison: ${commande.frais_livraison} DA`, 14, y)
            y += 6
            doc.text(`TOTAL: ${commande.total} DA`, 14, y)

            // 📄 فتح PDF
            doc.output("bloburl")
            const url = doc.output("bloburl")
            window.open(url)

        } catch (e) {
            alert("Erreur génération facture: " + e.message)
        }

        onClose()
    }

    return (
        <div className="absolute right-0 top-10 z-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl w-52 overflow-hidden">
            <div className="p-1">
                {/* Voir la facture — always available */}
                <button onClick={handleFacture}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                    <span className="material-symbols-outlined text-base text-slate-500">receipt_long</span>
                    Voir la facture
                </button>

                {/* Cancel — only en_attente */}
                {commande.statut === 'en_attente' && (
                    <button onClick={handleCancel} disabled={cancelling}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-medium text-red-500 transition-colors disabled:opacity-60">
                        <span className="material-symbols-outlined text-base">cancel</span>
                        {cancelling ? 'Annulation...' : 'Annuler la commande'}
                    </button>
                )}

                {/* Delete — only annulee or collectee */}
                {isDeletable(commande.statut) && (
                    <button onClick={handleDelete} disabled={deleting}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-medium text-red-500 transition-colors disabled:opacity-60">
                        <span className="material-symbols-outlined text-base">delete_outline</span>
                        {deleting ? 'Suppression...' : 'Supprimer la commande'}
                    </button>
                )}
            </div>
        </div>
    )
}

// ─── Order Detail View ────────────────────────────────────────────────────────
function OrderDetail({ commande, onBack }) {
    const cfg = getStatusCfg(commande.statut)
    const canReview = isReviewable(commande.statut)
    const [reviewTarget, setReviewTarget] = useState(null) // ligne being reviewed
    const [reviewedIds, setReviewedIds] = useState(new Set())

    return (
        <section className="grid grid-cols-1 gap-6">
            {/* Review modal */}
            {reviewTarget && (
                <ReviewModal
                    ligne={reviewTarget}
                    onClose={() => setReviewTarget(null)}
                    onSaved={() => setReviewedIds((prev) => new Set(prev).add(reviewTarget.id))}
                />
            )}

            <button onClick={onBack}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors w-fit">
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Retour aux commandes
            </button>

            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`size-12 rounded-lg flex items-center justify-center ${cfg.color}`}>
                            <span className="material-symbols-outlined text-2xl">{cfg.icon}</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold">Commande #{commande.numero_commande}</p>
                            <p className="text-xs text-slate-500">
                                {new Date(commande.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                {' • '}{commande.lignes?.length ?? 0} article{(commande.lignes?.length ?? 0) > 1 ? 's' : ''}
                                {' • '}{fmt(commande.total)} دج
                            </p>
                        </div>
                    </div>
                    <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg ${cfg.color}`}>{cfg.label}</span>
                </div>
                <div className="px-6">
                    {isCancelled(commande.statut) ? (
                        <div className="py-4">
                            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900">
                                <span className="material-symbols-outlined text-red-500">info</span>
                                <p className="text-sm font-medium text-red-600 dark:text-red-400">Cette commande a été annulée.</p>
                            </div>
                        </div>
                    ) : (
                        <OrderProgressBar statut={commande.statut} />
                    )}
                </div>
            </div>

            {/* Items — with review button */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-sm font-bold">Articles commandés</p>
                    {canReview && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-primary">rate_review</span>
                            Vous pouvez laisser un avis
                        </span>
                    )}
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {commande.lignes?.map((ligne) => {
                        const reviewed = reviewedIds.has(ligne.id)
                        return (
                            <div key={ligne.id} className="p-6 flex gap-4 items-center">
                                <div className="size-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                                    <img src={ligne.produit_url} alt={ligne.produit_nom}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=?' }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{ligne.produit_nom}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Vendeur : {ligne.produit_vendeur}</p>
                                    <p className="text-xs text-slate-500">Qté : {ligne.quantite} × {fmt(ligne.prix_unitaire)} دج</p>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                                        {fmt(parseFloat(ligne.prix_unitaire) * ligne.quantite)} دج
                                    </p>
                                    {canReview && (
                                        reviewed ? (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-primary">
                                                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                Avis publié
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => setReviewTarget(ligne)}
                                                className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-lg hover:bg-amber-100 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-xs">star</span>
                                                Donner un avis
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Totals */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    <div className="px-6 py-4 flex justify-between text-sm">
                        <span className="text-slate-500">Sous-total</span>
                        <span className="font-medium">{fmt(commande.sous_total)} دج</span>
                    </div>
                    <div className="px-6 py-4 flex justify-between text-sm">
                        <span className="text-slate-500">Livraison</span>
                        <span className={`font-medium ${parseFloat(commande.frais_livraison ?? 0) === 0 ? 'text-primary' : ''}`}>
                            {parseFloat(commande.frais_livraison ?? 0) === 0 ? 'Gratuite' : `${fmt(commande.frais_livraison)} دج`}
                        </span>
                    </div>
                    <div className="px-6 py-4 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-primary">{fmt(commande.total)} دج</span>
                    </div>
                </div>
            </div>

            {/* Delivery address */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary">contact_mail</span>
                    <h3 className="text-base font-bold">Adresse de livraison</h3>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-primary/20 space-y-1">
                    <p className="text-sm font-bold">{commande.nom}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{commande.adresse_livraison}</p>
                    {commande.telephone && <p className="text-xs text-slate-500">{commande.telephone}</p>}
                    {commande.email && <p className="text-xs text-slate-500">{commande.email}</p>}
                </div>
            </div>
        </section>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState(0)
    const { user, setUser } = useAuthStore()
    const { cart, syncCart } = useClientStore()
    console.log(user)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [openMenuId, setOpenMenuId] = useState(null)
    const [showAllOrders, setShowAllOrders] = useState(false)

    const [commandes, setCommandes] = useState([])
    const [loadingCommandes, setLoadingCommandes] = useState(false)
    const [favoris, setFavoris] = useState([])
    const [loadingFavoris, setLoadingFavoris] = useState(false)
    console.log(commandes)
    useEffect(() => {
        const load = async () => {
            setLoadingCommandes(true)
            try {
                const res = await fetch('http://localhost:8000/commandes/', { credentials: 'include' })
                setCommandes(await res.json())
            } catch (e) { console.error(e) }
            finally { setLoadingCommandes(false) }
        }
        load()
    }, [])

    useEffect(() => {
        if (activeTab !== 1) return
        const load = async () => {
            setLoadingFavoris(true)
            try {
                const res = await fetch('http://localhost:8000/favoris/', { credentials: 'include' })
                setFavoris(await res.json())
            } catch (e) { console.error(e) }
            finally { setLoadingFavoris(false) }
        }
        load()
    }, [activeTab])

    useEffect(() => {
        const h = () => setOpenMenuId(null)
        window.addEventListener('click', h)
        return () => window.removeEventListener('click', h)
    }, [])

    const handleCancelOrder = (id) =>
        setCommandes((prev) => prev.map((c) => c.id === id ? { ...c, statut: 'annulee' } : c))

    const handleDeleteOrder = (id) => {
        setCommandes((prev) => prev.filter((c) => c.id !== id))
        if (selectedOrder?.id === id) setSelectedOrder(null)
    }

    const handleRemoveFavori = async (id) => {
        try {
            await fetch(`http://localhost:8000/favoris/${id}/`, { method: 'DELETE', credentials: 'include' })
            setFavoris((prev) => prev.filter((f) => f.id !== id))
        } catch (e) { console.error(e) }
    }

    const displayedCommandes = showAllOrders ? commandes : commandes.slice(0, 3)
    const addToCart = async (productId) => {
        console.log(productId);
        try {
            const res = await fetch("http://localhost:8000/panier/add_product/", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ produit: productId, quantite: 1 }),
            });

            if (!res.ok) {
                alert("Erreur ajout panier");
                return;
            }

            await syncCart();

            alert("Produit ajouté au panier 🛒");
        } catch (err) {
            console.error(err);
        }
    };
    const getCartQuantity = (productId) => {
        const item = cart?.lignes?.find((l) => l.produit_ID == productId);
        return item ? item.quantite : 0;
    }


    return (
        <>
            <Head><title>Mon compte - VitaMarket</title></Head>

            {showEditModal && (
                <EditProfileModal user={user} onClose={() => setShowEditModal(false)}
                    onSaved={(updated) => setUser({ ...user, ...updated })} />
            )}

            <div className="bg-[#f7f8f6] dark:bg-[#182111] text-slate-900 dark:text-slate-100 font-display min-h-screen">
                <main className="flex flex-1 justify-center py-8">
                    <div className="flex flex-col max-w-[1200px] flex-1 px-4 lg:px-40">

                        {/* Profile header */}
                        <div className="flex p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm mb-6">
                            <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                                <div className="flex gap-6 items-center">
                                    {/* ── Initials avatar ── */}
                                    <Avatar nom={user?.nom} prenom={user?.prenom} size={96} />
                                    <div className="flex flex-col">
                                        <h1 className="text-slate-900 dark:text-slate-100 text-2xl font-bold tracking-tight">
                                            {user?.nom?.charAt(0).toUpperCase()}{user?.nom?.slice(1)}{' '}
                                            {user?.prenom?.charAt(0).toUpperCase()}{user?.prenom?.slice(1)}
                                        </h1>
                                        <p className="text-slate-500 text-sm">
                                            Membre VitaMarket depuis{' '}
                                            {new Date(user?.date_joined).toLocaleString('fr-FR', { year: 'numeric', month: 'long' })}
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded">Guide local</span>
                                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded">Bio & local</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setShowEditModal(true)}
                                    className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                                    <span className="material-symbols-outlined text-sm">settings</span>
                                    Modifier le profil
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mb-8 overflow-x-auto">
                            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-8 min-w-max">
                                {tabs.map(({ icon, label }, i) => (
                                    <button key={label}
                                        onClick={() => { setActiveTab(i); setSelectedOrder(null) }}
                                        className={`flex items-center gap-2 border-b-2 pb-3 px-1 transition-all text-sm font-bold ${i === activeTab ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                                        <span className="material-symbols-outlined text-lg">{icon}</span>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ══ ORDER DETAIL ══ */}
                        {activeTab === 0 && selectedOrder && (
                            <OrderDetail commande={selectedOrder} onBack={() => setSelectedOrder(null)} />
                        )}

                        {/* ══ ORDERS LIST ══ */}
                        {activeTab === 0 && !selectedOrder && (
                            <section className="grid grid-cols-1 gap-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold">
                                        {showAllOrders ? "Tout l'historique" : 'Commandes récentes'}
                                    </h3>
                                    {commandes.length > 3 && (
                                        <button onClick={() => setShowAllOrders((p) => !p)}
                                            className="text-primary text-sm font-semibold hover:underline">
                                            {showAllOrders ? 'Voir moins' : "Voir tout l'historique"}
                                        </button>
                                    )}
                                </div>

                                {loadingCommandes ? (
                                    <div className="flex items-center justify-center h-40 text-slate-400 gap-3">
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                        Chargement...
                                    </div>
                                ) : commandes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-3">
                                        <span className="material-symbols-outlined text-4xl">shopping_bag</span>
                                        <p className="text-sm font-medium">Aucune commande pour l'instant.</p>
                                    </div>
                                ) : displayedCommandes.map((commande) => {
                                    const cfg = getStatusCfg(commande.statut)
                                    const active = isActive(commande.statut)
                                    const terminal = isTerminal(commande.statut)

                                    return (
                                        <div key={commande.id}
                                            className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-visible border border-slate-100 dark:border-slate-800 transition-opacity ${terminal ? 'opacity-75' : ''}`}>

                                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`size-12 rounded-lg flex items-center justify-center ${cfg.color}`}>
                                                        <span className="material-symbols-outlined text-2xl">{cfg.icon}</span>
                                                    </div>
                                                    <div>
                                                        <button onClick={() => setSelectedOrder(commande)}
                                                            className="text-sm font-bold hover:text-primary transition-colors text-left">
                                                            Commande #{commande.numero_commande}
                                                        </button>
                                                        <p className="text-xs text-slate-500">
                                                            {new Date(commande.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                            {' • '}{commande.lignes?.length ?? 0} article{(commande.lignes?.length ?? 0) > 1 ? 's' : ''}
                                                            {' • '}{fmt(commande.total)} دج
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg ${cfg.color} w-fit`}>{cfg.label}</span>
                                            </div>

                                            {active && (
                                                <div className="px-6">
                                                    <OrderProgressBar statut={commande.statut} />
                                                    <div className="pb-6 flex gap-3">
                                                        <button onClick={() => setSelectedOrder(commande)}
                                                            className="flex-1 bg-primary text-slate-900 font-bold py-2.5 rounded-xl text-sm hover:brightness-105 transition-all">
                                                            Voir les détails
                                                        </button>
                                                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                                                            <button
                                                                onClick={() => setOpenMenuId(openMenuId === commande.id ? null : commande.id)}
                                                                className="px-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all h-full">
                                                                <span className="material-symbols-outlined text-slate-500">more_horiz</span>
                                                            </button>
                                                            {openMenuId === commande.id && (
                                                                <OrderActionsMenu commande={commande} onCancel={handleCancelOrder} onDelete={handleDeleteOrder} onClose={() => setOpenMenuId(null)} />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {terminal && (
                                                <div className="p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        {commande.lignes?.slice(0, 4).map((ligne) => (
                                                            <div key={ligne.id} className="size-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                                <img src={ligne.produit_url} alt={ligne.produit_nom} className="w-full h-full object-cover"
                                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=?' }} />
                                                            </div>
                                                        ))}
                                                        {(commande.lignes?.length ?? 0) > 4 && (
                                                            <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                                                                +{commande.lignes.length - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => setSelectedOrder(commande)}
                                                            className="text-primary text-xs font-bold border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary/5 transition-all">
                                                            Voir les détails
                                                        </button>
                                                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                                                            <button
                                                                onClick={() => setOpenMenuId(openMenuId === commande.id ? null : commande.id)}
                                                                className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                                                <span className="material-symbols-outlined text-slate-500">more_horiz</span>
                                                            </button>
                                                            {openMenuId === commande.id && (
                                                                <OrderActionsMenu commande={commande} onCancel={handleCancelOrder} onDelete={handleDeleteOrder} onClose={() => setOpenMenuId(null)} />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </section>
                        )}

                        {/* ══ WISHLIST ══ */}
                        {activeTab === 1 && (
                            <section className="grid grid-cols-1 gap-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold">
                                        Ma liste de souhaits
                                        {favoris.length > 0 && <span className="ml-2 text-sm font-normal text-slate-400">({favoris.length})</span>}
                                    </h3>
                                </div>

                                {loadingFavoris ? (
                                    <div className="flex items-center justify-center h-40 text-slate-400 gap-3">
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                        Chargement...
                                    </div>
                                ) : favoris.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-3">
                                        <span className="material-symbols-outlined text-4xl">favorite_border</span>
                                        <p className="text-sm font-medium">Votre liste de souhaits est vide.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {favoris.map((fav) => {
                                            console.log(fav);
                                            const cartQty = getCartQuantity(fav.id_produit);
                                            const isMaxed = cartQty >= fav.quantite_stock;
                                            return (
                                                <div key={fav.id} className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">

                                                    <div className="aspect-square bg-cover bg-center relative" style={{ backgroundImage: `url('${fav.produit_url}')` }}>
                                                        <button onClick={() => handleRemoveFavori(fav.id)}
                                                            className="absolute top-2 right-2 size-8 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-red-500 flex items-center justify-center hover:scale-110 transition-transform">
                                                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                                        </button>
                                                    </div>
                                                    <div className="p-3 text-center">
                                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 line-clamp-2">{fav.produit_nom}</p>
                                                        <p className="text-primary font-bold mt-1">{fmt(fav.produit_prix)} دج</p>
                                                        <button disabled={isMaxed || fav.quantite_stock === 0} onClick={() => addToCart(fav.id_produit)} className="disabled:opacity-50 disabled:cursor-not-allowed mt-3 w-full bg-primary/10 text-primary py-2 rounded-lg text-xs font-bold hover:bg-primary hover:text-slate-900 transition-all">
                                                            Ajouter au panier
                                                        </button>
                                                        {isMaxed && fav.quantite_stock > 0 && (
                                                            <p className="text-[10px] text-red-500 mt-1 font-semibold w-[80%] mx-auto text-center">
                                                                Quantité maximale atteinte dans le panier
                                                            </p>
                                                        )}
                                                        {fav.quantite_stock == 0 && (
                                                            <p className="text-[10px] text-red-500 mt-1 font-semibold w-[80%] mx-auto text-center">
                                                                Rupture de stock
                                                            </p>
                                                        )}
                                                    </div>

                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                </main>

                <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 px-6 lg:px-40 mt-12">
                    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3 text-primary">
                            <span className="material-symbols-outlined">eco</span>
                            <span className="font-bold tracking-tight text-slate-900 dark:text-slate-100">VitaMarket</span>
                        </div>
                        <div className="flex gap-8 text-xs font-semibold text-slate-500">
                            {['Confidentialité', 'CGU', 'Support'].map((l) => (
                                <a key={l} className="hover:text-primary transition-colors" href="#">{l}</a>
                            ))}
                        </div>
                        <div className="text-xs text-slate-400">© 2024 VitaMarket. Tous droits réservés.</div>
                    </div>
                </footer>
            </div>
        </>
    )
}