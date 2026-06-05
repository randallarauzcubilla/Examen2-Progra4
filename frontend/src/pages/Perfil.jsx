import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function Perfil() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [recetas, setRecetas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!usuario) { navigate('/login'); return }
    const cargar = async () => {
      try {
        const { data } = await api.get('/recetas')
        setRecetas(data.filter(r => r.autorId?._id === usuario.id))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [usuario])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!usuario) return null

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/" style={styles.back}>← Volver al inicio</Link>

        <div style={styles.perfil}>
          <div style={styles.avatar}>
            {usuario.avatarUrl
              ? <img src={usuario.avatarUrl} alt="avatar" style={styles.avatarImg} />
              : <div style={styles.avatarPlaceholder}>{usuario.nombre?.[0]?.toUpperCase()}</div>}
          </div>
          <div>
            <h2 style={styles.nombre}>{usuario.nombre}</h2>
            <p style={styles.email}>{usuario.email}</p>
            <button onClick={handleLogout} style={styles.btnLogout}>Cerrar sesión</button>
          </div>
        </div>

        <div style={styles.seccion}>
          <div style={styles.secHeader}>
            <h3 style={styles.secTitle}>Mis Recetas ({recetas.length})</h3>
            <Link to="/nueva" style={styles.btnNueva}>+ Nueva Receta</Link>
          </div>

          {loading && <p style={styles.msg}>Cargando...</p>}
          {!loading && recetas.length === 0 && (
            <p style={styles.msg}>Aún no has publicado recetas. <Link to="/nueva">¡Creá una!</Link></p>
          )}

          <div style={styles.grid}>
            {recetas.map(r => (
              <Link to={`/recetas/${r._id}`} key={r._id} style={styles.cardLink}>
                <div style={styles.card}>
                  {r.imagenUrl
                    ? <img src={r.imagenUrl} alt={r.titulo} style={styles.cardImg} />
                    : <div style={styles.imgPlaceholder}>🍽️</div>}
                  <div style={styles.cardBody}>
                    <span style={styles.categoria}>{r.categoria}</span>
                    <h4 style={styles.cardTitle}>{r.titulo}</h4>
                    <div style={styles.cardMeta}>
                      <span>⏱ {r.tiempoMin} min</span>
                      <span>{r.dificultad}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { background: '#fafafa', minHeight: '100vh', fontFamily: 'sans-serif', padding: '2rem' },
  container: { maxWidth: '800px', margin: '0 auto' },
  back: { color: '#e8540a', textDecoration: 'none', fontWeight: '600', display: 'inline-block', marginBottom: '1.5rem' },
  perfil: { display: 'flex', gap: '1.5rem', alignItems: 'center', background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '1.5rem' },
  avatar: { flexShrink: 0 },
  avatarImg: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' },
  avatarPlaceholder: { width: '80px', height: '80px', borderRadius: '50%', background: '#e8540a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '700' },
  nombre: { margin: '0 0 0.3rem', fontSize: '1.5rem', color: '#222' },
  email: { color: '#888', margin: '0 0 1rem' },
  btnLogout: { padding: '0.5rem 1rem', background: '#f0f0f0', color: '#555', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  seccion: { background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  secHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  secTitle: { margin: 0, color: '#333' },
  btnNueva: { background: '#e8540a', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },
  cardLink: { textDecoration: 'none', color: 'inherit' },
  card: { borderRadius: '10px', overflow: 'hidden', border: '1px solid #f0f0f0', transition: 'transform 0.2s' },
  cardImg: { width: '100%', height: '140px', objectFit: 'cover' },
  imgPlaceholder: { height: '140px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' },
  cardBody: { padding: '0.8rem' },
  categoria: { background: '#fff3ed', color: '#e8540a', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  cardTitle: { margin: '0.5rem 0', color: '#222', fontSize: '0.95rem' },
  cardMeta: { display: 'flex', gap: '0.8rem', fontSize: '0.8rem', color: '#888' },
  msg: { color: '#888', textAlign: 'center', padding: '2rem' },
}

export default Perfil