import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RecetaForm from '../components/RecetaForm'
import { recetasService } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function EditarReceta() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [receta, setReceta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    recetasService.obtener(id)
      .then(data => {
        const esAutor = user && (data.autorId?._id === user._id || data.autorId === user._id)
        if (!esAutor) {
          navigate(`/recetas/${id}`)
          return
        }
        setReceta(data)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, user])

  const handleSubmit = async (data) => {
    try {
      setSaving(true)
      setError('')
      await recetasService.actualizar(id, data)
      navigate(`/recetas/${id}`)
    } catch (e) {
      setError(e.message)
      setSaving(false)
    }
  }

  if (loading) return <div className="spinner" />
  if (error && !receta) return <p style={{ textAlign: 'center', padding: 60, color: 'var(--red)' }}>{error}</p>

  return (
    <div className="page-narrow">
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 8 }}>
        Editar receta
      </h1>
      <p style={{ color: 'var(--text-mid)', marginBottom: 32, fontSize: 15 }}>
        Actualiza los datos de tu receta
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

      {receta && <RecetaForm initialData={receta} onSubmit={handleSubmit} loading={saving} />}
    </div>
  )
}
