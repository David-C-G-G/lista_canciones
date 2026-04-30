// --- Obtener videoId desde una URL de YouTube ---
function extraerVideoId(url) {
  let videoId = null;

  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  }
  if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1].split("&")[0];
  }
  if (url.includes("/embed/")) {
    videoId = url.split("embed/")[1].split("?")[0];
  }

  return videoId;
}

// --- Estado interno del reproductor ---
let listaActiva = [];
let indiceActual = 0;

// --- Inicializar reproductor con una canción ---
export function inicializarReproductor(song, lista = [], indice = 0) {
  if (!song.url) {
    alert("No hay URL para reproducir esta canción");
    return;
  }

  const videoId = extraerVideoId(song.url);
  if (!videoId) {
    alert("No se pudo extraer el videoId de la URL");
    return;
  }

  // Guardar lista activa y posición actual
  listaActiva = lista;
  indiceActual = indice;

  const player = window.player; // ✅ usamos el player global creado en index.html

  if (player && typeof player.loadVideoById === "function") {
    player.loadVideoById(videoId);
  } else {
    console.warn("El reproductor aún no está listo, se inicializará con la API.");
    window.videoInicial = videoId;
  }
}

// --- Reproducir siguiente canción automáticamente ---
export function reproducirSiguiente() {
  indiceActual++;
  if (indiceActual < listaActiva.length) {
    inicializarReproductor(listaActiva[indiceActual], listaActiva, indiceActual);
  } else {
    console.log("Fin de la lista activa");
  }
}
window.reproducirSiguiente = reproducirSiguiente;  // Exponer función globalmente para el evento de YouTube

// --- Detectar fin de canción con YouTube API ---
export function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    reproducirSiguiente();
  }
}
