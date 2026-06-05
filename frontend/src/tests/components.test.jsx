import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// ─── Test 1: RecetaCard renders recipe data ────────────────────────────────
import RecetaCard from '../components/RecetaCard'

describe('RecetaCard', () => {
  const recetaMock = {
    _id: '123',
    titulo: 'Gallo Pinto',
    descripcion: 'El plato típico de Costa Rica',
    categoria: 'Desayuno',
    tiempoMin: 20,
    porciones: 4,
    dificultad: 'Fácil',
    promedioCalificacion: 4.5,
    imagenUrl: null,
  }

  it('muestra el título y categoría de la receta', () => {
    render(
      <MemoryRouter>
        <RecetaCard receta={recetaMock} />
      </MemoryRouter>
    )
    expect(screen.getByText('Gallo Pinto')).toBeInTheDocument()
    expect(screen.getByText('Desayuno')).toBeInTheDocument()
  })

  it('muestra el tiempo de preparación', () => {
    render(
      <MemoryRouter>
        <RecetaCard receta={recetaMock} />
      </MemoryRouter>
    )
    expect(screen.getByText(/20 min/i)).toBeInTheDocument()
  })

  it('muestra el nivel de dificultad', () => {
    render(
      <MemoryRouter>
        <RecetaCard receta={recetaMock} />
      </MemoryRouter>
    )
    expect(screen.getByText('Fácil')).toBeInTheDocument()
  })
})

// ─── Test 2: Login form validation ────────────────────────────────────────
import Login from '../pages/Login'
import { AuthContext } from '../context/AuthContext'

// Mock the auth context
const mockAuthContext = {
  user: null,
  loading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
}

// We need to export AuthContext from AuthContext.jsx — see note below
// For now, mock useAuth via module
vi.mock('../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useAuth: () => mockAuthContext,
  }
})

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza los campos de email y contraseña', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    expect(screen.getByPlaceholderText(/correo@ejemplo.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
  })

  it('renderiza el botón de iniciar sesión', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('llama a login con email y password al enviar el formulario', async () => {
    mockAuthContext.login.mockResolvedValueOnce({})
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), {
      target: { value: 'test@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    // login is async; just verify it was called with correct args
    expect(mockAuthContext.login).toHaveBeenCalledWith('test@test.com', 'password123')
  })
})

// ─── Test 3: Register page validation ──────────────────────────────────────
import Register from '../pages/Register'

describe('Register page', () => {
  it('muestra error si las contraseñas no coinciden', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByPlaceholderText('correo@ejemplo.com'), { target: { value: 'juan@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Mínimo 6 caracteres'), { target: { value: 'pass123' } })
    fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), { target: { value: 'different' } })
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(await screen.findByText(/contraseñas no coinciden/i)).toBeInTheDocument()
  })

  it('muestra error si la contraseña es muy corta', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByPlaceholderText('correo@ejemplo.com'), { target: { value: 'juan@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Mínimo 6 caracteres'), { target: { value: '123' } })
    fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(await screen.findByText(/al menos 6 caracteres/i)).toBeInTheDocument()
  })

  it('renderiza el enlace para iniciar sesión', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument()
  })
})
