import express, { Request, Response } from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

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

// --- Función para normalizar texto ---
function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")              // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .replace(/\s+/g, "");          // quita espacios
}

// Crear tabla si no existe (ahora con columna url y clave_normalizada)
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS songs (
      id SERIAL PRIMARY KEY,
      cantante TEXT NOT NULL,
      nombre_cancion TEXT NOT NULL,
      tipo TEXT NOT NULL,
      agregado_por TEXT NOT NULL,
      url TEXT NOT NULL,
      clave_normalizada TEXT NOT NULL
    )
  `);
})();

// Ruta para insertar canciones
app.post("/songs", async (req: Request, res: Response) => {
  const { cantante, nombre_cancion, tipo, nombre, apellido1, apellido2, url } = req.body;

  if (!cantante || !nombre_cancion || !tipo || !nombre || !apellido1 || !apellido2 || !url) {
    return res.status(400).json({ error: "todos los campos son requeridos" });
  }

  const iniciales = `${nombre[0]}${apellido1[0]}${apellido2[0]}`.toUpperCase();

  // Normalizar clave (cantante + canción)
  const claveNormalizada = normalizarTexto(cantante + nombre_cancion);

  // Verificar si ya existe
  const existe = await pool.query("SELECT 1 FROM songs WHERE clave_normalizada = $1", [claveNormalizada]);
  if ((existe.rowCount ?? 0) > 0) {
    return res.status(400).json({ error: "⚠️ Esta canción ya está registrada para este autor" });
  }

  const result = await pool.query(
    "INSERT INTO songs (cantante, nombre_cancion, tipo, agregado_por, url, clave_normalizada) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
    [cantante, nombre_cancion, tipo, iniciales, url, claveNormalizada]
  );

  res.json({ id: result.rows[0].id, cantante, nombre_cancion, tipo, agregado_por: iniciales, url });
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

// --- Función auxiliar para mezclar por agregado_por ---
function mezclarPorAgregadoPor(
  songs: { id: number; cantante: string; nombre_cancion: string; tipo: string; agregado_por: string; url: string; clave_normalizada: string }[]
) {
  const grupos: Record<string, typeof songs> = {};
  songs.forEach((song) => {
    if (!grupos[song.agregado_por]) grupos[song.agregado_por] = [];
    grupos[song.agregado_por].push(song);
  });

  Object.keys(grupos).forEach((key) => {
    grupos[key] = grupos[key].sort(() => Math.random() - 0.5);
  });

  const ordenFinal: typeof songs = [];
  let hayCanciones = true;

  while (hayCanciones) {
    hayCanciones = false;
    for (const key of Object.keys(grupos)) {
      if (grupos[key].length > 0) {
        const song = grupos[key].shift()!;
        if (ordenFinal.length === 0 || ordenFinal[ordenFinal.length - 1].agregado_por !== song.agregado_por) {
          ordenFinal.push(song);
          hayCanciones = true;
        } else {
          grupos[key].push(song);
        }
      }
    }
  }

  return ordenFinal;
}

// --- Mezclar Karaoke ---
app.get("/songs/random/karaoke", async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM songs WHERE tipo = 'karaoke'");
  res.json(mezclarPorAgregadoPor(result.rows));
});

// --- Mezclar Baile ---
app.get("/songs/random/baile", async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM songs WHERE tipo = 'baile'");
  res.json(mezclarPorAgregadoPor(result.rows));
});

// --- Buscar por autor ---
app.get("/songs/search/autor/:autor", async (req: Request, res: Response) => {
  const autor = normalizarTexto(req.params.autor);

  const result = await pool.query("SELECT * FROM songs");
  const filtrados = result.rows.filter(song => normalizarTexto(song.cantante).includes(autor));

  res.json(filtrados);
});

// --- Buscar por título ---
app.get("/songs/search/titulo/:titulo", async (req: Request, res: Response) => {
  const titulo = normalizarTexto(req.params.titulo);

  const result = await pool.query("SELECT * FROM songs");
  const filtrados = result.rows.filter(song => normalizarTexto(song.nombre_cancion).includes(titulo));

  res.json(filtrados);
});

// --- Servir frontend ---
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));
app.get("/", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Arrancar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});