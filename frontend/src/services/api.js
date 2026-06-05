const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getHeaders(),
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error en la solicitud')
  return data
}

// ── Auth ────────────────────────────────────────────────────────────────────
export const authService = {
  register: (nombre, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nombre, email, password }),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request('/auth/me'),
}

// ── Recetas ─────────────────────────────────────────────────────────────────
export const recetasService = {
  listar: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v)
    ).toString()
    return request(`/recetas${qs ? `?${qs}` : ''}`)
  },

  obtener: (id) => request(`/recetas/${id}`),

  crear: (receta) =>
    request('/recetas', {
      method: 'POST',
      body: JSON.stringify(receta),
    }),

  actualizar: (id, receta) =>
    request(`/recetas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(receta),
    }),

  eliminar: (id) =>
    request(`/recetas/${id}`, { method: 'DELETE' }),
}

// ── Comentarios ──────────────────────────────────────────────────────────────
export const comentariosService = {
  listar: (recetaId) => request(`/recetas/${recetaId}/comentarios`),

  crear: (recetaId, texto, calificacion) =>
    request(`/recetas/${recetaId}/comentarios`, {
      method: 'POST',
      body: JSON.stringify({ texto, calificacion }),
    }),

  eliminar: (id) =>
    request(`/comentarios/${id}`, { method: 'DELETE' }),
}
