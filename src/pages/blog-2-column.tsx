import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import path from "path";

type Post = { slug: string; title: string; author: string; date: string; comments: number; excerpt: string; image?: string };
interface Props { posts: Post[] }

export default function BlogTwoColumn({ posts }: Props) {
  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      <Head><title>Rossy Resina — Blog 2 columnas</title></Head>
      <nav className="text-sm text-gray-600 mb-4">
        <Link className="hover:underline" href="/">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-800">Blog · 2 columnas</span>
      </nav>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((p) => (
          <article key={p.slug} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {p.image ? (
              <div className="relative h-40"><img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover" /></div>
            ) : (
              <div className="h-40 bg-gradient-to-r from-brand_purple via-brand_pink to-brand_teal" />
            )}
            <div className="p-5">
              <h2 className="text-lg md:text-xl font-semibold text-amazon_blue"><Link href={`/blog/${p.slug}`} className="hover:text-brand_teal hover:underline">{p.title}</Link></h2>
              <div className="mt-1 text-sm text-gray-600 flex items-center gap-2"><span>{p.author}</span><span>·</span><span>{p.date}</span></div>
              <p className="mt-3 text-gray-700 line-clamp-3">{p.excerpt}</p>
            </div>
          </article>
        ))}
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

