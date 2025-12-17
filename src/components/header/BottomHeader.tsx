import { LuMenu } from "react-icons/lu";
import { StateProps } from "../../../type";
import { signOut } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "@/store/nextSlice";
import Link from "next/link";
import { useState } from "react";

const BottomHeader = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: StateProps) => state.next);
  const handleSignOut = () => {
    signOut();
    dispatch(removeUser());
  };
  const [open, setOpen] = useState(false);
  const [openPages, setOpenPages] = useState(false);
  const mega = [
    { title: "Moldes de silicona", slug: "moldes-de-silicona", items: ["Redondos", "Rectangulares", "Geométricos", "Letras y números", "Personalizados"] },
    { title: "Pigmentos", slug: "pigmentos", items: ["Líquidos", "En polvo", "Glitter", "Perlado"] },
    { title: "Accesorios", slug: "accesorios", items: ["Herramientas", "Bases", "Cadenas", "Anillas"] },
    { title: "Resina", slug: "resina", items: ["Epoxi", "UV", "Catalizador"] },
    { title: "Creaciones", slug: "creaciones", items: ["Joyas", "Llaveros", "Decoración", "Arte"] },
    { title: "Talleres", slug: "talleres", items: ["Principiantes", "Avanzados", "Fechas"] },
  ];
  return (
    <div className="w-full h-10 bg-gradient-to-r from-brand_purple to-brand_teal text-sm text-white px-4 flex items-center relative">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-1 h-8 px-2 cursor-pointer duration-300">
        <LuMenu className="text-xl" /> Todo
      </button>
      {open && (
        <div className="absolute top-10 left-0 right-0 bg-white text-black shadow-xl z-50" onMouseLeave={() => setOpen(false)}>
          <div className="max-w-screen-2xl mx-auto p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {mega.map((col) => (
              <div key={col.slug}>
                <Link href={`/categoria/${col.slug}`} className="font-semibold px-2 py-1 rounded hover:bg-gray-100 inline-block">
                  {col.title}
                </Link>
                <ul className="mt-2 text-sm text-gray-700 grid gap-1">
                  {col.items.map((it) => (
                    <li key={it}>
                      <Link href={`/categoria/${col.slug}`} className="px-2 py-1 rounded hover:bg-gray-100 inline-block" onClick={() => setOpen(false)}>
                        {it}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 md:col-span-3 lg:col-span-2 bg-gradient-to-r from-brand_purple to-brand_teal rounded-md p-6 text-white flex flex-col justify-center">
              <p className="text-lg font-semibold">Descubre nuevas resinas</p>
              <p className="text-sm opacity-90">Ofertas y novedades de la semana</p>
              <Link href="/categoria/resina" className="mt-4 inline-block px-4 py-2 rounded-md bg-white text-amazon_blue hover:bg-amazon_yellow hover:text-black" onClick={() => setOpen(false)}>
                Ver catálogo
              </Link>
            </div>
          </div>
        </div>
      )}
      <Link href="/" className="hidden md:inline-flex items-center h-8 px-2 cursor-pointer duration-300">Inicio</Link>
      <Link href="/categoria/talleres" className="hidden md:inline-flex items-center h-8 px-2 cursor-pointer duration-300">Capacítate</Link>
      <Link href="/categoria/resina" className="hidden md:inline-flex items-center h-8 px-2 cursor-pointer duration-300">Promoción</Link>
      <Link href="/categoria/creaciones" className="hidden md:inline-flex items-center h-8 px-2 cursor-pointer duration-300">Creaciones</Link>
      <Link href="/categoria/resina" className="hidden md:inline-flex items-center h-8 px-2 cursor-pointer duration-300">
        Resina
      </Link>
      <Link href="/categoria/moldes-de-silicona" className="hidden md:inline-flex items-center h-8 px-2 cursor-pointer duration-300">
        Moldes de silicona
      </Link>
      <Link href="/categoria/accesorios" className="hidden md:inline-flex items-center h-8 px-2 cursor-pointer duration-300">
        Accesorios
      </Link>
      <Link href="/categoria/pigmentos" className="hidden md:inline-flex items-center h-8 px-2 cursor-pointer duration-300">
        Pigmentos
      </Link>
      <Link href="/" className="hidden md:inline-flex items-center h-8 px-2 cursor-pointer duration-300">
        Novedades
        <span className="ml-2 px-2 py-0.5 text-xs rounded bg-amazon_yellow text-black hidden sm:inline">new</span>
      </Link>
      <Link href="/admin" className="hidden md:inline-flex items-center h-8 px-2 cursor-pointer duration-300">
        Vende
      </Link>
      <div className="hidden md:inline-flex items-center h-8 px-2 cursor-pointer duration-300 relative" onMouseLeave={() => setOpenPages(false)}>
        <button onClick={() => setOpenPages((v) => !v)} className="inline-flex items-center gap-1">
          Explorar
        </button>
        {openPages && (
          <div className="absolute top-8 left-0 bg-white text-black rounded-md shadow-lg p-3 w-64 z-50">
            <ul className="text-sm grid gap-1">
              <li>
                <Link href="/" className="px-2 py-1 rounded hover:bg-gray-100" onClick={() => setOpenPages(false)}>Inicio</Link>
              </li>
              <li>
                <Link href="/blog" className="px-2 py-1 rounded hover:bg-gray-100" onClick={() => setOpenPages(false)}>Blog</Link>
              </li>
              <li>
                <Link href="/faq" className="px-2 py-1 rounded hover:bg-gray-100" onClick={() => setOpenPages(false)}>Preguntas frecuentes</Link>
              </li>
              <li>
                <Link href="/about-us" className="px-2 py-1 rounded hover:bg-gray-100" onClick={() => setOpenPages(false)}>Sobre nosotros</Link>
              </li>
              <li>
                <Link href="/contact" className="px-2 py-1 rounded hover:bg-gray-100" onClick={() => setOpenPages(false)}>Contacto</Link>
              </li>
              <li>
                <Link href="/cart" className="px-2 py-1 rounded hover:bg-gray-100" onClick={() => setOpenPages(false)}>Carrito</Link>
              </li>
              <li>
                <Link href="/favorite" className="px-2 py-1 rounded hover:bg-gray-100" onClick={() => setOpenPages(false)}>Favoritos</Link>
              </li>
              <li>
                <Link href="/compare" className="px-2 py-1 rounded hover:bg-gray-100" onClick={() => setOpenPages(false)}>Comparar productos</Link>
              </li>
              <li className="mt-2 px-2 text-xs text-gray-700 font-semibold">Categorías</li>
              <li>
                <Link href="/categoria/moldes-de-silicona" className="px-2 py-1 rounded hover:bg-gray-100" onClick={() => setOpenPages(false)}>Moldes de silicona</Link>
              </li>
              <li>
                <Link href="/categoria/pigmentos" className="px-2 py-1 rounded hover:bg-gray-100" onClick={() => setOpenPages(false)}>Pigmentos</Link>
              </li>
              <li>
                <Link href="/categoria/accesorios" className="px-2 py-1 rounded hover:bg-gray-100" onClick={() => setOpenPages(false)}>Accesorios</Link>
              </li>
              <li>
                <Link href="/categoria/resina" className="px-2 py-1 rounded hover:bg-gray-100" onClick={() => setOpenPages(false)}>Resina</Link>
              </li>
              <li>
                <Link href="/categoria/creaciones" className="px-2 py-1 rounded hover:bg-gray-100" onClick={() => setOpenPages(false)}>Creaciones</Link>
              </li>
              <li>
                <Link href="/categoria/talleres" className="px-2 py-1 rounded hover:bg-gray-100" onClick={() => setOpenPages(false)}>Talleres</Link>
              </li>
              <li className="mt-2">
                <Link href="/admin" className="px-2 py-1 rounded hover:bg-gray-100" onClick={() => setOpenPages(false)}>Admin</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
      <Link href="/blog" className="hidden md:inline-flex items-center h-8 px-2 cursor-pointer duration-300">
        Blog
      </Link>
      <div className="ml-auto" />
      {userInfo && (
        <button
          onClick={handleSignOut}
          className="hidden md:inline-flex items-center h-8 px-2 text-amazon_yellow cursor-pointer duration-300"
        >
          Cerrar sesión
        </button>
      )}
    </div>
  );
};

export default BottomHeader;
