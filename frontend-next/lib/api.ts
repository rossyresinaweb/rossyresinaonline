export async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(path, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error('error');
  return res.json() as Promise<T>;
}

export type Product = {
  id: string;
  nombre: string;
  precio: number;
  categoria?: string | null;
  descripcion?: string | null;
  imagen?: string | null;
};

export type Categoria = { id: string; nombre: string };

export async function getProductos(categoria?: string): Promise<Product[]> {
  const q = categoria ? `?categoria=${encodeURIComponent(categoria)}` : '';
  return fetchJSON<Product[]>(`/api/productos${q}`);
}

export async function getProducto(id: string): Promise<Product> {
  return fetchJSON<Product>(`/api/productos/${encodeURIComponent(id)}`);
}

export async function getCategorias(): Promise<Categoria[]> {
  return fetchJSON<Categoria[]>(`/api/categorias`);
}
