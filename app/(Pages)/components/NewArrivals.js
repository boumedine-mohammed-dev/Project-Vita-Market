'use client'
import { useClientStore } from "@/app/Store/useClientStore";
import { useEffect } from "react";

function ArrivalCard({ url, nom, prix }) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <div
        className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-900 bg-cover bg-center flex-shrink-0"
        style={{ backgroundImage: `url('${url}')` }}
      />
      <div>
        <h4 className="font-bold leading-tight">{nom}</h4>
        <p className="text-primary font-black mt-1">{prix}</p>
        <button className="mt-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1 uppercase">
          Quick Add <span className="material-symbols-outlined text-xs">add</span>
        </button>
      </div>
    </div>
  )
}

export default function NewArrivalsAndPromo() {
  const { products, fetchProducts } = useClientStore();

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <section className="mb-16">
      {/* New Arrivals */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Nouveautés</h2>
          <a className="text-sm font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest" href="#">
            Découvrez les nouveaux articles
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.filter((item) => item.tag === "NEW_ARRIVAL").slice(0, 6).map((item, index) => (
            <ArrivalCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
