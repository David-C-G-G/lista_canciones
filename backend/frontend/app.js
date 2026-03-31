const form = document.getElementById("song-form");
const karaokeList = document.getElementById("karaoke-list");
const baileList = document.getElementById("baile-list");
const listarBtn = document.getElementById("listar");

const mezclarKaraokeBtn = document.getElementById("mezclar-karaoke");
const mezclarBaileBtn = document.getElementById("mezclar-baile");
const mezclarKaraokeList = document.getElementById("mezclar-karaoke-list");
const mezclarBaileList = document.getElementById("mezclar-baile-list");

const player = document.getElementById("song-player");

// --- Agregar canción ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cantante = document.getElementById("cantante").value;
  const nombre_cancion = document.getElementById("nombre_cancion").value;
  const tipo = document.getElementById("tipo").value;
  const nombre = document.getElementById("nombre").value;
  const apellido1 = document.getElementById("apellido1").value;
  const apellido2 = document.getElementById("apellido2").value;
  const url = document.getElementById("url").value;

  const res = await fetch("/songs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cantante, nombre_cancion, tipo, nombre, apellido1, apellido2, url })
  });

  if (res.ok) {
    form.reset();
    listarCanciones();
  } else {
    const error = await res.json();
    console.error("Error al agregar canción:", error);
    alert(error.error || "Error al agregar canción");
  }
});

// --- Listar canciones normales ---
listarBtn.addEventListener("click", listarCanciones);

async function listarCanciones() {
  const res = await fetch("/songs");
  const songs = await res.json();

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

// --- Crear elemento canción con click para reproducir ---
function crearElementoCancion(song) {
  const li = document.createElement("li");
  li.textContent = `${song.cantante} - ${song.nombre_cancion} - ${song.agregado_por}`;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // evitar que dispare el reproductor
    borrarCancion(song.id);
  });

  li.appendChild(deleteBtn);

  // Reproducir al hacer click
  li.addEventListener("click", () => {
    if (song.url) {
      player.src = song.url.replace("watch?v=", "embed/");
    }
  });

  return li;
}

// --- Borrar canción ---
async function borrarCancion(id) {
  const res = await fetch(`/songs/${id}`, { method: "DELETE" });
  if (res.ok) {
    listarCanciones();
  } else {
    console.error("Error al borrar canción");
  }
}

// --- Mezclar Karaoke ---
mezclarKaraokeBtn.addEventListener("click", async () => {
  const res = await fetch("/songs/random/karaoke");
  if (!res.ok) {
    console.error("Error al mezclar karaoke");
    return;
  }
  const songs = await res.json();

  mezclarKaraokeList.innerHTML = "";
  songs.forEach(song => {
    const li = crearElementoCancion(song);
    mezclarKaraokeList.appendChild(li);
  });
});

// --- Mezclar Baile ---
mezclarBaileBtn.addEventListener("click", async () => {
  const res = await fetch("/songs/random/baile");
  if (!res.ok) {
    console.error("Error al mezclar baile");
    return;
  }
  const songs = await res.json();

  mezclarBaileList.innerHTML = "";
  songs.forEach(song => {
    const li = crearElementoCancion(song);
    mezclarBaileList.appendChild(li);
  });
});

// Inicializar lista al cargar
listarCanciones();