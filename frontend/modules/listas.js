import { inicializarReproductor } from "./reproductor.js";

// --- Listar canciones ---
export async function listarCanciones(crearElementoCancion) {
  const res = await fetch("/songs");
  const songs = await res.json();

  const karaokeList = document.getElementById("karaoke-list");
  const baileList = document.getElementById("baile-list");

  karaokeList.innerHTML = "";
  baileList.innerHTML = "";

  // --- FUNCIONALIDAD ACTUAL ---
  // Filtramos primero por tipo y luego recorremos con índice propio
  const karaokeSongs = songs.filter(s => s.tipo && s.tipo.toLowerCase() === "karaoke");
  karaokeSongs.forEach((song, i) => {
    const li = crearElementoCancion(song);
    li.addEventListener("click", () => {
      inicializarReproductor(song, karaokeSongs, i);
    });
    karaokeList.appendChild(li);
  });

  const baileSongs = songs.filter(s => s.tipo && s.tipo.toLowerCase() === "baile");
  baileSongs.forEach((song, i) => {
    const li = crearElementoCancion(song);
    li.addEventListener("click", () => {
      inicializarReproductor(song, baileSongs, i);
    });
    baileList.appendChild(li);
  });
}

// --- Borrar canción ---
export async function borrarCancion(id, crearElementoCancion) {
  const res = await fetch(`/songs/${id}`, { method: "DELETE" });
  if (res.ok) {
    // refrescar lista después de borrar
    listarCanciones(crearElementoCancion);
  } else {
    console.error("Error al borrar canción");
  }
}
