import { useEffect, useState } from "react";

interface Product {
  _id: number;
  title: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  isNew: boolean;
  oldPrice: number;
  price: number;
}
interface Category { _id: number; name: string }

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [prodForm, setProdForm] = useState<any>({ title: "", brand: "Rossy Resina", category: "Resinas", description: "", image: "", isNew: true, oldPrice: 0, price: 0 });
  const [catForm, setCatForm] = useState<any>({ name: "" });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const [p, c] = await Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]);
    setProducts(p);
    setCategories(c);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveProduct = async () => {
    await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(prodForm) });
    setProdForm({ title: "", brand: "Rossy Resina", category: "Resinas", description: "", image: "", isNew: true, oldPrice: 0, price: 0 });
    load();
  };
  const deleteProduct = async (id: number) => { await fetch(`/api/products?_id=${id}`, { method: "DELETE" }); load(); };

  const addImage = async () => {
    if (!file) return;
    setUploading(true);
    const toDataUrl = (f: File) => new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = reject; r.readAsDataURL(f); });
    const dataUrl = await toDataUrl(file);
    const res = await fetch("/api/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name, data: dataUrl }) });
    const json = await res.json();
    setProdForm({ ...prodForm, image: json.url });
    setUploading(false);
  };

  const saveCategory = async () => {
    await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(catForm) });
    setCatForm({ name: "" });
    load();
  };
  const deleteCategory = async (id: number) => { await fetch(`/api/categories?_id=${id}`, { method: "DELETE" }); load(); };

  return (
    <div className="max-w-screen-2xl mx-auto p-6 grid gap-10">
      <h1 className="text-2xl font-semibold">Administrador</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <section className="grid gap-4">
            <h2 className="text-xl font-semibold">Productos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p._id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-gray-600">{p.category} · {p.brand}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => deleteProduct(p._id)} className="px-3 py-2 rounded-md bg-red-600 text-white">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 grid gap-2">
              <h3 className="font-semibold">Añadir producto</h3>
              <input className="rounded-md px-3 py-2" placeholder="Título" value={prodForm.title} onChange={(e) => setProdForm({ ...prodForm, title: e.target.value })} />
              <input className="rounded-md px-3 py-2" placeholder="Marca" value={prodForm.brand} onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })} />
              <input className="rounded-md px-3 py-2" placeholder="Categoría" value={prodForm.category} onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })} />
            <input className="rounded-md px-3 py-2" placeholder="Descripción" value={prodForm.description} onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })} />
            <input className="rounded-md px-3 py-2" placeholder="URL de imagen" value={prodForm.image} onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })} />
              <div className="flex items-center gap-2">
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <button type="button" onClick={addImage} disabled={uploading || !file} className="px-3 py-2 rounded-md bg-brand_teal text-white disabled:opacity-50">
                  {uploading ? "Subiendo..." : "Añadir"}
                </button>
                {prodForm.image && <span className="text-xs text-gray-600">{prodForm.image}</span>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" className="rounded-md px-3 py-2" placeholder="Precio anterior" value={prodForm.oldPrice} onChange={(e) => setProdForm({ ...prodForm, oldPrice: Number(e.target.value) })} />
                <input type="number" className="rounded-md px-3 py-2" placeholder="Precio" value={prodForm.price} onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })} />
              </div>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={prodForm.isNew} onChange={(e) => setProdForm({ ...prodForm, isNew: e.target.checked })} />
                <span>Nuevo</span>
              </label>
              <button onClick={saveProduct} className="px-4 py-2 rounded-md bg-amazon_blue text-white">Guardar</button>
            </div>
          </section>

          <section className="grid gap-4">
            <h2 className="text-xl font-semibold">Categorías</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div key={c._id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                  <p className="font-semibold">{c.name}</p>
                  <button onClick={() => deleteCategory(c._id)} className="px-3 py-2 rounded-md bg-red-600 text-white">Eliminar</button>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 grid gap-2">
              <h3 className="font-semibold">Añadir categoría</h3>
              <input className="rounded-md px-3 py-2" placeholder="Nombre" value={catForm.name} onChange={(e) => setCatForm({ name: e.target.value })} />
              <button onClick={saveCategory} className="px-4 py-2 rounded-md bg-amazon_blue text-white">Guardar</button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
