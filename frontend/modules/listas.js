// --- Listar canciones ---
export async function listarCanciones(crearElementoCancion) {
  const res = await fetch("/songs");
  const songs = await res.json();

  const karaokeList = document.getElementById("karaoke-list");
  const baileList = document.getElementById("baile-list");

  karaokeList.innerHTML = "";
  baileList.innerHTML = "";

  songs.forEach(song => {
    const li = crearElementoCancion(song);
    if (song.tipo.toLowerCase() === "karaoke") {
      karaokeList.appendChild(li);
    } else if (song.tipo.toLowerCase() === "baile") {
      baileList.appendChild(li);
    }
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
