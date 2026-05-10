'use client'
import { useEffect, useRef, useState } from 'react'

// ─── Intersection-observer reveal hook ────────────────────────────────────────
function useReveal(threshold = 0.12) {
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

function Reveal({ children, delay = 0, className = '' }) {
    const [ref, visible] = useReveal()
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    )
}

// ─── TOC items ────────────────────────────────────────────────────────────────
const TOC = [
    { href: '#tos', label: 'Conditions de Service' },
    { href: '#privacy', label: 'Politique de Confidentialité' },
    { href: '#data', label: 'Protection des Données' },
    { href: '#responsibilities', label: 'Responsabilités' },
]

// ─── Responsibility card ──────────────────────────────────────────────────────
function RespCard({ icon, title, desc, delay = 0 }) {
    return (
        <Reveal delay={delay}>
            <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 hover:border-primary/40 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-lg mb-4">
                    <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">{title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </Reveal>
    )
}

// ─── Data item ────────────────────────────────────────────────────────────────
function DataItem({ icon, label, desc }) {
    return (
        <div className="flex gap-4 items-start">
            <span className="material-symbols-outlined text-primary text-[22px] mt-0.5 shrink-0">{icon}</span>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold">{label} : </span>{desc}
            </p>
        </div>
    )
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ num, title }) {
    return (
        <Reveal>
            <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-black text-primary/30 leading-none">{num}.</span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{title}</h2>
            </div>
        </Reveal>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CGUPage() {
    const [activeSection, setActiveSection] = useState('tos')

    // Highlight active TOC item on scroll
    useEffect(() => {
        const ids = ['tos', 'privacy', 'data', 'responsibilities', 'contact']
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id) })
            },
            { rootMargin: '-30% 0px -60% 0px' }
        )
        ids.forEach((id) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })
        return () => observer.disconnect()
    }, [])

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
            <main className="max-w-7xl mx-auto px-6 md:px-16 lg:px-40 py-20">

                {/* ── Header ── */}
                <header className="mb-16">
                    <Reveal>
                        <span className="inline-flex items-center gap-1.5 bg-primary/20 text-primary text-[10px] font-extrabold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full mb-5">
                            <span className="material-symbols-outlined text-[14px]">update</span>
                            Mise à jour : Avr 2026
                        </span>
                    </Reveal>
                    <Reveal delay={80}>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6 max-w-3xl">
                            Conditions Générales d'Utilisation &{' '}
                            <span className="text-primary">Politique de Confidentialité</span>
                        </h1>
                    </Reveal>
                    <Reveal delay={160}>
                        <p className="text-base font-medium text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
                            Bienvenue sur VitaMarket. Votre confiance est au cœur de notre engagement pour une consommation durable. Nous avons conçu ce document pour être transparent, lisible et respectueux de votre vie privée.
                        </p>
                    </Reveal>
                </header>

                {/* ── Highlight bento ── */}
                <Reveal>
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                        {/* Security card */}
                        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary text-2xl">shield</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-2">Sécurité des Données</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Toutes vos transactions et informations personnelles sont chiffrées selon les standards de sécurité les plus élevés. Nous ne vendons jamais vos données à des tiers.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Engagement card */}
                        <div className="bg-primary p-8 rounded-xl flex flex-col justify-between">
                            <span
                                className="material-symbols-outlined text-slate-900 text-4xl"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                eco
                            </span>
                            <div className="mt-4">
                                <h3 className="text-lg font-extrabold text-slate-900 mb-2">Engagement VitaMarket</h3>
                                <p className="text-sm text-slate-900/70 leading-relaxed">
                                    Promouvoir une consommation responsable et locale tout en protégeant vos droits numériques.
                                </p>
                            </div>
                        </div>
                    </section>
                </Reveal>

                {/* ── Main content grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Sticky TOC sidebar */}
                    <aside className="hidden lg:block lg:col-span-3 sticky top-28 h-fit">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-5">
                            Sommaire
                        </p>
                        <ul className="space-y-2">
                            {TOC.map(({ href, label }) => {
                                const id = href.replace('#', '')
                                const isActive = activeSection === id
                                return (
                                    <li key={href}>
                                        <a
                                            href={href}
                                            className={`flex items-center gap-2.5 text-sm font-semibold py-1.5 transition-colors ${isActive
                                                ? 'text-primary'
                                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${isActive ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`} />
                                            {label}
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>


                    </aside>

                    {/* ── Legal sections ── */}
                    <div className="lg:col-span-9 space-y-24">

                        {/* 01 — ToS */}
                        <section id="tos" className="scroll-mt-28">
                            <SectionHeader num="01" title="Conditions Générales de Service" />
                            <Reveal delay={80}>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                                    L'utilisation du site VitaMarket implique l'acceptation pleine et entière des conditions générales d'utilisation ci-après décrites. Ces conditions d'utilisation sont susceptibles d'être modifiées ou complétées à tout moment, les utilisateurs du site sont donc invités à les consulter de manière régulière.
                                </p>
                            </Reveal>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    {
                                        title: 'Accès au Service',
                                        desc: "L'accès à VitaMarket est gratuit pour tout utilisateur disposant d'un accès à internet. Tous les coûts afférents à l'accès au service sont exclusivement à la charge de l'utilisateur.",
                                        delay: 0,
                                    },
                                    {
                                        title: 'Propriété Intellectuelle',
                                        desc: "VitaMarket est propriétaire des droits de propriété intellectuelle ou détient les droits d'usage sur tous les éléments accessibles sur le site, notamment les textes, images, graphismes, logo.",
                                        delay: 100,
                                    },
                                ].map(({ title, desc, delay }) => (
                                    <Reveal key={title} delay={delay}>
                                        <div className="border-l-4 border-primary pl-6 py-1">
                                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mb-2">{title}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </section>

                        {/* 02 — Privacy */}
                        <section id="privacy" className="scroll-mt-28">
                            <SectionHeader num="02" title="Politique de Confidentialité" />
                            <Reveal delay={80}>
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 rounded-xl mb-7 space-y-5">
                                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mb-1">
                                        Quelles données collectons-nous ?
                                    </h3>
                                    <DataItem
                                        icon="person"
                                        label="Identité"
                                        desc="Nom, prénom et informations de contact pour le traitement de vos commandes."
                                    />
                                    <DataItem
                                        icon="location_on"
                                        label="Localisation"
                                        desc='Adresse de livraison pour la logistique du "dernier kilomètre" écologique.'
                                    />
                                    <DataItem
                                        icon="shopping_basket"
                                        label="Préférences"
                                        desc="Historique d'achat pour personnaliser vos recommandations de produits de saison."
                                    />
                                </div>
                            </Reveal>
                            <Reveal delay={160}>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Nous nous engageons à ce que la collecte et le traitement de vos données soient conformes au règlement général sur la protection des données (RGPD). Chaque formulaire limite la collecte des données personnelles au strict nécessaire.
                                </p>
                            </Reveal>
                        </section>

                        {/* 03 — Data Protection */}
                        <section id="data" className="scroll-mt-28">
                            <SectionHeader num="03" title="Protection des Données" />
                            <Reveal delay={80}>
                                <div className="relative h-64 w-full rounded-xl overflow-hidden mb-8">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCdZT0wNskH22mOLCAZrP1vlcUn4i1Sz6dOiMMOVWMYbXPmz_VWGGldgEZ-4iNF4kkWzXLXqneE2WbmuheXTQ14y-HmR0i8LciSPFqXb82J6-HTWqBSZvvFgYl499PJP2jrynMFGFfppI5gYhBQMt9NvlGEPzwdkqPcUFympsaEOIgGF9yoidV8LcCtbVNeFo1op0cg8lZ1KnUpyamYG7ZakaK0HJh7jg0TP9QytWf-oa7ojHLeBDNG58DVx1STQav4lDPg48jJJK_"
                                        alt="Sécurité des données"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/800x300?text=Data+Security' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-7">
                                        <p className="text-white font-extrabold text-base">Votre sécurité est notre priorité absolue.</p>
                                    </div>
                                </div>
                            </Reveal>
                            <Reveal delay={160}>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                    VitaMarket met en œuvre toutes les mesures techniques et organisationnelles nécessaires pour assurer la sécurité de vos données personnelles et prévenir tout accès non autorisé, perte, destruction ou altération.
                                </p>
                            </Reveal>
                        </section>

                        {/* 04 — Responsibilities */}
                        <section id="responsibilities" className="scroll-mt-28">
                            <SectionHeader num="04" title="Responsabilités de l'Utilisateur" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <RespCard
                                    icon="key"
                                    title="Confidentialité"
                                    desc="L'utilisateur est responsable du maintien de la confidentialité de son compte et de son mot de passe."
                                    delay={0}
                                />
                                <RespCard
                                    icon="verified_user"
                                    title="Exactitude"
                                    desc="Les informations fournies lors de la création du compte doivent être exactes et complètes."
                                    delay={100}
                                />
                                <RespCard
                                    icon="gavel"
                                    title="Usage Légal"
                                    desc="Le site ne doit être utilisé qu'à des fins légales et conformément aux présentes CGU."
                                    delay={200}
                                />
                            </div>
                        </section>



                    </div>
                </div>
            </main>


        </div>
    )
}