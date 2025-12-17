import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import path from "path";

type Post = { slug: string; title: string; author: string; date: string; comments: number; content: string[]; image?: string };
interface Props { post: Post | null; recent: Post[] }

export default function BlogDetailsLeft({ post, recent }: Props) {
  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      <Head><title>Rossy Resina — {post ? post.title : "Blog"}</title></Head>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="grid gap-6 md:order-none order-last">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold">Entradas recientes</h3>
            <ul className="mt-3 grid gap-3 text-sm">
              {recent.map((p) => (
                <li key={`recent-${p.slug}`} className="border-b border-gray-200 pb-2">
                  <Link href={`/blog/${p.slug}`} className="font-medium text-amazon_blue hover:underline hover:text-brand_teal">{p.title}</Link>
                  <p className="text-gray-600 mt-1">{p.date}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="md:col-span-2">
          {!post ? (
            <div className="bg-white rounded-lg p-6 border border-gray-200"><p>No hay entradas disponibles.</p></div>
          ) : (
            <article className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {post.image ? (<div className="relative h-48"><img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" /></div>) : (<div className="h-40 bg-gradient-to-r from-brand_purple via-brand_pink to-brand_teal" />)}
              <div className="p-5">
                <h1 className="text-2xl font-semibold text-amazon_blue">{post.title}</h1>
                <div className="mt-1 text-sm text-gray-600 flex items-center gap-3"><span>{post.author}</span><span>·</span><span>{post.date}</span></div>
                <div className="mt-4 grid gap-4 text-gray-800">{post.content.map((p, i) => (<p key={i}>{p}</p>))}</div>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx: any) => {
  try {
    const dataPath = path.join(process.cwd(), "src", "data", "blog.json");
    const raw = fs.readFileSync(dataPath, "utf-8");
    const items: Post[] = JSON.parse(raw);
    const qSlug = String(ctx.query.slug || "");
    const post = qSlug ? items.find((p) => String(p.slug) === qSlug) || null : (items[0] || null);
    const recent = items.filter((p) => !post || p.slug !== post.slug).slice(0, 3);
    return { props: { post, recent } };
  } catch { return { props: { post: null, recent: [] } }; }
};
