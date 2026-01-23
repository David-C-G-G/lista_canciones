"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Configuración de conexión a Postgres (usa variables de entorno)
const pool = new pg_1.Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: Number(process.env.PGPORT),
});
// Crear tabla si no existe
(async () => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS songs (
      id SERIAL PRIMARY KEY,
      cantante TEXT NOT NULL,
      nombre_cancion TEXT NOT NULL,
      tipo TEXT NOT NULL
    )
  `);
})();
// Ruta para insertar canciones
app.post("/songs", async (req, res) => {
    const { cantante, nombre_cancion, tipo } = req.body;
    if (!cantante || !nombre_cancion || !tipo) {
        return res.status(400).json({ error: "cantante, nombre_cancion y tipo son requeridos" });
    }
    const result = await pool.query("INSERT INTO songs (cantante, nombre_cancion, tipo) VALUES ($1, $2, $3) RETURNING id", [cantante, nombre_cancion, tipo]);
    res.json({ id: result.rows[0].id, cantante, nombre_cancion, tipo });
});
// Ruta para listar canciones
app.get("/songs", async (req, res) => {
    const result = await pool.query("SELECT * FROM songs");
    res.json(result.rows);
});

// Ruta para borrar canción por id
app.delete("/songs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM songs WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Canción no encontrada" });
    }

    res.json({ message: "Canción eliminada", song: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar canción" });
  }
});

// Arrancar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
