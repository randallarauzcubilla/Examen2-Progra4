import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function DetalleReceta() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [receta, setReceta] = useState(null)
  const [comentarios, setComentarios] = useState([])
  const [nuevoComentario, setNuevoComentario] = useState({ texto: '', calificacion: 5 })
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {
        const [r, c] = await Promise.all([
          api.get(`/recetas/${id}`),
          api.get(`/recetas/${id}/comentarios`),
        ])
        setReceta(r.data)
        setComentarios(c.data)
      } catch {
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [id, navigate])

  const eliminarReceta = async () => {
    if (!confirm('¿Eliminar esta receta?')) return
    await api.delete(`/recetas/${id}`)
    navigate('/')
  }

  const enviarComentario = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      const { data } = await api.post(`/recetas/${id}/comentarios`, nuevoComentario)
      setComentarios([data, ...comentarios])
      setNuevoComentario({ texto: '', calificacion: 5 })
    } catch (err) {
      alert(err.response?.data?.message || 'Error al comentar')
    } finally {
      setEnviando(false)
    }
  }

  const eliminarComentario = async (cId) => {
    await api.delete(`/comentarios/${cId}`)
    setComentarios(comentarios.filter(c => c._id !== cId))
  }

  if (loading) return <p style={styles.msg}>Cargando...</p>
  if (!receta) return null

  const esAutor = usuario && receta.autorId?._id === usuario.id

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/" style={styles.back}>← Volver</Link>

        {receta.imagenUrl && <img src={receta.imagenUrl} alt={receta.titulo} style={styles.img} />}

        <div style={styles.header}>
          <div>
            <span style={styles.categoria}>{receta.categoria}</span>
            <span style={styles.dif}>{receta.dificultad}</span>
          </div>
          <h1 style={styles.titulo}>{receta.titulo}</h1>
          <p style={styles.desc}>{receta.descripcion}</p>
          <div style={styles.meta}>
            <span>⏱ {receta.tiempoMin} minutos</span>
            <span>🍽️ {receta.porciones} porciones</span>
            <span>👤 {receta.autorId?.nombre}</span>
          </div>
          {receta.tags?.length > 0 && (
            <div style={styles.tags}>
              {receta.tags.map(t => <span key={t} style={styles.tag}>#{t}</span>)}
            </div>
          )}
          {esAutor && (
            <div style={styles.acciones}>
              <Link to={`/editar/${id}`} style={styles.btnEditar}>Editar</Link>
              <button onClick={eliminarReceta} style={styles.btnEliminar}>Eliminar</button>
            </div>
          )}
        </div>

        <div style={styles.seccion}>
          <h2 style={styles.secTitulo}>🥘 Ingredientes</h2>
          <ul style={styles.lista}>
            {receta.ingredientes.map((ing, i) => (
              <li key={i} style={styles.item}>
                <strong>{ing.cantidad} {ing.unidad}</strong> de {ing.nombre}
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.seccion}>
          <h2 style={styles.secTitulo}>📋 Pasos</h2>
          {receta.pasos.map((paso, i) => (
            <div key={i} style={styles.paso}>
              <div style={styles.pasoNum}>{i + 1}</div>
              <p style={styles.pasoTexto}>{paso}</p>
            </div>
          ))}
        </div>

        <div style={styles.seccion}>
          <h2 style={styles.secTitulo}>💬 Comentarios ({comentarios.length})</h2>

          {usuario ? (
            <form onSubmit={enviarComentario} style={styles.commentForm}>
              <textarea
                style={styles.textarea}
                placeholder="¿Qué te pareció esta receta?"
                value={nuevoComentario.texto}
                onChange={e => setNuevoComentario({ ...nuevoComentario, texto: e.target.value })}
                required
                rows={3}
              />
              <div style={styles.ratingRow}>
                <label>Calificación: </label>
                <select
                  value={nuevoComentario.calificacion}
                  onChange={e => setNuevoComentario({ ...nuevoComentario, calificacion: Number(e.target.value) })}
                  style={styles.ratingSelect}
                >
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{'⭐'.repeat(n)}</option>)}
                </select>
                <button type="submit" style={styles.btnComent} disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Comentar'}
                </button>
              </div>
            </form>
          ) : (
            <p style={styles.loginMsg}><Link to="/login">Iniciá sesión</Link> para comentar.</p>
          )}

          {comentarios.map(c => (
            <div key={c._id} style={styles.comentario}>
              <div style={styles.comentHeader}>
                <strong>{c.usuarioId?.nombre || 'Usuario'}</strong>
                <span>{'⭐'.repeat(c.calificacion)}</span>
                {usuario && c.usuarioId?._id === usuario.id && (
                  <button onClick={() => eliminarComentario(c._id)} style={styles.btnBorrarC}>✕</button>
                )}
              </div>
              <p style={styles.comentTexto}>{c.texto}</p>
              <small style={styles.comentFecha}>{new Date(c.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { background: '#fafafa', minHeight: '100vh', fontFamily: 'sans-serif' },
  container: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  back: { color: '#e8540a', textDecoration: 'none', fontWeight: '600', display: 'inline-block', marginBottom: '1rem' },
  img: { width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' },
  header: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  categoria: { background: '#fff3ed', color: '#e8540a', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', marginRight: '0.5rem' },
  dif: { background: '#f0f0f0', color: '#555', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem' },
  titulo: { margin: '0.8rem 0', fontSize: '2rem', color: '#222' },
  desc: { color: '#666', marginBottom: '1rem' },
  meta: { display: 'flex', gap: '1.5rem', color: '#888', flexWrap: 'wrap' },
  tags: { display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' },
  tag: { background: '#f0f0f0', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', color: '#666' },
  acciones: { display: 'flex', gap: '0.8rem', marginTop: '1rem' },
  btnEditar: { padding: '0.5rem 1rem', background: '#333', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem' },
  btnEliminar: { padding: '0.5rem 1rem', background: '#e53935', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  seccion: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  secTitulo: { marginTop: 0, color: '#e8540a' },
  lista: { paddingLeft: '1.2rem' },
  item: { marginBottom: '0.5rem', color: '#444' },
  paso: { display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' },
  pasoNum: { background: '#e8540a', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 },
  pasoTexto: { margin: 0, color: '#444', lineHeight: '1.6' },
  commentForm: { background: '#f9f9f9', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' },
  textarea: { width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', resize: 'vertical', boxSizing: 'border-box' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.7rem', flexWrap: 'wrap' },
  ratingSelect: { padding: '0.4rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' },
  btnComent: { padding: '0.6rem 1.2rem', background: '#e8540a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  loginMsg: { color: '#666', textAlign: 'center', padding: '1rem' },
  comentario: { borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem', marginBottom: '1rem' },
  comentHeader: { display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '0.4rem' },
  comentTexto: { margin: '0.4rem 0', color: '#444' },
  comentFecha: { color: '#aaa' },
  btnBorrarC: { marginLeft: 'auto', background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', fontWeight: '700' },
  msg: { textAlign: 'center', padding: '3rem', color: '#888' },
}

export default DetalleReceta