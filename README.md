# 🎵 Songs App

Aplicación para registrar, listar y eliminar canciones de tipo **baile** y **karaoke**.  
Backend en **Node.js + Express + PostgreSQL**, frontend sencillo en **HTML/CSS/JS**.

---

## 🚀 Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) instalado y corriendo
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) (opcional, para levantar con contenedores)

---

## 📦 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/David-C-G-G/lista_canciones.git
   cd lista_canciones

2. - Instala dependencias:
    ```bash
    npm install

3. - Crea un archivo .env en la raíz con tus variables de entorno:
    ```bash
    DATABASE_URL=postgresql://usuario:password@localhost:5432/songsdb
    PORT=3000

## 🛠️ Levantar el proyecto

Opción A: Local sin Docker

1. - Compila TypeScript:
    ```bash
    npx tsc

2. - Arranca el servidor:
    ```bash
    node dist/server.js

3. - Abre el frontend:
    - Ve a frontend/index.html en tu navegador.
    - El backend estará disponible en http://localhost:3000.

Opción B: Con Docker Compose

1. - Levanta los servicios:
    ```bash
    docker-compose up --build

2. - El backend quedará corriendo en http://localhost:3000.

## 📋 Endpoints principales- GET /songs → Lista todas las canciones
- POST /songs → Agrega una canción
- DELETE /songs/:id → Elimina una canción por ID

## 👨‍💻 AutorProyecto creado por David C.G.G.



