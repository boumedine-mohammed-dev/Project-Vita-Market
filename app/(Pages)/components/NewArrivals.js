'use client'
import { useAuthStore } from "@/app/Store/useAuthStore";
import { useClientStore } from "@/app/Store/useClientStore";
import Link from "next/link";
import { useEffect } from "react";

function ArrivalCard({ products, id, url, nom, prix, quantite_stock }) {
  const { syncCart, cart } = useClientStore();
  const addToCart = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const user = useAuthStore.getState().user;
    if (!user) {
      useClientStore.getState().addToCartLocal(product, 1);
      alert("Produit ajouté au panier (Invité) 🛒");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/panier/add_product/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produit: productId,
          quantite: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
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
  const cartQty = getCartQuantity(id);
  const isMaxed = cartQty >= quantite_stock;
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/products/${id}`}>
        <div
          className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-900 bg-cover bg-center flex-shrink-0"
          style={{ backgroundImage: `url('${url}')` }}
        />
      </Link>
      <div>
        <h4 className="font-bold leading-tight">{nom}</h4>
        <p className="text-primary font-black mt-1">{prix}</p>
        <button disabled={isMaxed || quantite_stock === 0} onClick={() => addToCart(id)} className="disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1 uppercase">
          Quick Add <span className="material-symbols-outlined text-xs">add</span>
        </button>
      </div>
      {isMaxed && quantite_stock > 0 && (
        <p className="text-[10px] text-red-500 mt-1 font-semibold">
          Quantité maximale atteinte dans le panier
        </p>
      )}
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
          <Link className="text-sm font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest" href="/products?tag=Nouveautés">
            Découvrez les nouveaux articles
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.filter((item) => item.tag === "NOUVEAUTES").slice(0, 6).map((item, index) => (
            <ArrivalCard key={index} {...item} products={products} />
          ))}
        </div>
      </div>
    </section>
  )
}
