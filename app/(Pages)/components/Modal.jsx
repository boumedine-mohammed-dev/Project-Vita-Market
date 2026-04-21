import { useAuthStore } from "@/app/Store/useAuthStore";
import { useEffect, useState } from "react";



export default function Modal({ showModal, setShowModal, product, isEdit }) {
    const { user } = useAuthStore()
    console.log("product", product)
    console.log("isEdit", isEdit)
    const [formData, setFormData] = useState({
        name: product?.nom || "",
        description: product?.description || "",
        price: product?.prix || "",
        stock: product?.quantite_stock || "",
        note_moyenne: product?.note_moyenne || "",
        category: product?.id_categorie || "",
        url: product?.url || "",
        tag: product?.tag || "",
    });
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.nom || "",
                description: product.description || "",
                price: product.prix || "",
                stock: product.quantite_stock || "",
                note_moyenne: product.note_moyenne || "",
                category: product?.id_categorie || "",
                url: product.url || "",
                tag: product.tag || "",
            });
        }
    }, [product]);
    console.log(user)
    const [categories, setCategories] = useState([])
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("http://localhost:8000/categories/")
                const data = await res.json()
                setCategories(data)
                console.log("oooooooo", data)
            } catch (err) {
                console.error(err)
            }
        }

        fetchCategories()
    }, [])
    const hnadleaddproduct = async (e) => {
        e.preventDefault();

        const data = new FormData();

        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("stock", formData.stock);
        data.append("category", formData.category);
        const data2 = new FormData();

        data2.append("nom", formData.name);
        data2.append("description", formData.description);
        data2.append("prix", formData.price);
        data2.append("quantite_stock", formData.stock);
        data2.append("id_categorie", formData.category);
        data2.append("tag", formData.tag);

        // ❗ image → لازم يتحول لـ url بعد upload
        data2.append("url", formData.url); // backend يعوضها

        // ❗ vendor (إذا مطلوب)
        data2.append("id_vendeur", user.id); // أو تحذفه في backend

        const res = await fetch("http://localhost:8000/products/", {
            method: "POST",
            credentials: "include",
            body: data2,
        });
        console.log(data2)
        const result = await res.json();
        console.log(result);
    };
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();

            data.append("nom", formData.name);
            data.append("description", formData.description);
            data.append("prix", formData.price);
            data.append("quantite_stock", formData.stock);
            data.append("id_categorie", formData.category);
            data.append("note_moyenne", formData.note_moyenne);
            data.append("tag", formData.tag);

            data.append("url", formData.url);


            const res = await fetch(`http://localhost:8000/products/${product.id}/`, {
                method: "PATCH",
                credentials: "include",
                body: data, // ❗ بدون headers
            });
            if (res.ok) {
                const updated = await res.json();
                console.log(updated)
                console.log("updated", updated);
                setShowModal(false);
            }

        } catch (err) {
            console.error(err);
        }
    };
    console.log(formData)
    return (
        (showModal && <div className="font-display fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                    <h3 className="text-xl font-black">Add New Product</h3>
                    <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form className="p-6 space-y-5" onSubmit={isEdit ? handleUpdate : hnadleaddproduct}>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Product Name</label>
                        <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="p-2 w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" placeholder="e.g. Ergonomic Office Chair" type="text" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Product Description</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="p-2 w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" placeholder="e.g. Ergonomic Office Chair" type="text" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Price ($)</label>
                            <input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="p-2 w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" placeholder="0.00" type="number" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Stock Level</label>
                            <input value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="p-2 w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" placeholder="Quantity" type="number" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Note moyenne</label>
                            <input value={formData.note_moyenne} onChange={(e) => setFormData({ ...formData, note_moyenne: e.target.value })} className="p-2 w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" placeholder="Note moyenne" max={5} min={0} type="number" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="p-2 w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500">
                            <option className="text-slate-900 dark:text-slate-100 ">Select a category</option>
                            {categories?.map((category, index) => (
                                <option key={index} value={category.id} className="text-slate-900 dark:text-slate-100">{category.nom} {category.categorie_parente ? "(" + category.categorie_parente + ")" : ""}</option>
                            ))}

                        </select>

                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tag</label>
                        <select value={formData.tag} onChange={(e) => setFormData({ ...formData, tag: e.target.value })} className="p-2 w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500">
                            <option className="text-slate-900 dark:text-slate-100 ">Select a tag</option>
                            {[{ "1": "MIEUX_NOTES", "2": "les mieux notes" }, { "1": "NOUVEAUTES", "2": "noveautes" }, { "1": "MEILLEURES_VENTES", "2": "meilleures ventes" }].map((tag, index) => (
                                <option key={index} value={tag["1"]}
                                    className="text-slate-900 dark:text-slate-100">{tag["2"]}</option>
                            ))}

                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Product Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 dark:border-slate-800 border-dashed rounded-lg bg-slate-50/50 dark:bg-slate-950/50 hover:bg-slate-100 transition-colors">
                            <div className="space-y-1 text-center">
                                <span className="material-symbols-outlined text-slate-400 text-3xl">upload_file</span>
                                <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                    <label className="relative cursor-pointer rounded-md font-bold text-[#81e240] hover:text-[#81e240]/80" htmlFor="file-upload">
                                        <span>Upload a file</span>
                                        {formData.url && (
                                            <img
                                                src={typeof formData.url === "string" ? formData.url : URL.createObjectURL(formData.url)}
                                                className="mt-3 h-20 rounded"
                                            />
                                        )}
                                        <input onChange={(e) =>
                                            setFormData({ ...formData, url: e.target.files[0] })
                                        } className="sr-only" id="file-upload" name="file-upload" type="file" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" type="button">Cancel</button>
                        <button className="flex-1 py-2.5 px-4 bg-[#81e240] text-slate-900 rounded-lg font-bold text-sm shadow-lg shadow-[#81e240]/20 hover:scale-[1.02] active:scale-[0.98] transition-all" type="submit"> {isEdit ? "Update Product" : "Create Product"}</button>
                    </div>
                </form>
            </div >
        </div >)
    )
}