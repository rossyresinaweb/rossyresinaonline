import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { StateProps } from "../../../type";

const TopBar = () => {
  const { data: session } = useSession();
  const { productData } = useSelector((state: StateProps) => state.next);
  

  return (
    <div className="w-full bg-gray-900 text-gray-200 text-xs">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {/* Left: account links */}
          <ul className="flex items-center gap-4">
            <li>
              {session ? (
                <Link href="/account" className="hover:text-white">Mi cuenta</Link>
              ) : (
                <Link href="/sign-in" className="hover:text-white">Iniciar sesión</Link>
              )}
            </li>
            <li>
              <Link href="/favorite" className="hover:text-white">Favoritos</Link>
            </li>
            <li className="hidden sm:block">
              <Link href="/cart" className="hover:text-white">Carrito ({productData?.length || 0})</Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-white">Checkout</Link>
            </li>
          </ul>

          <div className="flex items-center gap-4">
            <a href="https://wa.me/51966357648" target="_blank" rel="noopener noreferrer" className="hover:text-white">Línea de atención 966 357 648</a>
            <span className="hidden sm:inline">·</span>
            <Link href="/terms" className="hover:text-white">Términos y condiciones</Link>
            <Link href="/faq" className="hover:text-white">Preguntas frecuentes</Link>
            <Link href="/about-us" className="hover:text-white">Sobre nosotros</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
