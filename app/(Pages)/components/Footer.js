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
              Nous soutenons l’agriculture biologique à petite échelle et offrons aux communautés un accès à des produits locaux de la plus haute qualité depuis 2012.
            </p>
            <div className="flex gap-4">
              <a className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors group" href="#">
                <span className="material-symbols-outlined text-sm group-hover:text-white">public</span>
              </a>
              <a className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors group" href="#">
                <span className="material-symbols-outlined text-sm group-hover:text-white">favorite</span>
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h5 className="font-bold mb-6">Liens rapides</h5>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-primary" href="#">Tous les produits</a></li>
              <li><a className="hover:text-primary" href="#">Offres hebdomadaires</a></li>
              <li><a className="hover:text-primary" href="#">Devenir vendeur</a></li>
              <li><a className="hover:text-primary" href="#">Livraison & FAQ</a></li>
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h5 className="font-bold mb-6">Catégories</h5>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-primary" href="#">Légumes frais</a></li>
              <li><a className="hover:text-primary" href="#">Fruits du verger</a></li>
              <li><a className="hover:text-primary" href="#">Volaille biologique</a></li>
              <li><a className="hover:text-primary" href="#">Produits d’épicerie</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="font-bold mb-6">Notre newsletter</h5>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Recevez des recettes, des nouvelles des fermes et 10$ de réduction sur votre première commande.
            </p>
            <div className="flex gap-2">
              <input
                className="flex-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-sm focus:ring-2 focus:ring-primary"
                placeholder="Adresse e-mail"
                type="email"
              />
              <button className="px-4 py-2 bg-primary text-slate-900 font-bold rounded-xl text-sm">
                S’inscrire
              </button>
            </div>
          </div>
        </div>

        {/* Barre du bas */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
          <p>© 2026 VitaMarket. Tous droits réservés.</p>
          <div className="flex gap-8">
            <a className="hover:text-primary" href="#">Politique de confidentialité</a>
            <a className="hover:text-primary" href="#">Conditions d’utilisation</a>
          </div>
        </div>
      </div>
    </footer>
  )
}