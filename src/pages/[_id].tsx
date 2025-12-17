import FormattedPrice from "@/components/FormattedPrice";
import { addToCart, addToFavorite } from "@/store/nextSlice";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { HiShoppingCart } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";

const DynamicPage = () => {
  const [product, setProduct] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [recs, setRecs] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!router.isReady) return;
    setProduct(router.query);
    setIsLoading(false);
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!product || !product.category) return;
    setLoadingRecs(true);
    fetch("/api/products")
      .then((r) => r.json())
      .then((all) => {
        const items = (all || [])
          .filter((p: any) => String(p.category) === String(product.category) && String(p._id) !== String(product._id))
          .slice(0, 4);
        setRecs(items);
        setLoadingRecs(false);
      })
      .catch(() => setLoadingRecs(false));
  }, [product]);

  const shippingText = useMemo(() => {
    const price = Number(product?.price) || 0;
    return price >= 120 ? "Envío Gratis" : "Envío desde S/ 10.00";
  }, [product]);

  const waHref = useMemo(() => {
    const title = product?.title || product?.code || "Producto";
    const price = Number(product?.price) || 0;
    const text = `Mira este producto: ${title} — S/ ${price.toFixed(2)}\n${product?.description || ""}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [product]);
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-10">
      {isLoading ? (
        <div className="w-full flex flex-col gap-6 items-center justify-center py-20">
          <p>Tu producto se está cargando...</p>
          <BeatLoader color="#131921" size={40} />
        </div>
      ) : (
        <>
          <nav className="text-sm text-gray-600 mb-3">
            <Link href="/" className="hover:underline">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href={`/categoria/${String(product.category).toLowerCase().includes("resina") ? "resina" : String(product.category).toLowerCase().replace(/\s+/g, "-")}`} className="hover:underline">{product.category}</Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-800">{product.title}</span>
          </nav>
          <div className="w-full grid md:grid-cols-3 gap-3 bg-gray-100 rounded-lg">
          <div className="flex items-center justify-center bg-gray-200 rounded-lg relative group overflow-hidden">
            <Image
              src={((): string => { const s = String(product.image || ""); let u = s.replace(/\\/g, "/"); if (/^https?:\/\//i.test(u)) return u; return u ? (u.startsWith("/") ? u : "/" + u) : "/favicon-96x96.png"; })()}
              alt="imagen del producto"
              width={500}
              height={500}
            />
            <div className="w-12 h-24 absolute bottom-10 right-0 border-[1px] border-gray-400 bg-white rounded-md flex flex-col translate-x-20 group-hover:-translate-x-2 transition-transform duration-300">
              <span
                onClick={() =>
                  dispatch(
                    addToCart({
                      _id: product._id,
                      brand: product.brand,
                      category: product.category,
                      description: product.description,
                      image: product.image,
                      isNew: product.isNew,
                      oldPrice: product.oldPrice,
                      price: product.price,
                      title: product.title,
                      quantity: 1,
                    })
                  )
                }
                className="w-full h-full border-b-[1px] border-b-gray-400 flex items-center justify-center text-xl bg-transparent hover:bg-brand_teal cursor-pointer duration-300"
              >
                <HiShoppingCart />
              </span>
              <span
                onClick={() =>
                  dispatch(
                    addToFavorite({
                      _id: product._id,
                      brand: product.brand,
                      category: product.category,
                      description: product.description,
                      image: product.image,
                      isNew: product.isNew,
                      oldPrice: product.oldPrice,
                      price: product.price,
                      title: product.title,
                      quantity: 1,
                    })
                  )
                }
                className="w-full h-full border-b-[1px] border-b-gray-400 flex items-center justify-center text-xl bg-transparent hover:bg-brand_teal cursor-pointer duration-300"
              >
                <FaHeart />
              </span>
            </div>
          </div>
          {product?.description && (
            <div className="mt-3 text-sm text-gray-700 md:col-span-1">
              {product.description}
            </div>
          )}
          <div className="md:col-span-2 flex flex-col gap-3 justify-center p-4">
            <p className="text-xs md:text-sm text-amazon_blue font-semibold -mb-3">
              {product.category}_{product.brand}
            </p>
            <h1 className="text-xl md:text-3xl tracking-wide font-semibold">
              {product.title || product.code || "Producto"}
            </h1>
            {product.code && (
              <p className="text-xs text-gray-500">Código: {product.code}</p>
            )}
            <div>
              <p className="text-base text-gray-600 flex items-center gap-1">
                Precio:
                <span className="text-lg text-amazon_blue font-semibold">
                  <FormattedPrice amount={Number(product.price) || 0} />
                </span>
                {typeof product.oldPrice === "number" && product.oldPrice > product.price && (
                  <span className="ml-1 line-through">
                    <FormattedPrice amount={Number(product.oldPrice) || 0} />
                  </span>
                )}
              </p>
              {typeof product.oldPrice === "number" && product.oldPrice > product.price && (
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  Tu ahorro: {" "}
                  <span>
                    <FormattedPrice amount={(Number(product.oldPrice) || 0) - (Number(product.price) || 0)} />
                  </span>
                </p>
              )}
              <p className="text-sm text-gray-700 mt-1">{shippingText}</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center justify-between border border-gray-300 px-3 py-1 rounded-full w-28 shadow">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-lg">-</button>
                  <span className="font-semibold">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="text-lg">+</button>
                </div>
                <a href={waHref} target="_blank" rel="noreferrer" className="text-sm px-3 py-2 rounded border border-brand_green text-brand_green hover:bg-brand_green hover:text-white">Compartir por WhatsApp</a>
              </div>
              <button
                onClick={() =>
                  dispatch(
                    addToCart({
                      _id: product._id,
                      brand: product.brand,
                      category: product.category,
                      description: product.description,
                      image: product.image,
                      isNew: product.isNew,
                      oldPrice: product.oldPrice,
                      price: product.price,
                      title: product.title,
                      quantity: qty,
                    })
                  )
                }
                className="w-full md:w-96 h-12 rounded-lg mt-5 text-base font-semibold bg-gradient-to-r from-brand_purple via-brand_pink to-brand_teal text-white hover:brightness-105 duration-300"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Te puede interesar</h2>
          {loadingRecs ? (
            <div className="bg-white rounded-lg p-6">Cargando productos relacionados...</div>
          ) : recs.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recs.map((p) => (
                <Link key={p._id} href={{ pathname: `${p._id}`, query: { ...p } }} className="bg-white rounded-lg p-3 shadow hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <Image src={((): string => { const s = String(p.image || ""); let u = s.replace(/\\/g, "/"); if (/^https?:\/\//i.test(u)) return u; return u ? (u.startsWith("/") ? u : "/" + u) : "/favicon-96x96.png"; })()} alt={p.title} width={64} height={64} className="rounded object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{p.title}</p>
                      <p className="text-sm text-amazon_blue font-semibold"><FormattedPrice amount={p.price} /></p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">No hay productos relacionados.</div>
          )}
        </div>
        </>
      )}
    </div>
  );
};

export default DynamicPage;
