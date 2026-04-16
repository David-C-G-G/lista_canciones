# Usa Node 18 en Alpine (más ligero)
FROM node:18-alpine AS build

# Directorio de trabajo dentro del contenedor
WORKDIR /app/backend

# Copiamos package.json y package-lock.json primero (para cache de dependencias)
COPY backend/package*.json ./

# Instalamos dependencias
RUN npm ci

# Copiamos el resto del código fuente (incluye src y tsconfig.json)
COPY backend/ .

# Compilamos TypeScript dentro del contenedor
RUN npx tsc

# Etapa final (runtime)
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor limpio
WORKDIR /app/backend

# Copiamos el backend compilado y dependencias
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/node_modules ./node_modules
COPY backend/package*.json ./

# 👇 Copiamos el frontend en la ruta correcta
WORKDIR /app
COPY frontend ./frontend

# Volvemos al backend como directorio de trabajo
WORKDIR /app/backend

# Exponemos el puerto del backend
EXPOSE 3000

# Arrancamos el servidor compilado
CMD ["node", "dist/server.js"]
