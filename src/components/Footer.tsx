import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-blue-900 text-white">
      <div className="max-w-screen-2xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold">Rossy Resina</h3>
            <p className="mt-2 text-sm text-blue-100">Insumos y kits para resina epoxi, pigmentos, moldes y talleres en Perú.</p>
            <div className="mt-4 flex items-center gap-3">
              <a aria-label="Facebook" href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                <FaFacebook />
              </a>
              <a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                <FaInstagram />
              </a>
              <a aria-label="WhatsApp" href="https://wa.me/900000000" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                <FaWhatsapp />
              </a>
              <a aria-label="TikTok" href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                <FaTiktok />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Ayuda</h3>
            <ul className="mt-3 space-y-2 text-sm text-blue-100">
              <li><Link className="hover:underline" href="/faq">Preguntas frecuentes</Link></li>
              <li><Link className="hover:underline" href="/contact">Contacto</Link></li>
              <li><Link className="hover:underline" href="/checkout">Checkout</Link></li>
              <li><Link className="hover:underline" href="/cart">Carrito</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Categorías</h3>
            <ul className="mt-3 space-y-2 text-sm text-blue-100">
              <li><Link className="hover:underline" href="/categoria/resina">Resina</Link></li>
              <li><Link className="hover:underline" href="/categoria/moldes-de-silicona">Moldes de silicona</Link></li>
              <li><Link className="hover:underline" href="/categoria/pigmentos">Pigmentos</Link></li>
              <li><Link className="hover:underline" href="/categoria/accesorios">Accesorios</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Suscríbete</h3>
            <p className="mt-2 text-sm text-blue-100">Recibe novedades y promociones por correo.</p>
            <form className="mt-3 flex gap-2">
              <input type="email" placeholder="Tu correo" className="flex-1 px-3 py-2 rounded bg-white text-black placeholder:text-gray-500" />
              <button type="button" className="px-4 py-2 rounded bg-gradient-to-r from-brand_purple via-brand_pink to-brand_teal text-white hover:brightness-105">Enviar</button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between text-sm text-blue-100">
          <p>Todos los derechos reservados Rossy Resina Perú 2025</p>
          <div className="flex items-center gap-4">
            <Link className="hover:underline" href="/about-us">Sobre nosotros</Link>
            <Link className="hover:underline" href="/faq">Ayuda</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
