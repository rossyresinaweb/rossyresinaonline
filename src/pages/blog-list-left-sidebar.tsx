import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import path from "path";

type Post = { slug: string; title: string; author: string; date: string; comments: number; excerpt: string; image?: string };
interface Props { posts: Post[] }

export default function BlogListLeftSidebar({ posts }: Props) {
  const categories = [
    { href: "/categoria/resina", label: "Resina" },
    { href: "/categoria/moldes-de-silicona", label: "Moldes de silicona" },
    { href: "/categoria/pigmentos", label: "Pigmentos" },
    { href: "/categoria/accesorios", label: "Accesorios" },
  ];
  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      <Head><title>Rossy Resina — Blog listado con barra izquierda</title></Head>
      <nav className="text-sm text-gray-600 mb-4">
        <Link className="hover:underline" href="/">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-800">Blog · listado barra izquierda</span>
      </nav>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="grid gap-6 md:order-none order-last">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold">Categorías</h3>
            <ul className="mt-3 grid gap-2 text-sm">
              {categories.map((c) => (
                <li key={c.href}><Link href={c.href} className="px-2 py-1 rounded hover:bg-gray-100 inline-block hover:text-brand_teal">{c.label}</Link></li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="md:col-span-2 grid gap-6">
          {posts.map((p) => (
            <article key={p.slug} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex">
              {p.image ? (<div className="relative w-40 h-32 shrink-0"><img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover" /></div>) : (<div className="w-40 h-32 shrink-0 bg-gradient-to-r from-brand_purple via-brand_pink to-brand_teal" />)}
              <div className="p-4 flex-1">
                <h2 className="text-lg font-semibold text-amazon_blue"><Link href={`/blog/${p.slug}`} className="hover:text-brand_teal hover:underline">{p.title}</Link></h2>
                <p className="mt-2 text-gray-700 line-clamp-2">{p.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  try {
    const dataPath = path.join(process.cwd(), "src", "data", "blog.json");
    const raw = fs.readFileSync(dataPath, "utf-8");
    const posts = JSON.parse(raw);
    return { props: { posts } };
  } catch { return { props: { posts: [] } }; }
};
