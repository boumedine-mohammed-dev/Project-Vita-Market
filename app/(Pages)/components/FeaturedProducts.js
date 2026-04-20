'use client'
import { useClientStore } from "@/app/Store/useClientStore";
import Link from "next/link";
import { useEffect, useState } from "react"

function ProductCard({ id, category_name, url, seller_name, nom, prix, quantite_stock, note_moyenne, tag }) {
  const { increment, cart, syncCart } = useClientStore();
  const addToCart = async (productId) => {
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
  const cartQty = getCartQuantity(id);
  const isMaxed = cartQty >= quantite_stock;
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 group">
      <div className="relative aspect-square overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
          style={{ backgroundImage: `url('${url}')` }}
        />
        {quantite_stock <= 5 && quantite_stock > 0 && (
          <div className="absolute top-3 left-3 bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm">
            PRESQUE ÉPUISÉ
          </div>
        )}
        {quantite_stock === 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
            RUPTURE
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 text-[10px] font-bold px-2 py-1 rounded shadow-sm text-slate-700 dark:text-slate-200 uppercase tracking-wide">
          {tag}
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 uppercase tracking-wide">
          {seller_name}
        </p>
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{nom}</h3>
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={`material-symbols-outlined text-xs ${i < Math.round(parseFloat(note_moyenne)) ? "text-amber-400" : "text-slate-300"}`}
            >
              star
            </span>
          ))}
          <span className="text-[10px] text-slate-400 ml-1">
            ({parseFloat(note_moyenne).toFixed(1)})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-black text-primary">
            {parseFloat(prix).toLocaleString("fr-DZ")} <span className="text-sm font-normal text-slate-400">دج</span>
          </span>
          <button
            onClick={() => addToCart(id)}
            disabled={quantite_stock === 0 || isMaxed}
            className="w-10 h-10 bg-primary/10 hover:bg-primary text-primary hover:text-slate-900 rounded-full flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">add_shopping_cart</span>
          </button>
        </div>
        {isMaxed && quantite_stock > 0 && (
          <p className="text-[10px] text-red-500 mt-1 font-semibold">
            Quantité maximale atteinte dans le panier
          </p>
        )}
      </div>
    </div>
  )
}

export default function FeaturedProducts() {
  const { products } = useClientStore();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  useEffect(() => {
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    console.log("shuffled", shuffled)
    setFeaturedProducts(shuffled.slice(0, 4));
  }, [products]);
  console.log("products", products)

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Produits biologiques en vedette</h2>
          <p className="text-slate-500 dark:text-slate-400">Sélections soigneusement choisies pour un mode de vie sain</p>
        </div>
        <Link className="text-primary font-bold flex items-center gap-1 hover:underline" href="/products">
          Voir tout <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuredProducts.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  )
}