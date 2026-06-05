import { useState, useEffect } from 'react'
import RecetaCard from '../components/RecetaCard'
import { recetasService } from '../services/api'

const CATEGORIAS = ['Todas', 'Desayuno', 'Almuerzo', 'Cena', 'Postre', 'Merienda', 'Bebida', 'Otro']
const DIFICULTADES = ['Todas', 'Fácil', 'Media', 'Difícil']

export default function Inicio() {
  const [recetas, setRecetas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [dificultad, setDificultad] = useState('Todas')

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecetas()
    }, 300)
    return () => clearTimeout(timer)
  }, [busqueda, categoria, dificultad])

  const fetchRecetas = async () => {
    try {
      setLoading(true)
      const params = {}
      if (busqueda) params.q = busqueda
      if (categoria !== 'Todas') params.categoria = categoria
      if (dificultad !== 'Todas') params.dificultad = dificultad
      const data = await recetasService.listar(params)
      setRecetas(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 40, padding: '20px 0' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 700,
          marginBottom: 12,
          color: 'var(--text-dark)',
        }}>
          Descubre recetas increíbles
        </h1>
        <p style={{ color: 'var(--text-mid)', fontSize: 17, marginBottom: 28 }}>
          Explora, comparte y comenta las mejores recetas de la comunidad
        </p>

        {/* Search bar */}
        <div style={{ maxWidth: 540, margin: '0 auto', position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔍</span>
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por título o etiqueta..."
            style={{ paddingLeft: 44, fontSize: 15, height: 48, borderRadius: 99 }}
          />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIAS.map(c => (
            <button
              key={c}
              onClick={() => setCategoria(c)}
              style={{
                padding: '6px 16px',
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 500,
                border: '1.5px solid',
                borderColor: categoria === c ? 'var(--accent)' : 'var(--border)',
                background: categoria === c ? 'var(--accent-light)' : 'transparent',
                color: categoria === c ? 'var(--accent)' : 'var(--text-mid)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >{c}</button>
          ))}
        </div>

        <select
          value={dificultad}
          onChange={e => setDificultad(e.target.value)}
          style={{ width: 'auto', minWidth: 130 }}
        >
          {DIFICULTADES.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Results */}
      {error && <p style={{ color: 'var(--red)', textAlign: 'center', padding: 40 }}>Error: {error}</p>}

      {loading ? (
        <div className="spinner" />
      ) : recetas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-light)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
          <p style={{ fontSize: 16 }}>No se encontraron recetas</p>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--text-light)', fontSize: 13, marginBottom: 20 }}>
            {recetas.length} receta{recetas.length !== 1 ? 's' : ''} encontrada{recetas.length !== 1 ? 's' : ''}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {recetas.map(r => <RecetaCard key={r._id} receta={r} />)}
          </div>
        </>
      )}
    </div>
  )
}
