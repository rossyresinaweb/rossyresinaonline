import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import path from "path";

type Post = { slug: string; title: string; author: string; date: string; comments: number; excerpt: string; video?: string };
interface Props { posts: Post[] }

export default function BlogVideoFormat({ posts }: Props) {
  const onlyVideo = posts.filter((p: any) => Boolean((p as any).video));
  const list = onlyVideo.length ? onlyVideo : posts;
  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      <Head><title>Rossy Resina — Blog formato video</title></Head>
      <nav className="text-sm text-gray-600 mb-4">
        <Link className="hover:underline" href="/">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-800">Blog · video</span>
      </nav>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((p) => (
          <article key={p.slug} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5">
              <h2 className="text-lg md:text-xl font-semibold text-amazon_blue"><Link href={`/blog/${p.slug}`} className="hover:text-brand_teal hover:underline">{p.title}</Link></h2>
              <p className="mt-2 text-gray-700 line-clamp-3">{p.excerpt}</p>
              {(p as any).video ? (
                <video controls className="mt-3 w-full"><source src={(p as any).video} /></video>
              ) : null}
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
