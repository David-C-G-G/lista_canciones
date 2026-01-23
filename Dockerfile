# Usa Node 18 en Alpine (más ligero)
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app/backend

# Copiamos package.json y package-lock.json primero (para cache de dependencias)
COPY backend/package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código fuente (incluye src y tsconfig.json)
COPY backend/ .

# Compilamos TypeScript dentro del contenedor
RUN npx tsc

# Exponemos el puerto del backend
EXPOSE 3000

# Arrancamos el servidor compilado
CMD ["node", "dist/server.js"]