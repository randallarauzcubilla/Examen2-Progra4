import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RecetaForm from '../components/RecetaForm'
import { recetasService } from '../services/api'

export default function NuevaReceta() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (data) => {
    try {
      setLoading(true)
      setError('')
      const nueva = await recetasService.crear(data)
      navigate(`/recetas/${nueva._id}`)
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="page-narrow">
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 8 }}>
        Nueva receta
      </h1>
      <p style={{ color: 'var(--text-mid)', marginBottom: 32, fontSize: 15 }}>
        Comparte tu receta con la comunidad
      </p>

      {error && (
        <div style={{
          background: 'var(--red-light)',
          color: 'var(--red)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 24,
          fontSize: 14,
        }}>
          {error}
        </div>
      )}

      <RecetaForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
