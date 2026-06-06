# 🍳 RecipeHub

Plataforma colaborativa de recetas de cocina — Examen Programación IV, I Semestre 2026.

**Stack:** Node.js + Express | React (Vite) | MongoDB 8.0 | Docker Compose | Nginx | GitHub Actions

**URLs de producción:**
- Frontend: https://app.recipehub.mooo.com
- Backend: https://api.recipehub.mooo.com/api/health
- URL del repositorio: https://github.com/randallarauzcubilla/Examen2-Progra4.git
---

## Estructura del proyecto

```
Examen2-Progra4/
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
│   │   ├── pages/           # 7 vistas de la aplicación
│   │   ├── components/      # Componentes reutilizables
│   │   ├── services/        # Llamadas a la API (axios)
│   │   └── context/         # Contexto de autenticación JWT
│   └── package.json
├── .github/workflows/
│   └── deploy.yml           # Pipeline CI/CD
├── docker-compose.yml
└── README.md
```

---

## Variables de entorno

Raíz del proyecto — `.env`

- MONGO_PASSWORD — Contraseña del usuario admin de MongoDB. Ejemplo: password123
- JWT_SECRET — Secreto para firmar tokens JWT. Ejemplo: clave_secreta_123

Backend — `backend/.env`

- PORT — Puerto donde corre la API. Ejemplo: 4000
- MONGO_URI — URI de conexión a MongoDB. Ejemplo: mongodb://admin:password@mongo:27017/recipehub?authSource=admin
- JWT_SECRET — Mismo secreto que en la raíz. Ejemplo: clave_secreta_123
- NODE_ENV — Entorno de ejecución. Ejemplo: development

Frontend — `frontend/.env`

- VITE_API_URL — URL base de la API. Desarrollo: http://localhost:4000/api — Producción: https://api.recipehub.mooo.com/api

---

## Levantar el proyecto localmente

### Requisitos
- Docker Desktop instalado y corriendo
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/randallarauzcubilla/Examen2-Progra4.git
cd Examen2-Progra4

# 2. Crear .env en la raíz
MONGO_PASSWORD=password123
JWT_SECRET=clave_super_secreta_123

# 3. Crear backend/.env
PORT=4000
MONGO_URI=mongodb://admin:password123@mongo:27017/recipehub?authSource=admin
JWT_SECRET=clave_super_secreta_123
NODE_ENV=development

# 4. Crear frontend/.env
VITE_API_URL=http://localhost:4000/api

# 5. Levantar los contenedores
docker compose up --build -d

# 6. Verificar que la API responde
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

- Randall — Infraestructura base: Docker, docker-compose, servidor Express, health check, tests, estructura del proyecto, VPS, Nginx, SSL, CI/CD
- Alison — Modelos Mongoose (Usuario, Receta, Comentario) + rutas y controllers de autenticación
- Randall — Rutas y controllers de recetas (CRUD completo)
- Anddy — Rutas y controllers de comentarios + middleware JWT
- Keilor y Marvin — Frontend React: todas las vistas y conexión a la API

---

## API — Endpoints

Autenticación:
- POST /api/auth/register — Registrar usuario
- POST /api/auth/login — Login, retorna JWT
- GET /api/auth/me — Perfil del usuario autenticado (requiere JWT)

Recetas:
- GET /api/recetas — Listar recetas (filtros: categoria, dificultad, tags)
- POST /api/recetas — Crear receta (requiere JWT)
- GET /api/recetas/:id — Detalle de receta
- PUT /api/recetas/:id — Actualizar receta (requiere JWT + ser autor)
- DELETE /api/recetas/:id — Eliminar receta (requiere JWT + ser autor)

Comentarios:
- GET /api/recetas/:id/comentarios — Listar comentarios de una receta
- POST /api/recetas/:id/comentarios — Agregar comentario (requiere JWT)
- DELETE /api/comentarios/:id — Eliminar comentario (requiere JWT + ser autor)

Sistema:
- GET /api/health — Health check

---

## Infraestructura de producción

```
Internet → Nginx (SSL/443)
         → api.recipehub.mooo.com → Docker api:4000 → MongoDB (red interna)
         → app.recipehub.mooo.com → React build dist/
```

- VPS: Azure Ubuntu 24.04 LTS — IP 20.38.7.141
- SSL: Let's Encrypt con Certbot — renovación automática
- HTTP redirige a HTTPS con 301
- MongoDB sin puerto expuesto al exterior
- CI/CD automático con GitHub Actions en cada push a main

### Secrets requeridos en GitHub Actions

- VPS_HOST — IP pública del VPS
- VPS_USER — usuario SSH
- VPS_SSH_KEY — llave privada SSH en formato PEM
- MONGO_URI — cadena de conexión MongoDB
- JWT_SECRET — secreto para firmar los tokens JWT

---

## Esquema de Base de Datos

Colección usuarios:
- nombre (String, requerido)
- email (String, requerido, único)
- password (String, hash bcrypt)
- bio (String, opcional)
- avatarUrl (String, opcional)
- createdAt, updatedAt (Date, automático)

Colección recetas (con campos embebidos):
- titulo, descripcion, categoria, dificultad (String, requeridos)
- tiempoMin, porciones (Number, requeridos)
- ingredientes (Array de subdocumentos: nombre, cantidad, unidad)
- pasos (Array de strings)
- tags (Array de strings, opcional)
- autorId (ObjectId → usuarios)
- imagenUrl (String, opcional)
- createdAt, updatedAt (Date, automático)

Colección comentarios:
- recetaId (ObjectId → recetas)
- usuarioId (ObjectId → usuarios)
- texto (String, requerido)
- calificacion (Number, 1-5)
- createdAt (Date, automático)