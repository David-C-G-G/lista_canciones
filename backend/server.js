"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = Number(process.env.PORT) || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Configuración de conexión a Postgres (usa variables de entorno)
// const pool = new Pool({
//   host: process.env.PGHOST,
//   user: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   database: process.env.PGDATABASE,
//   port: Number(process.env.PGPORT),
// });
const pool = new pg_1.Pool({
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
app.post("/songs", async (req, res) => {
    const { cantante, nombre_cancion, tipo } = req.body;
    if (!cantante || !nombre_cancion || !tipo) {
        return res.status(400).json({ error: "cantante, nombre_cancion y tipo son requeridos" });
    }
    const result = await pool.query("INSERT INTO songs (cantante, nombre_cancion, tipo) VALUES ($1, $2, $3) RETURNING id", [cantante, nombre_cancion, tipo]);
    res.json({ id: result.rows[0].id, cantante, nombre_cancion, tipo });
});
// Ruta para listar canciones
app.get("/songs", async (_req, res) => {
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al eliminar canción" });
    }
});
// Arrancar servidor
// const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map