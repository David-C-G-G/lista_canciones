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

    ## ⚙️ Configuración de variables de entorno

    El proyecto usa un archivo `.env` en la raíz. Ejemplo:

    ```env
    PGHOST=db
    PGUSER=tuusuario
    PGPASSWORD=tupassword
    PGDATABASE=songsdb
    PGPORT=5432
    PORT=3000
    DATABASE_URL=postgresql://tuusuario:tupassword@db:5432/songsdb


## 🐳 Levantar el proyecto con Docker Compos

1. - Levanta los servicios:
    ```bash
    docker-compose up --build
2. - Usa --no-cache si cambias dependencias o el Dockerfile
    ```bash
    docker-compose build --no-cache

3. - Levantar los servicios:
    ```bash
    docker-compose up

4. - El backend quedará corriendo en http://localhost:3000.

5. - El frontend quedará corriendo en http://localhost:8080.

3. - Parar los servicios:
    ```bash
    docker-compose down

## 📋 Endpoints principales- GET /songs → Lista todas las canciones
- POST /songs → Agrega una canción
- DELETE /songs/:id → Elimina una canción por ID

## 👨‍💻 AutorProyecto creado por David C.G.G.



