import { GetServerSideProps } from 'next';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { getProductos, Product } from '../lib/api';

export default function Home({ productos }: { productos: Product[] }){
  return (
    <div>
      <Header />
      <main className="container" style={{ padding:'16px 0' }}>
        <h2>Productos</h2>
        <div className="grid">
          {productos.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try{
    const productos = await getProductos();
    return { props: { productos } };
  }catch{
    return { props: { productos: [] } };
  }
}
