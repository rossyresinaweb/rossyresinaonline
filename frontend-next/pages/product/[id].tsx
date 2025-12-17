import { GetServerSideProps } from 'next';
import Header from '../../components/Header';
import { getProducto, Product } from '../../lib/api';

export default function ProductPage({ p }: { p: Product | null }){
  if (!p) return <div><Header /><main className="container"><p>Producto no encontrado</p></main></div>;
  return (
    <div>
      <Header />
      <main className="container" style={{ padding:'16px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <img src={p.imagen || '/api/imagenes/logo-principal.ico'} alt={p.nombre} style={{ width:'100%', height:360, objectFit:'cover' }} />
        <div>
          <h1>{p.nombre}</h1>
          <div style={{ fontSize:24, margin:'12px 0' }}>S/. {Number(p.precio).toFixed(2)}</div>
          <p>{p.descripcion}</p>
          <button onClick={() => {
            try{ const cart = JSON.parse(localStorage.getItem('cart') || '[]'); cart.push(p); localStorage.setItem('cart', JSON.stringify(cart)); alert('Agregado al carrito'); }catch{}
          }}>Agregar al carrito</button>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = String(params?.id || '');
  try{ const p = await getProducto(id); return { props: { p } }; }catch{ return { props: { p: null } }; }
}
