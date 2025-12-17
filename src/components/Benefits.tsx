import React from "react";

export default function Benefits() {
  return (
    <div className="max-w-screen-2xl mx-auto px-6 my-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg p-6 bg-white shadow border border-gray-200">
          <p className="text-lg font-semibold">🚚 Envío rápido</p>
          <p className="text-sm text-gray-700">Gratis desde S/ 120 · Desde S/ 10 en compras menores</p>
        </div>
        <div className="rounded-lg p-6 bg-white shadow border border-gray-200">
          <p className="text-lg font-semibold">💳 Pago seguro</p>
          <p className="text-sm text-gray-700">Yape y transferencia bancaria</p>
        </div>
        <div className="rounded-lg p-6 bg-white shadow border border-gray-200">
          <p className="text-lg font-semibold">🧪 Calidad y asesoría</p>
          <p className="text-sm text-gray-700">Te ayudamos a elegir la resina adecuada</p>
        </div>
      </div>
    </div>
  );
}

