import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCategorias, getProductos } from '../lib/api';

export default function Header(){
  const [cats, setCats] = useState<{ id:string; nombre:string }[]>([]);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState('');
  const [sugs, setSugs] = useState<{ id:string; nombre:string }[]>([]);

  useEffect(() => { getCategorias().then(list => setCats(list.filter(c=>c.id!=='todos'))).catch(()=>{}); }, []);
  useEffect(() => { const t = setTimeout(async () => {
    if (q.trim().length < 2){ setSugs([]); return; }
    try{ const list = await getProductos(selected || undefined); setSugs(list.filter(p => (p.nombre||'').toLowerCase().includes(q.toLowerCase())).slice(0,8)); }catch{ setSugs([]); }
  }, 200); return () => clearTimeout(t); }, [q, selected]);

  return (
    <header className="header">
      <div className="container header-inner">
        <Link className="brand" href="/">Rossy Resina</Link>
        <nav className="nav">
          {cats.map(c => <Link key={c.id} href={`/categoria/${encodeURIComponent(c.id)}`}>{c.nombre}</Link>)}
        </nav>
        <div style={{ position:'relative' }}>
          <div className="search">
            <button onClick={()=>setOpen(!open)} type="button">{cats.find(c=>c.id===selected)?.nombre || 'Todos los departamentos'} ▾</button>
            <input placeholder="Buscar artículo..." value={q} onChange={e=>setQ(e.target.value)} />
            <Link href={q?`/categoria/${selected || 'todos'}?q=${encodeURIComponent(q)}`:'/'}>Buscar</Link>
          </div>
          {open && (
            <div className="suggest" style={{ width:220 }}>
              {cats.map(c => <button key={c.id} onClick={()=>{ setSelected(c.id); setOpen(false); }}>{c.nombre}</button>)}
            </div>
          )}
          {sugs.length>0 && (
            <div className="suggest">
              {sugs.map(s => <Link key={s.id} href={`/product/${encodeURIComponent(s.id)}`}>{s.nombre}</Link>)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
