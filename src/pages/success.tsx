import { resetCart } from "@/store/nextSlice";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
const SuccessPage = () => {
  const dispatch = useDispatch();
  return (
    <div className="min-h-[60vh] flex flex-col gap-4 items-center justify-center py-20 bg-gradient-to-b from-gray-100 to-transparent">
      <h1 className="text-3xl md:text-4xl text-amazon_blue font-semibold text-center">
        Gracias por comprar en Rossy Resina
      </h1>
      <p className="text-gray-600">Tu pedido se está procesando. Te enviaremos la confirmación al correo.</p>
      <Link
        className="px-6 py-3 rounded-md bg-amazon_blue text-white hover:bg-amazon_yellow hover:text-black duration-200"
        href={"/"}
        onClick={() => dispatch(resetCart())}
      >
        Seguir comprando
      </Link>
    </div>
  );
};

export default SuccessPage;
