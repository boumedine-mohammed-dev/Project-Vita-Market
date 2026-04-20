import Link from "next/link"

const specialties = [
  {
    image: 'https://res.cloudinary.com/dspmgbmfb/image/upload/q_auto/f_auto/v1776426413/2_sbhm27.png',
    tag: 'Nouveautés',
    title: 'Nouveaux produits',
  },
  {
    image: 'https://res.cloudinary.com/dspmgbmfb/image/upload/q_auto/f_auto/v1776426413/3_qwpwtx.png',
    tag: 'Meilleures ventes',
    title: 'Produits les plus vendus',
  },
  {
    image: 'https://res.cloudinary.com/dspmgbmfb/image/upload/q_auto/f_auto/v1776426413/1_h1anuk.png',
    tag: 'Les mieux notés',
    title: 'Produits les mieux notés',
  },
]

export default function LocalSpecialties() {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8">Nos collections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {specialties.map(({ image, tag, title }) => (
          <Link href={`/products?tag=${encodeURIComponent(tag)}`} key={title} className="relative h-64 rounded-3xl overflow-hidden group cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${image}')` }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-xs font-bold uppercase tracking-widest mb-1">{tag}</p>
              <h4 className="text-2xl font-black">{title}</h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
