import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const initialForm = {
  titulo: '', descripcion: '', categoria: 'Desayuno',
  tiempoMin: '', porciones: '', dificultad: 'Fácil',
  ingredientes: [{ nombre: '', cantidad: '', unidad: '' }],
  pasos: [''],
  tags: '',
  imagenUrl: '',
}

function FormReceta({ modo }) {
  const { id } = useParams()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!usuario) { navigate('/login'); return }
    if (modo === 'editar' && id) {
      api.get(`/recetas/${id}`).then(({ data }) => {
        setForm({
          titulo: data.titulo,
          descripcion: data.descripcion,
          categoria: data.categoria,
          tiempoMin: data.tiempoMin,
          porciones: data.porciones,
          dificultad: data.dificultad,
          ingredientes: data.ingredientes,
          pasos: data.pasos,
          tags: data.tags?.join(',') || '',
          imagenUrl: data.imagenUrl || '',
        })
      }).catch(() => navigate('/'))
    }
  }, [id, modo, usuario, navigate])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Ingredientes
  const setIngrediente = (i, field, value) => {
    const arr = [...form.ingredientes]
    arr[i][field] = value
    setForm({ ...form, ingredientes: arr })
  }
  const addIngrediente = () => setForm({ ...form, ingredientes: [...form.ingredientes, { nombre: '', cantidad: '', unidad: '' }] })
  const removeIngrediente = (i) => setForm({ ...form, ingredientes: form.ingredientes.filter((_, idx) => idx !== i) })

  // Pasos
  const setPaso = (i, value) => {
    const arr = [...form.pasos]
    arr[i] = value
    setForm({ ...form, pasos: arr })
  }
  const addPaso = () => setForm({ ...form, pasos: [...form.pasos, ''] })
  const removePaso = (i) => setForm({ ...form, pasos: form.pasos.filter((_, idx) => idx !== i) })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        tiempoMin: Number(form.tiempoMin),
        porciones: Number(form.porciones),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      }
      if (modo === 'editar') {
        await api.put(`/recetas/${id}`, payload)
        navigate(`/recetas/${id}`)
      } else {
        const { data } = await api.post('/recetas', payload)
        navigate(`/recetas/${data._id}`)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>{modo === 'editar' ? '✏️ Editar Receta' : '🍳 Nueva Receta'}</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>

          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Título *</label>
              <input style={styles.input} name="titulo" value={form.titulo} onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Categoría *</label>
              <select style={styles.input} name="categoria" value={form.categoria} onChange={handleChange}>
                {['Desayuno','Almuerzo','Cena','Postre','Merienda'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Descripción *</label>
            <textarea style={styles.textarea} name="descripcion" value={form.descripcion} onChange={handleChange} required rows={3} />
          </div>

          <div style={styles.grid3}>
            <div style={styles.field}>
              <label style={styles.label}>Tiempo (min) *</label>
              <input style={styles.input} type="number" name="tiempoMin" value={form.tiempoMin} onChange={handleChange} required min={1} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Porciones *</label>
              <input style={styles.input} type="number" name="porciones" value={form.porciones} onChange={handleChange} required min={1} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Dificultad *</label>
              <select style={styles.input} name="dificultad" value={form.dificultad} onChange={handleChange}>
                {['Fácil','Media','Difícil'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>URL de imagen</label>
            <input style={styles.input} name="imagenUrl" value={form.imagenUrl} onChange={handleChange} placeholder="https://..." />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Tags (separados por coma)</label>
            <input style={styles.input} name="tags" value={form.tags} onChange={handleChange} placeholder="vegano, rápido, saludable" />
          </div>

          {/* Ingredientes */}
          <div style={styles.seccion}>
            <div style={styles.secHeader}>
              <h3 style={styles.secTitle}>🥘 Ingredientes</h3>
              <button type="button" onClick={addIngrediente} style={styles.btnAdd}>+ Agregar</button>
            </div>
            {form.ingredientes.map((ing, i) => (
              <div key={i} style={styles.rowIngrediente}>
                <input style={{...styles.input, flex:2}} placeholder="Nombre" value={ing.nombre} autoComplete="off"
                  onChange={e => setIngrediente(i, 'nombre', e.target.value)} required />
                <input style={{...styles.input, flex:1}} type="number" placeholder="Cantidad" value={ing.cantidad}
                  onChange={e => setIngrediente(i, 'cantidad', e.target.value)} required min={0} />
                <input style={{...styles.input, flex:1}} placeholder="Unidad" value={ing.unidad}
                  onChange={e => setIngrediente(i, 'unidad', e.target.value)} required />
                {form.ingredientes.length > 1 &&
                  <button type="button" onClick={() => removeIngrediente(i)} style={styles.btnRemove}>✕</button>}
              </div>
            ))}
          </div>

          {/* Pasos */}
          <div style={styles.seccion}>
            <div style={styles.secHeader}>
              <h3 style={styles.secTitle}>📋 Pasos de preparación</h3>
              <button type="button" onClick={addPaso} style={styles.btnAdd}>+ Agregar</button>
            </div>
            {form.pasos.map((paso, i) => (
              <div key={i} style={styles.rowPaso}>
                <div style={styles.pasoNum}>{i + 1}</div>
                <textarea style={{...styles.textarea, flex:1}} rows={2} placeholder={`Paso ${i+1}`}
                  value={paso} onChange={e => setPaso(i, e.target.value)} required />
                {form.pasos.length > 1 &&
                  <button type="button" onClick={() => removePaso(i)} style={styles.btnRemove}>✕</button>}
              </div>
            ))}
          </div>

          <div style={styles.btnRow}>
            <button type="button" onClick={() => navigate(-1)} style={styles.btnCancelar}>Cancelar</button>
            <button type="submit" style={styles.btnGuardar} disabled={loading}>
              {loading ? 'Guardando...' : modo === 'editar' ? 'Guardar cambios' : 'Publicar receta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: { background: '#fafafa', minHeight: '100vh', fontFamily: 'sans-serif', padding: '2rem' },
  container: { maxWidth: '720px', margin: '0 auto', background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  title: { color: '#e8540a', marginTop: 0 },
  error: { color: 'red', marginBottom: '1rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.3rem', fontWeight: '600', color: '#555' },
  input: { width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', resize: 'vertical', boxSizing: 'border-box' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' },
  seccion: { background: '#f9f9f9', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' },
  secHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' },
  secTitle: { margin: 0, color: '#333' },
  btnAdd: { background: '#e8540a', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontWeight: '600' },
  rowIngrediente: { display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' },
  rowPaso: { display: 'flex', gap: '0.8rem', marginBottom: '0.8rem', alignItems: 'flex-start' },
  pasoNum: { background: '#e8540a', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0, marginTop: '0.4rem' },
  btnRemove: { background: '#e53935', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer' },
  btnRow: { display: 'flex', gap: '1rem', justifyContent: 'flex-end' },
  btnCancelar: { padding: '0.8rem 1.5rem', background: '#f0f0f0', color: '#555', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  btnGuardar: { padding: '0.8rem 1.5rem', background: '#e8540a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' },
}

export default FormReceta