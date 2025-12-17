import Link from 'next/link';
import type { Product } from '../lib/api';

export default function ProductCard({ p }: { p: Product }){
  return (
    <div className="card">
      <Link href={`/product/${encodeURIComponent(p.id)}`}>
        <img src={p.imagen || '/api/imagenes/logo-principal.ico'} alt={p.nombre} />
      </Link>
      <div className="body">
        <h4 style={{ margin:'6px 0' }}><Link href={`/product/${encodeURIComponent(p.id)}`}>{p.nombre}</Link></h4>
        <div>S/. {Number(p.precio).toFixed(2)}</div>
        <button style={{ marginTop:8 }} onClick={() => {
          try{
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart.push(p);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Agregado al carrito');
          }catch{}
        }}>Agregar al carrito</button>
      </div>
    </div>
  );
}
