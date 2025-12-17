import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import path from "path";

type Post = { slug: string; title: string; author: string; date: string; comments: number; content: string[]; image?: string };
interface Props { post: Post | null }

export default function BlogDetails({ post }: Props) {
  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      <Head><title>Rossy Resina — {post ? post.title : "Detalle de blog"}</title></Head>
      <nav className="text-sm text-gray-600 mb-4">
        <Link className="hover:underline" href="/">Inicio</Link>
        <span className="mx-2">/</span>
        <Link className="hover:underline" href="/blog">Blog</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-800">{post ? post.title : "Entrada"}</span>
      </nav>
      {!post ? (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p>No hay entradas disponibles.</p>
          <Link href="/blog" className="inline-block mt-3 px-4 py-2 rounded bg-gradient-to-r from-brand_purple via-brand_pink to-brand_teal text-white hover:brightness-105">Ir al blog</Link>
        </div>
      ) : (
        <article className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {post.image ? (
            <div className="relative h-48"><img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" /></div>
          ) : (
            <div className="h-40 bg-gradient-to-r from-brand_purple via-brand_pink to-brand_teal" />
          )}
          <div className="p-5">
            <h1 className="text-2xl font-semibold text-amazon_blue">{post.title}</h1>
            <div className="mt-1 text-sm text-gray-600 flex items-center gap-3"><span>{post.author}</span><span>·</span><span>{post.date}</span><span>·</span><span>{post.comments} comentarios</span></div>
            <div className="mt-4 grid gap-4 text-gray-800">
              {post.content.map((p, i) => (<p key={i}>{p}</p>))}
            </div>
          </div>
        </article>
      )}
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
    return { props: { post } };
  } catch { return { props: { post: null } }; }
};
