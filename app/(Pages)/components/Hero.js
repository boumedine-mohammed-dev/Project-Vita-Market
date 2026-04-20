import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800 h-[500px] mb-12">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dspmgbmfb/image/upload/q_auto/f_auto/v1776366451/Gemini_Generated_Image_mdm00dmdm00dmdm0_kjayez.png')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      <div className="relative h-full flex flex-col justify-center px-12 lg:px-20 max-w-2xl text-white">
        <span className="bg-primary text-slate-900 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">
          De la ferme à la table
        </span>
        <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-[1.1]">
          Le goût le plus pur de la nature.
        </h1>
        <p className="text-lg text-slate-100 mb-8 leading-relaxed">
          Achetez auprès de plus de 200 agriculteurs biologiques locaux qui livrent des produits frais de saison directement à votre porte.
        </p>
        <div className="flex gap-4">
          <Link href="/products">
            <button className="cursor-pointer px-8 py-4 bg-primary text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform">
              Commencer vos achats
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
