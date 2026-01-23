import express, { Request, Response } from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
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
app.post("/songs", async (req: Request, res: Response) => {
  const { cantante, nombre_cancion, tipo } = req.body as {
    cantante: string;
    nombre_cancion: string;
    tipo: string;
  };

  if (!cantante || !nombre_cancion || !tipo) {
    return res.status(400).json({ error: "cantante, nombre_cancion y tipo son requeridos" });
  }

  const result = await pool.query(
    "INSERT INTO songs (cantante, nombre_cancion, tipo) VALUES ($1, $2, $3) RETURNING id",
    [cantante, nombre_cancion, tipo]
  );

  res.json({ id: result.rows[0].id, cantante, nombre_cancion, tipo });
});

// Ruta para listar canciones
app.get("/songs", async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM songs");
  res.json(result.rows);
});

// Ruta para borrar canción por id
app.delete("/songs/:id", async (req: Request, res: Response) => {
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
// const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});