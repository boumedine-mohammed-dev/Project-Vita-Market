export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">eco</span>
              <span className="text-xl font-extrabold tracking-tight">
                Terra<span className="text-primary">Market</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Supporting small-scale organic agriculture and providing communities with access to the highest quality local food since 2012.
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

          {/* Quick Links */}
          <div>
            <h5 className="font-bold mb-6">Quick Links</h5>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-primary" href="#">Shop All Products</a></li>
              <li><a className="hover:text-primary" href="#">Weekly Bundles</a></li>
              <li><a className="hover:text-primary" href="#">Become a Vendor</a></li>
              <li><a className="hover:text-primary" href="#">Shipping &amp; FAQ</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="font-bold mb-6">Categories</h5>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-primary" href="#">Fresh Vegetables</a></li>
              <li><a className="hover:text-primary" href="#">Orchard Fruits</a></li>
              <li><a className="hover:text-primary" href="#">Organic Poultry</a></li>
              <li><a className="hover:text-primary" href="#">Pantry Essentials</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="font-bold mb-6">Our Newsletter</h5>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Get recipes, farm updates, and $10 off your first order.
            </p>
            <div className="flex gap-2">
              <input
                className="flex-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-sm focus:ring-2 focus:ring-primary"
                placeholder="Email address"
                type="email"
              />
              <button className="px-4 py-2 bg-primary text-slate-900 font-bold rounded-xl text-sm">Join</button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
          <p>© 2024 TerraMarket Marketplace. All organic rights reserved.</p>
          <div className="flex gap-8">
            <a className="hover:text-primary" href="#">Privacy Policy</a>
            <a className="hover:text-primary" href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
