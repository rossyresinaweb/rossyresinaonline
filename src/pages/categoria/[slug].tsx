import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import path from "path";
import Products from "@/components/Products";
import type { ProductProps } from "../../../type";

const slugToCategory: Record<string, string> = {
  resina: "Resinas",
  "moldes-de-silicona": "Moldes de silicona",
  pigmentos: "Pigmentos",
  accesorios: "Accesorios",
  creaciones: "Creaciones",
  talleres: "Talleres",
};

interface Props {
  slug: string;
  label: string | null;
  items: ProductProps[];
}

export default function CategoryPage({ slug, label, items }: Props) {
  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      <Head>
        <title>Rossy Resina — {label || "Categoría"}</title>
      </Head>
      <div className="mb-6">
        <ul className="text-sm text-gray-600 flex items-center gap-2">
          <li>
            <Link href="/" className="hover:underline">Inicio</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/" className="hover:underline">Categorías</Link>
          </li>
          <li>/</li>
          <li className="text-gray-800">{label || slug}</li>
        </ul>
      </div>

      {label ? (
        <>
          <h1 className="text-2xl font-semibold mb-4">{label}</h1>
          {items.length > 0 ? (
            <Products productData={items} />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-700">No hay productos en esta categoría por ahora.</p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-700">Categoría no válida.</p>
          <div className="mt-4">
            <Link href="/" className="px-4 py-2 rounded-md bg-amazon_blue text-white hover:bg-amazon_yellow hover:text-black">Ir al inicio</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const slug: string = String(ctx.params.slug || "");
  const label = slugToCategory[slug] || null;
  try {
    const dataPath = path.join(process.cwd(), "src", "data", "products.json");
    const raw = fs.readFileSync(dataPath, "utf-8");
    const all: ProductProps[] = JSON.parse(raw);
    const items = label ? all.filter((p) => String(p.category).toLowerCase() === String(label).toLowerCase()) : [];
    items.sort((a, b) => {
      const ac = (a.code || "").toString();
      const bc = (b.code || "").toString();
      if (ac && bc) return ac.localeCompare(bc, undefined, { numeric: true, sensitivity: "base" });
      if (ac) return -1;
      if (bc) return 1;
      return (a._id || 0) - (b._id || 0);
    });
    return { props: { slug, label, items } };
  } catch (e) {
    return { props: { slug, label, items: [] } };
  }
};
