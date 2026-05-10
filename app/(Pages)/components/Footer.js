import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-16 font-display">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Marque */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">eco</span>
              <span className="text-xl font-extrabold tracking-tight">
                Vita<span className="text-primary">Market</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">

              Nous offrons aux communautés un accès aux produits healthy de la plus haute qualité.

            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h5 className="font-bold mb-6">Liens rapides</h5>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><Link className="hover:text-primary" href="/products">Tous les produits</Link></li>
              <li><Link className="hover:text-primary" href="/cart">Panier</Link></li>
              <li><Link className="hover:text-primary" href="/vendezsurvitamarket">Devenir vendeur</Link></li>
              <li><Link className="hover:text-primary" href="/vendezsurvitamarket">FAQ</Link></li>

            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h5 className="font-bold mb-6">Catégories</h5>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-primary" href="/products?category=Sans Gluten">Sans Gluten</a></li>
              <li><a className="hover:text-primary" href="/products?category=Sans Lactose">Sans Lactose</a></li>
              <li><a className="hover:text-primary" href="/products?category=Sans Sucre">Sans Sucre</a></li>
              <li><a className="hover:text-primary" href="/products?category=Les Compléments">Les Compléments Alimentaires</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-bold mb-6">Contact</h5>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">phone</span><a className="hover:text-primary" href="tel:0658531595">06 58 53 15 95</a></li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">email</span><a className="hover:text-primary" href="mailto:marketvita42@gmail.com">marketvita42@gmail.com</a></li>
            </ul>
          </div>

        </div>

        {/* Barre du bas */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
          <p>© 2026 VitaMarket. Tous droits réservés.</p>
          <div className="flex gap-8">
            <a className="hover:text-primary" href="/cgu">Politique de confidentialité</a>
            <a className="hover:text-primary" href="/cgu">Conditions d’utilisation</a>
          </div>
        </div>
      </div>
    </footer>
  )
}