# Etapa 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: el dist/ es copiado por el pipeline al VPS
# Nginx sirve los archivos estáticos directamente (no se necesita contenedor)
# Este stage sólo existe para verificar que el build compile sin errores en CI
FROM alpine:3.19
COPY --from=builder /app/dist /dist
