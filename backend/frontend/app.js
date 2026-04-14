const form = document.getElementById("song-form");
const karaokeList = document.getElementById("karaoke-list");
const baileList = document.getElementById("baile-list");
const listarBtn = document.getElementById("listar");

const mezclarKaraokeBtn = document.getElementById("mezclar-karaoke");
const mezclarBaileBtn = document.getElementById("mezclar-baile");
const mezclarKaraokeList = document.getElementById("mezclar-karaoke-list");
const mezclarBaileList = document.getElementById("mezclar-baile-list");

const player = document.getElementById("song-player");

// --- Elementos de búsqueda ---
const buscarAutorBtn = document.getElementById("btn-buscar-autor");
const buscarTituloBtn = document.getElementById("btn-buscar-titulo");
const resultadoBusqueda = document.getElementById("resultado-busqueda");

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
      let videoId = null;

      // aqui se hace la conversion si es un enlace corto de YouTube
      if (song.url.includes("youtu.be/")) {
        // const videoId = videoId.split("youtu.be/")[1].split("?")[0];
        // videoId = `https://www.youtube.com/embed/${videoId}`;
        videoId = song.url.split("youtu.be/")[1].split("?")[0];
      }

      // si es un link normal con watch?v= se convierte a embed
      if(song.url.includes("watch?v=")) {
        // const videoId = videoId.split("watch?v=")[1].split("&")[0];
        // videoId = `https://www.youtube.com/embed/${videoId}`;
        videoId = song.url.split("watch?v=")[1].split("&")[0];
      }

      // si ya viene en formato embed se deja igual
      if(song.url.includes("/embed/")) {
        videoId = song.url.split("embed/")[1].split("?")[0];
      }

      // actualizar el componente lite-youtube con el nuevo videoId
      const player = document.getElementById("song-player");
      player.setAttribute("videoid", videoId);
      player.setAttribute("videotitle", song.nombre_cancion);
      // player.src = videoId;
    } else {
      alert("No hay URL para reproducir esta canción");
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

// --- Buscar por autor ---
buscarAutorBtn.addEventListener("click", async () => {
  const autor = document.getElementById("buscar-autor").value;
  if (!autor) {
    alert("Ingresa un autor para buscar");
    return;
  }
  const res = await fetch(`/songs/search/autor/${autor}`);
  if (!res.ok) {
    alert("Error al buscar por autor");
    return;
  }
  const songs = await res.json();
  mostrarResultadosBusqueda(songs);
});

// --- Buscar por título ---
buscarTituloBtn.addEventListener("click", async () => {
  const titulo = document.getElementById("buscar-titulo").value;
  if (!titulo) {
    alert("Ingresa un título para buscar");
    return;
  }
  const res = await fetch(`/songs/search/titulo/${titulo}`);
  if (!res.ok) {
    alert("Error al buscar por título");
    return;
  }
  const songs = await res.json();
  mostrarResultadosBusqueda(songs);
});

// --- Mostrar resultados de búsqueda ---
function mostrarResultadosBusqueda(songs) {
  resultadoBusqueda.innerHTML = "";
  if (songs.length === 0) {
    resultadoBusqueda.innerHTML = "<li>No se encontraron canciones</li>";
    return;
  }
  songs.forEach(song => {
    const li = crearElementoCancion(song);
    resultadoBusqueda.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleCheckbox = document.getElementById("toggle-theme");
  const body = document.body;

  // Tema inicial: Día
  body.classList.add("night");
  toggleCheckbox.checked = true;

  // toggleBtn.addEventListener("click", () => {
  //   if (body.classList.contains("day")) {
  //     body.classList.remove("day");
  //     body.classList.add("night");
  //   } else {
  //     body.classList.remove("night");
  //     body.classList.add("day");
  //   }
  // });
  toggleCheckbox.addEventListener("change", () => {
    if (toggleCheckbox.checked) {
      body.classList.remove("day");
      body.classList.add("night");
    } else {
      body.classList.remove("night");
      body.classList.add("day");
    }
  });
});


// Inicializar lista al cargar
listarCanciones();