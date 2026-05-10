'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// ─── Simple intersection-observer hook for fade-in animations ─────────────────
function useReveal(threshold = 0.15) {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
            { threshold }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [threshold])
    return [ref, visible]
}

// ─── Reusable reveal wrapper ──────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
    const [ref, visible] = useReveal()
    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${className}`}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(28px)',
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    )
}

// ─── Founder card ─────────────────────────────────────────────────────────────
function FounderCard({ img, email, alt, role, icon, name, bio, delay = 0 }) {
    return (
        <Reveal delay={delay}>
            <div className="h-[700px] group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                        src={img}
                        alt={alt}
                        className="w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/600x450?text=Photo'
                        }}
                    />
                </div>

                {/* Body */}
                <div className="p-8 md:p-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary text-lg">{icon}</span>
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-primary">
                            {role}
                        </span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-3">{name}</h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{bio}</p>

                    {/* Social links */}
                    <div className="flex gap-3">
                        {['mail'].map((icon) => (
                            <button
                                key={icon}
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-primary/20 hover:text-primary transition-all"
                            >
                                <span className="material-symbols-outlined text-[18px]"><a href={`mailto:${email}`} target="_blank">{icon}</a></span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Reveal>
    )
}

// ─── Value card ───────────────────────────────────────────────────────────────
function ValueCard({ icon, title, desc, delay = 0 }) {
    return (
        <Reveal delay={delay}>
            <div className="group flex flex-col gap-4 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/40 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <span className="material-symbols-outlined text-primary text-[22px]">{icon}</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </Reveal>
    )
}

// ─── Stat bubble ──────────────────────────────────────────────────────────────
function StatBubble({ value, label, delay = 0 }) {
    return (
        <Reveal delay={delay} className="text-center">
            <p className="text-5xl font-black text-primary leading-none mb-2">{value}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
        </Reveal>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NotreHistoire() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">

            {/* ── Hero ── */}
            <section className="relative overflow-hidden pt-24 pb-32 px-6">
                {/* decorative blob */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-3xl"
                    style={{ background: '#81e240' }}
                />
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <Reveal>
                        <span className="inline-block bg-primary/20 text-primary text-[10px] font-extrabold uppercase tracking-[0.15em] py-1.5 px-5 rounded-full mb-6">
                            Bienvenue chez VitaMarket
                        </span>
                    </Reveal>
                    <Reveal delay={100}>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.08] mb-8">
                            Notre{' '}
                            <span className="text-primary">Histoire</span>
                        </h1>
                    </Reveal>
                    <Reveal delay={200}>
                        <p className="text-base md:text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                            VitaMarket est né d'une conviction simple : le manger sain ne devrait jamais être un luxe. Notre mission est de reconnecter les consommateurs avec les produits healthy.</p>
                    </Reveal>
                </div>
            </section>

            {/* ── Stats band ── */}
            <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 px-6">
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 divide-x-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                    <StatBubble value="5+" label="Producteurs partenaires" delay={0} />
                    <StatBubble value="50+" label="Clients satisfaits" delay={80} />
                    <StatBubble value="100%" label="Certifié healthy" delay={160} />
                    <StatBubble value="6 mois" label="D'activité" delay={240} />
                </div>
            </section>

            {/* ── Founders ── */}
            <section className="max-w-6xl mx-auto px-6 py-24">
                <Reveal>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                            Les fondateurs
                        </span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-center mb-14">
                        Deux visions,{' '}
                        <span className="text-primary">une mission</span>
                    </h2>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FounderCard
                        img="https://res.cloudinary.com/dspmgbmfb/image/upload/q_auto/f_auto/v1775158607/xdy7lap7spaob9pkjlcq.png"
                        alt="Co-fondateur VitaMarket"
                        role="Co-Fondateur"
                        icon="person"
                        name="BOUMEDINE Mohammed"
                        bio="Passionné de produits healthy et expert en développement, j'ai imaginé VitaMarket comme un pont technologique reliant les produits healthy à l'assiette. Mon objectif est de rendre les produits healthy accessibles à tous."
                        delay={0}
                        email="mohammed.boumedine@outlook.fr"
                    />
                    <FounderCard
                        img="https://res.cloudinary.com/dspmgbmfb/image/upload/q_auto/f_auto/v1777550938/Gemini_Generated_Image_gumwugumwugumwug_oji9ew.png"
                        alt="Co-fondatrice VitaMarket"
                        role="Co-Fondateur"
                        icon="person"
                        name="Ezzine Salah Eddine"
                        bio="Il veille à ce que chaque produit sur notre plateforme réponde aux standards les plus stricts en matière de santé. Son expertise garantit que la qualité n’est jamais sacrifiée au profit de la quantité."
                        delay={120}
                        email="salah.ezzine@outlook.fr"
                    />
                </div>
            </section>


            {/* ── Timeline / Story ── */}
            <section className="max-w-3xl mx-auto px-6 py-24">
                <Reveal>
                    <h2 className="text-3xl font-extrabold text-center mb-16">
                        Notre <span className="text-primary">parcours</span>
                    </h2>
                </Reveal>
                <div className="relative">
                    {/* vertical line */}
                    <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800" />

                    {[
                        { year: 'Septembre 2026', title: 'L’idée de VitaMarket', desc: 'Face au manque de sites web dédiés aux produits healthy, nous lançons la vision de VitaMarket pour rendre ces produits accessibles à tous.', delay: 0 },
                        { year: 'Janvier 2026', title: 'Début du développement', desc: 'Nous entamons le développement de l’application avec pour objectif de créer une plateforme simple, rapide et fiable.', delay: 100 },
                        { year: 'Aujourd’hui', title: 'Mise en production', desc: 'VitaMarket passe en production et commence à connecter les consommateurs avec des produits healthy de qualité.', delay: 200 },
                    ].map(({ year, title, desc, delay }) => (
                        <Reveal key={year} delay={delay} className="relative pl-14 pb-12 last:pb-0">
                            {/* dot */}
                            <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                            </div>
                            <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-2">
                                {year}
                            </span>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ── CTA banner ── */}
            <section className="px-6 pb-24">
                <Reveal>
                    <div className="max-w-4xl mx-auto bg-primary rounded-xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                        {/* decorative circle */}
                        <div aria-hidden className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10" />
                        <div aria-hidden className="absolute right-24 bottom-0 w-32 h-32 rounded-full bg-white/5" />
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                                Rejoignez l'aventure
                            </h3>
                            <p className="text-slate-900/70 font-medium text-sm max-w-sm">
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 relative z-10 shrink-0">
                            <Link href="/products">
                                <button className="px-7 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors">
                                    Découvrir la boutique
                                </button>
                            </Link>
                            <Link href="/login">
                                <button className="px-7 py-3 rounded-xl bg-white/30 text-slate-900 font-bold text-sm hover:bg-white/50 transition-colors">
                                    Devenir vendeur
                                </button>
                            </Link>
                        </div>
                    </div>
                </Reveal>
            </section>
        </div>
    )
}