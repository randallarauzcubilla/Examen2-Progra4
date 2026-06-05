import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { recetasService } from '../services/api'
import RecetaCard from '../components/RecetaCard'

export default function Perfil() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [recetas, setRecetas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    recetasService.listar()
      .then(data => {
        const mias = data.filter(r =>
          r.autorId?._id === user._id || r.autorId === user._id
        )
        setRecetas(mias)
      })
      .finally(() => setLoading(false))
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initiales = user.nombre
    ? user.nombre.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="page">
      {/* Profile header */}
      <div className="card" style={{
        padding: '32px',
        marginBottom: 40,
        display: 'flex',
        gap: 24,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        {/* Avatar */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: user.avatarUrl ? 'transparent' : 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, overflow: 'hidden',
        }}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ color: '#fff', fontSize: 28, fontWeight: 700 }}>{initiales}</span>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 4 }}>
            {user.nombre}
          </h1>
          <p style={{ color: 'var(--text-mid)', fontSize: 14, marginBottom: 8 }}>{user.email}</p>
          {user.bio && <p style={{ color: 'var(--text-mid)', fontSize: 15 }}>{user.bio}</p>}
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 14 }}>
            <span style={{ color: 'var(--text-mid)' }}>
              📅 Miembro desde {new Date(user.createdAt).toLocaleDateString('es-CR', { year: 'numeric', month: 'long' })}
            </span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
              🍳 {recetas.length} receta{recetas.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to="/nueva" className="btn btn-primary" style={{ fontSize: 13 }}>+ Nueva receta</Link>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ fontSize: 13 }}>Cerrar sesión</button>
        </div>
      </div>

      {/* Recipes */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 24 }}>
        Mis recetas
      </h2>

      {loading ? (
        <div className="spinner" />
      ) : recetas.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: 'var(--warm-white)',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🍳</div>
          <p style={{ color: 'var(--text-mid)', marginBottom: 20 }}>Aún no has publicado ninguna receta</p>
          <Link to="/nueva" className="btn btn-primary">Publicar mi primera receta</Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {recetas.map(r => <RecetaCard key={r._id} receta={r} />)}
        </div>
      )}
    </div>
  )
}
