'use client'
import Head from 'next/head'
import { useEffect, useState } from "react";
import Modal from '../../components/Modal'
import { useConfirmDialog } from '../../components/AlertDialog'

// Stats initializaton moved inside the component to react to data changes

const tableTabs = ['Tous les produits', 'En stock', "Faible stock", 'Rupture de stock']



export default function VendorProductsPage() {

    const [activeTab, setActiveTab] = useState('Tous les produits')
    const [showModal, setShowModal] = useState(false)
    const [products, setProducts] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [statsData, setStatsData] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { dialog, confirmAction } = useConfirmDialog();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:8000/products/", {
                    credentials: "include", // لإرسال الكوكيز / التوكن
                });
                const data = await res.json();
                console.log("data", data)
                const p = data.map((item) => {
                    return {
                        url: item.url,
                        nom: item.nom,
                        description: item.description,
                        id: item.id,
                        note_moyenne: item.note_moyenne,
                        category_name: item.category_name,
                        id_categorie: item.id_categorie,
                        status: item.quantite_stock > 10 ? "En stock" : item.quantite_stock > 0 ? "Faible stock" : "Rupture de stock",
                        statusColor: item.quantite_stock > 10 ? 'text-emerald-600 dark:text-emerald-400' : item.quantite_stock > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400',
                        dotColor: item.quantite_stock > 10 ? 'bg-emerald-500' : item.quantite_stock > 0 ? 'bg-amber-500' : 'bg-rose-500',
                        quantite_stock: item.quantite_stock,
                        prix: item.prix,
                        tag: item.tag,
                    }
                })
                setProducts(p);

                const enStock = p.filter(item => item.status === "En stock").length;
                const faibleStock = p.filter(item => item.status === "Faible stock" || item.status === "Rupture de stock").length;

                setStatsData([
                    { label: 'Total des produits', value: p.length.toString(), icon: 'inventory', iconColor: 'text-[#81e240]' },
                    { label: 'Alertes de stock bas', value: faibleStock.toString(), icon: 'warning', iconColor: 'text-amber-500', trendText: 'Attention requise', trendColor: 'text-amber-500' },
                    { label: 'Produits en stock', value: enStock.toString(), icon: 'visibility', iconColor: 'text-blue-500' },
                ]);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => activeTab === 'Tous les produits' || p.status === activeTab);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };
    const handleDelete = (id) => {
        confirmAction({
            title: 'Supprimer le produit',
            description: 'Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.',
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    const res = await fetch(`http://localhost:8000/products/${id}/`, {
                        method: "DELETE",
                        credentials: "include",
                    });
                    if (res.ok) {
                        setProducts(prev => prev.filter(p => p.id !== id));
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        });
    };
    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    return (
        <>
            <Head><title>Vendor Product Management Dashboard</title></Head>

            <div className="bg-[#f7f8f6] dark:bg-[#182111] font-display text-slate-900 dark:text-slate-100 min-h-screen">
                {/* Header */}

                <main className="flex flex-col flex-1 px-4 lg:px-20 py-8 max-w-[1440px] mx-auto w-full">
                    {/* Page Header */}
                    <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-black leading-tight tracking-tight">Inventaire des Produits</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base">Gérez votre catalogue, vos niveaux de stock et la disponibilité des produits.</p>
                        </div>
                        <button onClick={() => { setEditingProduct(null); setShowModal(true); setIsEditing(false); }} className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-[#81e240] text-slate-900 text-sm font-bold shadow-lg shadow-[#81e240]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            <span className="material-symbols-outlined">add_circle</span>
                            Ajouter un nouveau produit
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {statsData.map(({ label, value, icon, iconColor, trend, trendText, trendColor, trendIcon }) => (
                            <div key={label} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
                                    <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
                                </div>
                                <div className="flex items-baseline gap-3">
                                    <p className="text-3xl font-bold">{value}</p>
                                    {trend && (
                                        <span className={`text-sm font-bold flex items-center ${trendColor}`}>
                                            <span className="material-symbols-outlined text-xs">{trendIcon}</span> {trend}
                                        </span>
                                    )}
                                    {trendText && <span className={`text-sm font-medium ${trendColor}`}>{trendText}</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 overflow-x-auto">
                            {tableTabs.map((t, i) => (
                                <button key={i} onClick={() => setActiveTab(t)} className={`border-b-2 px-4 py-4 text-sm whitespace-nowrap ${t === activeTab ? 'border-[#81e240] text-[#81e240] font-bold' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'}`}>{t}</button>
                            ))}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                                        {['Produit', 'Catégorie', 'Statut', 'Stock', 'Prix', 'Actions'].map((h, i) => (
                                            <th key={h} className={`px-6 py-4 text-sm font-bold ${i === 5 ? 'text-slate-500 dark:text-slate-400 text-right' : 'text-slate-900 dark:text-slate-100'}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {paginatedProducts.map((p, index) => (
                                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 bg-cover bg-center" style={{ backgroundImage: `url('${p.url}')` }} />
                                                    <div>
                                                        <p className="text-sm font-bold">{p.nom}</p>

                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">{p.category_name}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`flex items-center gap-1.5 text-xs font-bold ${p.statusColor}`}>
                                                    <span className={`size-2 rounded-full ${p.dotColor}`} /> {p.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm font-medium">{p.quantite_stock} unités</td>
                                            <td className="px-6 py-4 text-sm font-bold">{p.prix} دج</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => { handleEdit(p); setIsEditing(true); }} className="p-2 text-slate-500 hover:text-[#81e240] transition-colors">
                                                        <span className="material-symbols-outlined text-xl">edit_note</span>
                                                    </button>
                                                    <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 flex justify-between items-center border-t border-slate-200 dark:border-slate-800">
                            <p className="text-xs text-slate-500 font-medium tracking-tight uppercase">
                                Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredProducts.length)} sur {filteredProducts.length}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Précédent
                                </button>

                                {getPageNumbers().map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={`px-3 py-1 rounded text-sm font-bold ${p === currentPage ? 'bg-[#81e240] text-slate-900' : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'}`}
                                    >
                                        {p}
                                    </button>
                                ))}

                                <button
                                    className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Suivant
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Modal */}

                <Modal showModal={showModal}
                    setShowModal={setShowModal}
                    product={editingProduct}
                    isEdit={isEditing}
                    refreshProducts={(newProduct, isEdit) => {
                        if (isEdit) {
                            setProducts(prev => prev.map(p => p.id === newProduct.id ? {
                                ...p,
                                ...newProduct,
                                status: newProduct.quantite_stock > 10 ? "En stock" : newProduct.quantite_stock > 0 ? "Faible stock" : "Rupture de stock",
                                statusColor: newProduct.quantite_stock > 10 ? 'text-emerald-600 dark:text-emerald-400' : newProduct.quantite_stock > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400',
                                dotColor: newProduct.quantite_stock > 10 ? 'bg-emerald-500' : newProduct.quantite_stock > 0 ? 'bg-amber-500' : 'bg-rose-500',
                            } : p));
                        } else {
                            setProducts(prev => [...prev, {
                                ...newProduct,
                                status: newProduct.quantite_stock > 10 ? "En stock" : newProduct.quantite_stock > 0 ? "Faible stock" : "Rupture de stock",
                                statusColor: newProduct.quantite_stock > 10 ? 'text-emerald-600 dark:text-emerald-400' : newProduct.quantite_stock > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400',
                                dotColor: newProduct.quantite_stock > 10 ? 'bg-emerald-500' : newProduct.quantite_stock > 0 ? 'bg-amber-500' : 'bg-rose-500',
                            }]);
                        }
                    }}
                />
                {dialog}
            </div>
        </>
    )
}
