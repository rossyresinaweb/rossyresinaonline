import { GetServerSideProps } from 'next';
import Header from '../../components/Header';
import ProductCard from '../../components/ProductCard';
import { getProductos, Product } from '../../lib/api';

export default function CategoryPage({ productos, nombre }: { productos: Product[]; nombre: string }){
  return (
    <div>
      <Header />
      <main className="container" style={{ padding:'16px 0' }}>
        <h2>{nombre}</h2>
        <div className="grid">
          {productos.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  const id = String(params?.id || '');
  const q = String(query?.q || '').toLowerCase();
  try{
    let list = await getProductos(id);
    if (q) list = list.filter(p => (p.nombre||'').toLowerCase().includes(q));
    const nombre = id.replace(/[-_]/g,' ').replace(/\b\w/g, m=>m.toUpperCase());
    return { props: { productos: list, nombre } };
  }catch{
    return { props: { productos: [], nombre: id } };
  }
}
