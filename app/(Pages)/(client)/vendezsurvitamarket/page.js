'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function BecomeVendorPage() {
    const [activeStep, setActiveStep] = useState(null)

    const steps = [
        {
            number: '1',
            icon: 'person_add',
            title: 'Créer un compte',
            description: 'Rejoignez notre communauté en remplissant notre formulaire de candidature vendeur.',
            checks: ['Formulaire en ligne rapide',],
        },
        {
            number: '2',
            icon: 'verified_user',
            title: "Attendre l'approbation",
            description: 'Nous vérifions vos informations pour garantir que tous les produits respectent nos critères stricts de durabilité et de qualité.',
            checks: ['Vérification des informations', 'Appel avec le CEO pour valider l\'abonnement et les details'],
        },
        {
            number: '3',
            icon: 'rocket_launch',
            title: 'Commencer à vendre',
            description: 'Atteignez instantanément des clients éco-conscients. Utilisez notre tableau de bord pour gérer vos stocks et ventes.',
            checks: ['Tableau de bord puissant',],
        },
    ]

    const statsGrid = [
        { icon: 'eco', value: '100%', label: 'Durable' },
        { icon: 'groups', value: '50+', label: 'Utilisateurs/jour' },
        { icon: 'storefront', value: '5+', label: 'Vendeurs actifs' },
        { icon: 'payments', value: '', label: 'Abonnement' },
    ]

    const platformStats = [
        { label: "Délai d'intégration", value: '24–48 heures' },
        { label: 'Commission plateforme', value: 'Dinars' },
        { label: 'Fréquence de paiement', value: 'Selon Abonnement choisi' },
        { label: 'Accès au support', value: '24/7 prioritaire' },
        { label: 'Produits listés max', value: 'Illimité' },
        { label: 'Tableau de bord', value: 'Temps réel' },
    ]



    const faqs = [
        {
            q: 'Quels types de produits puis-je vendre ?',
            a: "Tous les produits healthy et éco-responsables. Nous acceptons l'alimentation saine, la cosmétique naturelle, les compléments alimentaires et les produits durables, etc.",
        },
        {
            q: "Combien coûte la mise en vente de mes produits ?",
            a: "L'inscription est payante avec un abonnement flexible : mensuel, trimestriel ou annuel. Cela permet d’accéder à la plateforme et de mettre vos produits en vente selon la formule choisie.",
        },
        {
            q: "Combien de temps dure le processus d'approbation ?",
            a: "En général, le processus prend entre 24 et 48 heures ouvrables après soumission complète de votre dossier.",
        },
    ]

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">

            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-background-light dark:bg-background-dark py-20 md:py-28">
                {/* background blobs */}
                <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-primary/5 blur-2xl" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Left */}
                    <div>
                        <span className="mb-6 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-primary">
                            <span className="material-symbols-outlined text-sm">eco</span>
                            Opportunité vous attend
                        </span>
                        <h1 className="mb-6 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-slate-100">
                            Développez votre activité<br />
                            avec <span className="text-primary">VitaMarket</span>
                        </h1>
                        <p className="mb-10 max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                            Rejoignez une marketplace dédiée au mode de vie durable. Nous fournissons la plateforme, vous apportez la passion.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="/register?role=vendor"
                                className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-slate-900 shadow-lg shadow-primary/20 transition-all hover:brightness-105 active:scale-95"
                            >
                                <span className="material-symbols-outlined">storefront</span>
                                Devenir vendeur
                            </a>
                            <a href="#comment"
                                className="flex items-center gap-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-8 py-4 text-lg font-bold text-slate-700 dark:text-slate-300 transition-all hover:border-primary hover:text-primary"
                            >
                                <span className="material-symbols-outlined">info</span>
                                En savoir plus
                            </a>
                        </div>
                    </div>

                    {/* Right — stats grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {statsGrid.map((s, i) => (
                            <div
                                key={s.label}
                                className={`flex flex-col items-center rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${i === 1 ? 'mt-6' : ''} ${i === 2 ? '-mt-6' : ''}`}
                            >
                                <span
                                    className="material-symbols-outlined mb-2 text-3xl text-primary"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                    {s.icon}
                                </span>
                                <span className="text-3xl font-black leading-none text-slate-900 dark:text-slate-100">{s.value}</span>
                                <span className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div >
            </section >

            {/* ── How it works ─────────────────────────────────────────────── */}
            < section id="comment" className="py-24 bg-white dark:bg-slate-900/50" >
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    <div className="mb-16 text-center">
                        <span className="text-xs font-black uppercase tracking-widest text-primary">Processus simple</span>
                        <h2 className="mt-3 mb-4 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                            Comment devenir vendeur
                        </h2>
                        <div className="mx-auto h-1 w-20 rounded-full bg-primary" />
                    </div>

                    <div className="relative">
                        {/* connector */}
                        <div className="absolute top-14 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] hidden h-px bg-gradient-to-r from-primary/30 via-primary to-primary/30 md:block" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {steps.map((step, i) => (
                                <div
                                    key={step.title}
                                    onMouseEnter={() => setActiveStep(i)}
                                    onMouseLeave={() => setActiveStep(null)}
                                    className={`group relative cursor-default rounded-2xl border-2 bg-white dark:bg-slate-900 p-8 transition-all duration-300
                                        ${activeStep === i
                                            ? 'border-primary shadow-xl shadow-primary/10 -translate-y-1'
                                            : 'border-slate-100 dark:border-slate-800 hover:border-primary/40 hover:shadow-md'}`}
                                >
                                    {/* watermark */}
                                    <span
                                        className="pointer-events-none absolute -top-5 -left-1 select-none text-8xl font-black leading-none transition-opacity duration-300"
                                        style={{
                                            WebkitTextStroke: '2px #81e240',
                                            color: 'transparent',
                                            opacity: activeStep === i ? 0.15 : 0.06,
                                        }}
                                    >
                                        {step.number}
                                    </span>

                                    {/* step dot on connector */}
                                    <div
                                        className={`absolute -top-3 left-1/2 hidden -translate-x-1/2 h-6 w-6 rounded-full border-4 border-background-light dark:border-background-dark transition-all duration-300 md:block
                                            ${activeStep === i ? 'scale-125 bg-primary' : 'bg-primary/70'}`}
                                    />

                                    {/* icon */}
                                    <div
                                        className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300
                                            ${activeStep === i ? 'bg-primary text-slate-900' : 'bg-primary/10 text-primary'}`}
                                    >
                                        <span
                                            className="material-symbols-outlined text-3xl"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            {step.icon}
                                        </span>
                                    </div>

                                    <h3 className="mb-3 text-xl font-extrabold text-slate-900 dark:text-slate-100">{step.title}</h3>
                                    <p className="mb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{step.description}</p>

                                    <ul className="space-y-2">
                                        {step.checks.map((check) => (
                                            <li key={check} className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                <span
                                                    className="material-symbols-outlined text-base text-primary"
                                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                                >
                                                    check_circle
                                                </span>
                                                {check}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section >

            {/* ── Platform stats (nutrition-label) ─────────────────────────── */}
            < section className="py-24 max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center" >
                {/* image */}
                < div className="relative h-[440px] overflow-hidden rounded-2xl shadow-xl" >
                    <img
                        src="https://res.cloudinary.com/dspmgbmfb/image/upload/q_auto/f_auto/v1776426413/2_sbhm27.png"
                        alt="Emballage durable"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                </div >

                {/* nutrition-label card */}
                < div className="border-[3px] border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-900 p-8 shadow-[6px_6px_0px_0px_#81e240]" >
                    <h3 className="border-b-[6px] border-slate-900 dark:border-slate-100 pb-3 mb-2 text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
                        Stats Plateforme
                    </h3>
                    <p className="mb-4 border-b border-slate-200 dark:border-slate-700 pb-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                        Par cycle de vie vendeur
                    </p>

                    <div className="space-y-0">
                        {platformStats.map((stat, i) => (
                            <div
                                key={stat.label}
                                className={`flex items-center justify-between py-2.5
                                    ${i < platformStats.length - 1
                                        ? 'border-b border-slate-200 dark:border-slate-700'
                                        : 'border-b-[3px] border-slate-900 dark:border-slate-100'}`}
                            >
                                <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{stat.label}</span>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/login"
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-extrabold text-slate-900 shadow-md shadow-primary/20 transition-all hover:brightness-105 active:scale-95"
                    >
                        <span className="material-symbols-outlined">storefront</span>
                        Démarrer maintenant
                    </Link >
                </div >
            </section >



            {/* ── FAQ ──────────────────────────────────────────────────────── */}
            < section className="pb-24 max-w-7xl mx-auto px-6 md:px-10" >
                <div className="mb-12 text-center">
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
                        Questions fréquentes
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Tout ce que vous devez savoir avant de commencer</p>
                </div>
                <div className="max-w-2xl mx-auto space-y-3">
                    {faqs.map((faq, i) => (
                        <FaqItem key={i} question={faq.q} answer={faq.a} />
                    ))}
                </div>
            </section >


        </div >
    )
}

// ─── FAQ accordion ────────────────────────────────────────────────────────────
function FaqItem({ question, answer }) {
    const [open, setOpen] = useState(false)
    return (
        <div
            className={`overflow-hidden rounded-xl border-2 bg-white dark:bg-slate-900 transition-all duration-200
                ${open ? 'border-primary' : 'border-slate-100 dark:border-slate-800 hover:border-primary/40'}`}
        >
            <button
                onClick={() => setOpen((p) => !p)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
            >
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{question}</span>
                <span
                    className={`material-symbols-outlined shrink-0 text-primary transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                >
                    expand_more
                </span>
            </button>
            {open && (
                <div className="border-t border-slate-100 dark:border-slate-800 px-6 pb-5 pt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {answer}
                </div>
            )}
        </div>
    )
}