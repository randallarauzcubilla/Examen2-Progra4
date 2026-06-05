import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { recetasService, comentariosService } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Stars({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange && onChange(n)}
          style={{
            background: 'none', border: 'none', cursor: onChange ? 'pointer' : 'default',
            fontSize: 22, color: n <= value ? '#F59E0B' : '#D1D5DB', padding: 0,
          }}
        >★</button>
      ))}
    </div>
  )
}

export default function DetalleReceta() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [receta, setReceta] = useState(null)
  const [comentarios, setComentarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [comentarioTexto, setComentarioTexto] = useState('')
  const [calificacion, setCalificacion] = useState(5)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    Promise.all([
      recetasService.obtener(id),
      comentariosService.listar(id),
    ])
      .then(([r, c]) => { setReceta(r); setComentarios(c) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleEliminar = async () => {
    if (!confirm('¿Eliminar esta receta?')) return
    await recetasService.eliminar(id)
    navigate('/')
  }

  const handleComentario = async (e) => {
    e.preventDefault()
    if (!comentarioTexto.trim()) return
    try {
      setEnviando(true)
      const nuevo = await comentariosService.crear(id, comentarioTexto, calificacion)
      setComentarios(prev => [nuevo, ...prev])
      setComentarioTexto('')
      setCalificacion(5)
    } catch (e) {
      alert(e.message)
    } finally {
      setEnviando(false)
    }
  }

  const handleEliminarComentario = async (cId) => {
    if (!confirm('¿Eliminar este comentario?')) return
    await comentariosService.eliminar(cId)
    setComentarios(prev => prev.filter(c => c._id !== cId))
  }

  if (loading) return <div className="spinner" />
  if (error) return <p style={{ textAlign: 'center', padding: 60, color: 'var(--red)' }}>Error: {error}</p>
  if (!receta) return null

  const esAutor = user && (receta.autorId?._id === user._id || receta.autorId === user._id)

  const promedioStars = comentarios.length
    ? (comentarios.reduce((acc, c) => acc + c.calificacion, 0) / comentarios.length).toFixed(1)
    : null

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      {/* Breadcrumb */}
      <Link to="/" style={{ color: 'var(--text-mid)', fontSize: 13 }}>← Volver al inicio</Link>

      {/* Header */}
      <div style={{ marginTop: 20, marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <span className="badge badge-orange">{receta.categoria}</span>
          <span className={`badge ${receta.dificultad === 'Fácil' ? 'badge-green' : receta.dificultad === 'Difícil' ? 'badge-orange' : 'badge-yellow'}`}>
            {receta.dificultad}
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 38px)', marginBottom: 12 }}>
          {receta.titulo}
        </h1>

        <p style={{ color: 'var(--text-mid)', fontSize: 16, marginBottom: 16 }}>{receta.descripcion}</p>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 14, color: 'var(--text-mid)', marginBottom: 16 }}>
          <span>⏱ <strong>{receta.tiempoMin} min</strong></span>
          <span>👥 <strong>{receta.porciones} porciones</strong></span>
          {promedioStars && <span>⭐ <strong>{promedioStars}</strong> ({comentarios.length} reseñas)</span>}
          {receta.autorId && (
            <span>👨‍🍳 <strong>{receta.autorId.nombre || 'Usuario'}</strong></span>
          )}
        </div>

        {/* Tags */}
        {receta.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {receta.tags.map(t => (
              <span key={t} className="badge badge-gray">#{t}</span>
            ))}
          </div>
        )}

        {/* Author actions */}
        {esAutor && (
          <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
            <Link to={`/editar/${id}`} className="btn btn-secondary" style={{ fontSize: 13 }}>
              ✏️ Editar
            </Link>
            <button onClick={handleEliminar} className="btn btn-danger" style={{ fontSize: 13 }}>
              🗑️ Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Image */}
      {receta.imagenUrl && (
        <img
          src={receta.imagenUrl}
          alt={receta.titulo}
          style={{ width: '100%', height: 340, objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: 36 }}
        />
      )}

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 36 }}>
        {/* Ingredients */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 16 }}>Ingredientes</h2>
          <ul style={{ listStyle: 'none' }}>
            {receta.ingredientes?.map((ing, i) => (
              <li key={i} style={{
                padding: '10px 0',
                borderBottom: '1px solid var(--border)',
                fontSize: 14,
                display: 'flex',
                justifyContent: 'space-between',
                gap: 8,
              }}>
                <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{ing.nombre}</span>
                <span style={{ color: 'var(--text-mid)' }}>{ing.cantidad} {ing.unidad}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 16 }}>Preparación</h2>
          <ol style={{ listStyle: 'none' }}>
            {receta.pasos?.map((paso, i) => (
              <li key={i} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                <span style={{
                  minWidth: 32, height: 32, borderRadius: '50%',
                  background: 'var(--accent)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: 2,
                }}>{i + 1}</span>
                <p style={{ fontSize: 15, color: 'var(--text-dark)', lineHeight: 1.7 }}>{paso}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Comments */}
      <div style={{ marginTop: 48 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 24 }}>
          Comentarios ({comentarios.length})
        </h2>

        {/* Add comment form */}
        {user ? (
          <form onSubmit={handleComentario} style={{
            background: 'var(--warm-white)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 20,
            marginBottom: 28,
          }}>
            <p style={{ fontWeight: 600, marginBottom: 12 }}>Deja tu reseña</p>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, color: 'var(--text-mid)', display: 'block', marginBottom: 6 }}>CALIFICACIÓN</label>
              <Stars value={calificacion} onChange={setCalificacion} />
            </div>
            <textarea
              value={comentarioTexto}
              onChange={e => setComentarioTexto(e.target.value)}
              placeholder="¿Cómo te quedó la receta?"
              rows={3}
              style={{ marginBottom: 12 }}
            />
            <button type="submit" className="btn btn-primary" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Publicar comentario'}
            </button>
          </form>
        ) : (
          <div style={{
            background: 'var(--accent-light)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 20,
            marginBottom: 28,
            textAlign: 'center',
          }}>
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Inicia sesión</Link>
            {' '}para dejar un comentario
          </div>
        )}

        {/* Comment list */}
        {comentarios.length === 0 ? (
          <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '32px 0' }}>
            Sé el primero en comentar esta receta
          </p>
        ) : (
          comentarios.map(c => (
            <div key={c._id} style={{
              padding: '18px 0',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <strong style={{ fontSize: 14 }}>{c.usuarioId?.nombre || 'Usuario'}</strong>
                  <span style={{ marginLeft: 10, color: '#F59E0B', fontSize: 14 }}>
                    {'★'.repeat(c.calificacion)}{'☆'.repeat(5 - c.calificacion)}
                  </span>
                  <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--text-light)' }}>
                    {new Date(c.createdAt).toLocaleDateString('es-CR')}
                  </span>
                </div>
                {user && (user._id === c.usuarioId?._id || user._id === c.usuarioId) && (
                  <button onClick={() => handleEliminarComentario(c._id)}
                    className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 8px' }}>
                    Eliminar
                  </button>
                )}
              </div>
              <p style={{ fontSize: 15, color: 'var(--text-mid)' }}>{c.texto}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
