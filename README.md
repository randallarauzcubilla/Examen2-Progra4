# RecipeHub

Plataforma colaborativa de recetas de cocina — Examen Programación IV, I Semestre 2026.

**Stack:** Node.js + Express | React (Vite) | MongoDB 8.0 | Docker Compose | Nginx | GitHub Actions

---

## Estructura del proyecto

```
recipehub/
├── backend/
│   ├── src/
│   │   ├── models/          # Schemas de Mongoose (Usuario, Receta, Comentario)
│   │   ├── routes/          # Endpoints de la API
│   │   ├── middleware/      # Autenticación JWT
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── app.js           # Configuración de Express
│   │   └── server.js        # Conexión a MongoDB e inicio del servidor
│   ├── tests/               # Tests unitarios (Jest + Supertest)
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/           # Vistas: Inicio, Detalle, Nueva, Editar, Perfil, Login, Register
│   │   ├── components/      # Componentes reutilizables
│   │   ├── services/        # Llamadas a la API (axios)
│   │   └── context/         # Contexto de autenticación
│   └── package.json
├── .github/workflows/
│   └── deploy.yml           # Pipeline CI/CD
├── docker-compose.yml
└── README.md
```

---

## Variables de entorno

### Raíz del proyecto — `.env`

| Variable | Descripción | Ejemplo |
| `MONGO_PASSWORD` | Contraseña del usuario admin de MongoDB | `password123` |
| `JWT_SECRET` | Secreto para firmar tokens JWT | `clave_secreta_123` |

### Backend — `backend/.env`

| Variable | Descripción | Ejemplo |
| `PORT` | Puerto donde corre la API | `4000` |
| `MONGO_URI` | URI de conexión a MongoDB | `mongodb://admin:password@mongo:27017/recipehub?authSource=admin` |
| `JWT_SECRET` | Mismo secreto que en la raíz | `clave_secreta_123` |
| `NODE_ENV` | Entorno de ejecución | `development` |

### Frontend — `frontend/.env`

| Variable | Descripción | Ejemplo |
| `VITE_API_URL` | URL base de la API | `http://localhost:4000/api` |

---

## Levantar el proyecto localmente

### Requisitos
- Docker Desktop instalado y corriendo
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/recipehub.git
cd recipehub

# 2. Crear los archivos de variables de entorno
# Crear .env en la raíz:
MONGO_PASSWORD=password123
JWT_SECRET=clave_super_secreta_123

# Crear backend/.env:
PORT=4000
MONGO_URI=mongodb://admin:password123@mongo:27017/recipehub?authSource=admin
JWT_SECRET=clave_super_secreta_123
NODE_ENV=development

# Crear frontend/.env:
VITE_API_URL=http://localhost:4000/api

# 3. Levantar los contenedores
docker compose up --build -d

# 4. Verificar que la API responde
curl http://localhost:4000/api/health
# Respuesta esperada: {"status":"ok","timestamp":"..."}
```

### Conectar MongoDB Compass (opcional)
```
URI: mongodb://admin:password123@localhost:27017/?authSource=admin
```

---

## Correr los tests

```bash
cd backend
npm install
npm test
```

Deben pasar 4 tests: health check, register, login y listar recetas.

---

## División de trabajo

| Integrante | Responsabilidad |
| Randall | Infraestructura base: Docker, docker-compose, servidor Express, health check, tests, estructura del proyecto |
| Compañero 2 | Modelos Mongoose (Usuario, Receta, Comentario) + rutas y controllers de autenticación |
| Compañero 3 | Rutas y controllers de recetas (CRUD completo) |
| Compañero 4 | Rutas y controllers de comentarios + middleware JWT |
| Compañero 5 | Frontend React: todas las vistas y conexión a la API |

---

## API — Endpoints principales

| Método | Ruta | Descripción | Auth |
| GET | `/api/health` | Health check | No |
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Login, retorna JWT | No |
| GET | `/api/auth/me` | Perfil del usuario | JWT |
| GET | `/api/recetas` | Listar recetas | No |
| POST | `/api/recetas` | Crear receta | JWT |
| GET | `/api/recetas/:id` | Detalle de receta | No |
| PUT | `/api/recetas/:id` | Actualizar receta | JWT + autor |
| DELETE | `/api/recetas/:id` | Eliminar receta | JWT + autor |
| GET | `/api/recetas/:id/comentarios` | Comentarios de receta | No |
| POST | `/api/recetas/:id/comentarios` | Agregar comentario | JWT |
| DELETE | `/api/comentarios/:id` | Eliminar comentario | JWT + autor |

---

## Infraestructura de producción

```
Internet → Nginx (SSL/443) → api.dominio.xyz → Docker api:4000
                           → app.dominio.xyz → React build (dist/)
                                MongoDB en red interna Docker (sin puerto expuesto)
```

- SSL con Let's Encrypt (Certbot)
- HTTP redirige a HTTPS con 301
- CI/CD automático con GitHub Actions en cada push a `main`