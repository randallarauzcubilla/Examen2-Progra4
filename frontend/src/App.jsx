import { Routes, Route } from 'react-router-dom'
import Inicio from './pages/Inicio'
import DetalleReceta from './pages/DetalleReceta'
import NuevaReceta from './pages/NuevaReceta'
import EditarReceta from './pages/EditarReceta'
import Perfil from './pages/Perfil'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Routes>
      <Route path="/"           element={<Inicio />} />
      <Route path="/recetas/:id" element={<DetalleReceta />} />
      <Route path="/nueva"      element={<NuevaReceta />} />
      <Route path="/editar/:id" element={<EditarReceta />} />
      <Route path="/perfil"     element={<Perfil />} />
      <Route path="/login"      element={<Login />} />
      <Route path="/register"   element={<Register />} />
    </Routes>
  )
}

export default App