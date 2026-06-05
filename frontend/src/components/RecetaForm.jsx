import { useState } from 'react'

const CATEGORIAS = ['Desayuno', 'Almuerzo', 'Cena', 'Postre', 'Merienda', 'Bebida', 'Otro']
const DIFICULTADES = ['Fácil', 'Media', 'Difícil']

const emptyIngrediente = () => ({ nombre: '', cantidad: '', unidad: '' })

export default function RecetaForm({ initialData, onSubmit, loading }) {
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'Almuerzo',
    tiempoMin: '',
    porciones: '',
    dificultad: 'Fácil',
    imagenUrl: '',
    ingredientes: [emptyIngrediente()],
    pasos: [''],
    ...initialData,
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : (initialData?.tags ?? ''),
  })
  const [errors, setErrors] = useState({})

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  // Ingredientes
  const setIngrediente = (i, field, value) => {
    const arr = [...form.ingredientes]
    arr[i] = { ...arr[i], [field]: value }
    set('ingredientes', arr)
  }
  const addIngrediente = () => set('ingredientes', [...form.ingredientes, emptyIngrediente()])
  const removeIngrediente = (i) => set('ingredientes', form.ingredientes.filter((_, idx) => idx !== i))

  // Pasos
  const setPaso = (i, value) => {
    const arr = [...form.pasos]
    arr[i] = value
    set('pasos', arr)
  }
  const addPaso = () => set('pasos', [...form.pasos, ''])
  const removePaso = (i) => set('pasos', form.pasos.filter((_, idx) => idx !== i))

  const validate = () => {
    const e = {}
    if (!form.titulo.trim()) e.titulo = 'El título es requerido'
    if (!form.descripcion.trim()) e.descripcion = 'La descripción es requerida'
    if (!form.tiempoMin || form.tiempoMin < 1) e.tiempoMin = 'Ingresa el tiempo en minutos'
    if (!form.porciones || form.porciones < 1) e.porciones = 'Ingresa las porciones'
    if (form.ingredientes.some(i => !i.nombre.trim())) e.ingredientes = 'Todos los ingredientes deben tener nombre'
    if (form.pasos.some(p => !p.trim())) e.pasos = 'Todos los pasos deben tener contenido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      tiempoMin: Number(form.tiempoMin),
      porciones: Number(form.porciones),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    })
  }

  const sectionTitle = (text) => (
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, marginBottom: 16, marginTop: 8, color: 'var(--text-dark)' }}>
      {text}
    </h3>
  )

  return (
    <form onSubmit={handleSubmit}>
      {/* Info básica */}
      {sectionTitle('Información básica')}

      <div className="form-group">
        <label>Título *</label>
        <input value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Ej: Gallo pinto con natilla" />
        {errors.titulo && <span className="form-error">{errors.titulo}</span>}
      </div>

      <div className="form-group">
        <label>Descripción *</label>
        <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)}
          rows={3} placeholder="Breve descripción de la receta..." />
        {errors.descripcion && <span className="form-error">{errors.descripcion}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label>Categoría *</label>
          <select value={form.categoria} onChange={e => set('categoria', e.target.value)}>
            {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Dificultad *</label>
          <select value={form.dificultad} onChange={e => set('dificultad', e.target.value)}>
            {DIFICULTADES.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Tiempo (minutos) *</label>
          <input type="number" min="1" value={form.tiempoMin} onChange={e => set('tiempoMin', e.target.value)} />
          {errors.tiempoMin && <span className="form-error">{errors.tiempoMin}</span>}
        </div>
        <div className="form-group">
          <label>Porciones *</label>
          <input type="number" min="1" value={form.porciones} onChange={e => set('porciones', e.target.value)} />
          {errors.porciones && <span className="form-error">{errors.porciones}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>URL de imagen (opcional)</label>
        <input value={form.imagenUrl} onChange={e => set('imagenUrl', e.target.value)} placeholder="https://..." />
      </div>

      <div className="form-group">
        <label>Tags (separados por coma)</label>
        <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="vegano, rápido, sin gluten" />
      </div>

      {/* Ingredientes */}
      {sectionTitle('Ingredientes')}
      {errors.ingredientes && <p className="form-error" style={{ marginBottom: 12 }}>{errors.ingredientes}</p>}

      {form.ingredientes.map((ing, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 10 }}>
          <input
            placeholder="Nombre (ej: harina)"
            value={ing.nombre}
            onChange={e => setIngrediente(i, 'nombre', e.target.value)}
          />
          <input
            placeholder="Cantidad"
            value={ing.cantidad}
            onChange={e => setIngrediente(i, 'cantidad', e.target.value)}
          />
          <input
            placeholder="Unidad (ej: tazas)"
            value={ing.unidad}
            onChange={e => setIngrediente(i, 'unidad', e.target.value)}
          />
          <button type="button" onClick={() => removeIngrediente(i)} className="btn btn-danger"
            style={{ padding: '8px 12px' }} disabled={form.ingredientes.length === 1}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" onClick={addIngrediente} className="btn btn-secondary" style={{ marginBottom: 24 }}>
        + Agregar ingrediente
      </button>

      {/* Pasos */}
      {sectionTitle('Pasos de preparación')}
      {errors.pasos && <p className="form-error" style={{ marginBottom: 12 }}>{errors.pasos}</p>}

      {form.pasos.map((paso, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
          <span style={{
            minWidth: 28, height: 28, borderRadius: '50%',
            background: 'var(--accent)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, marginTop: 6, flexShrink: 0,
          }}>{i + 1}</span>
          <textarea
            value={paso}
            onChange={e => setPaso(i, e.target.value)}
            placeholder={`Paso ${i + 1}...`}
            rows={2}
            style={{ flex: 1 }}
          />
          <button type="button" onClick={() => removePaso(i)} className="btn btn-danger"
            style={{ padding: '8px 12px', marginTop: 2 }} disabled={form.pasos.length === 1}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" onClick={addPaso} className="btn btn-secondary" style={{ marginBottom: 32 }}>
        + Agregar paso
      </button>

      <button type="submit" className="btn btn-primary" disabled={loading}
        style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 }}>
        {loading ? 'Guardando...' : 'Guardar receta'}
      </button>
    </form>
  )
}
