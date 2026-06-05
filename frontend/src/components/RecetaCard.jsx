import { Link } from 'react-router-dom'

const DIFICULTAD_COLOR = {
  Fácil: 'badge-green',
  Media: 'badge-yellow',
  Difícil: 'badge-orange',
}

function Stars({ rating }) {
  const r = Math.round(rating || 0)
  return (
    <span className="stars">
      {'★'.repeat(r)}{'☆'.repeat(5 - r)}
      <span style={{ color: 'var(--text-light)', fontSize: 12, marginLeft: 4 }}>
        ({rating ? rating.toFixed(1) : '—'})
      </span>
    </span>
  )
}

export default function RecetaCard({ receta }) {
  return (
    <Link to={`/recetas/${receta._id}`} style={{ textDecoration: 'none' }}>
      <article className="card" style={{ transition: 'transform 0.15s, box-shadow 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
      >
        {/* Image */}
        <div style={{ height: 180, background: 'var(--cream)', overflow: 'hidden', position: 'relative' }}>
          {receta.imagenUrl ? (
            <img
              src={receta.imagenUrl}
              alt={receta.titulo}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 48, background: 'var(--accent-light)',
            }}>🍽️</div>
          )}
          <span className={`badge ${DIFICULTAD_COLOR[receta.dificultad] || 'badge-gray'}`}
            style={{ position: 'absolute', top: 10, right: 10 }}>
            {receta.dificultad}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 16px' }}>
          <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginBottom: 4 }}>
            {receta.categoria}
          </p>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            fontWeight: 600,
            marginBottom: 6,
            color: 'var(--text-dark)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {receta.titulo}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 12,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {receta.descripcion}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-mid)' }}>⏱ {receta.tiempoMin} min</span>
            <Stars rating={receta.promedioCalificacion} />
          </div>
        </div>
      </article>
    </Link>
  )
}
