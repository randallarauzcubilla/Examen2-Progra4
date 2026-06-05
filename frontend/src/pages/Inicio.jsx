import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function Inicio() {
  const [recetas, setRecetas] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [dificultad, setDificultad] = useState('')

  const cargarRecetas = async () => {
    setLoading(true)
    try {
      const params = {}
      if (categoria) params.categoria = categoria
      if (dificultad) params.dificultad = dificultad
      if (busqueda) params.tags = busqueda
      const { data } = await api.get('/recetas', { params })
      setRecetas(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargarRecetas() }, [categoria, dificultad])

  const recetasFiltradas = recetas.filter(r =>
    r.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    (r.tags && r.tags.some(t => t.toLowerCase().includes(busqueda.toLowerCase())))
  )

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🍳 RecipeHub</h1>
        <div style={styles.nav}>
          <Link to="/nueva" style={styles.navBtn}>+ Nueva Receta</Link>
          <Link to="/perfil" style={styles.navLink}>Mi Perfil</Link>
          <Link to="/login" style={styles.navLink}>Login</Link>
        </div>
      </header>

      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>Descubrí recetas increíbles</h2>
        <input
          style={styles.search}
          placeholder="Buscar por título o tag..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <div style={styles.filters}>
          <select style={styles.select} value={categoria} onChange={e => setCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            <option>Desayuno</option>
            <option>Almuerzo</option>
            <option>Cena</option>
            <option>Postre</option>
            <option>Merienda</option>
          </select>
          <select style={styles.select} value={dificultad} onChange={e => setDificultad(e.target.value)}>
            <option value="">Toda dificultad</option>
            <option>Fácil</option>
            <option>Media</option>
            <option>Difícil</option>
          </select>
        </div>
      </div>

      <div style={styles.grid}>
        {loading && <p style={styles.msg}>Cargando recetas...</p>}
        {!loading && recetasFiltradas.length === 0 && <p style={styles.msg}>No hay recetas aún.</p>}
        {recetasFiltradas.map(r => (
          <Link to={`/recetas/${r._id}`} key={r._id} style={styles.cardLink}>
            <div style={styles.card}>
              <div style={styles.cardImg}>
                {r.imagenUrl
                  ? <img src={r.imagenUrl} alt={r.titulo} style={styles.img} />
                  : <div style={styles.imgPlaceholder}>🍽️</div>}
              </div>
              <div style={styles.cardBody}>
                <span style={styles.categoria}>{r.categoria}</span>
                <h3 style={styles.cardTitle}>{r.titulo}</h3>
                <p style={styles.cardDesc}>{r.descripcion}</p>
                <div style={styles.cardMeta}>
                  <span>⏱ {r.tiempoMin} min</span>
                  <span>👤 {r.autorId?.nombre}</span>
                  <span style={styles.dif}>{r.dificultad}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const styles = {
  page: { fontFamily: 'sans-serif', background: '#fafafa', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  logo: { margin: 0, color: '#e8540a' },
  nav: { display: 'flex', gap: '1rem', alignItems: 'center' },
  navBtn: { background: '#e8540a', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' },
  navLink: { color: '#555', textDecoration: 'none', fontWeight: '500' },
  hero: { background: 'linear-gradient(135deg, #e8540a, #ff8c42)', padding: '3rem 2rem', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: '2rem', marginBottom: '1rem' },
  search: { width: '100%', maxWidth: '500px', padding: '0.8rem 1rem', borderRadius: '30px', border: 'none', fontSize: '1rem', marginBottom: '1rem' },
  filters: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  select: { padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', fontSize: '1rem', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', padding: '2rem' },
  cardLink: { textDecoration: 'none', color: 'inherit' },
  card: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', transition: 'transform 0.2s', cursor: 'pointer' },
  cardImg: { height: '180px', overflow: 'hidden', background: '#f0f0f0' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  imgPlaceholder: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem' },
  cardBody: { padding: '1rem' },
  categoria: { background: '#fff3ed', color: '#e8540a', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  cardTitle: { margin: '0.5rem 0', color: '#222' },
  cardDesc: { color: '#666', fontSize: '0.9rem', marginBottom: '0.8rem' },
  cardMeta: { display: 'flex', gap: '0.8rem', fontSize: '0.85rem', color: '#888' },
  dif: { marginLeft: 'auto', fontWeight: '600', color: '#e8540a' },
  msg: { gridColumn: '1/-1', textAlign: 'center', color: '#888', fontSize: '1.1rem', padding: '3rem' },
}

export default Inicio