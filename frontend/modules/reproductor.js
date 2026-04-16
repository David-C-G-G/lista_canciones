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

// --- Inicializar reproductor ---
export function inicializarReproductor(song) {
  if (!song.url) {
    alert("No hay URL para reproducir esta canción");
    return;
  }

  const videoId = extraerVideoId(song.url);
  if (!videoId) {
    alert("No se pudo extraer el videoId de la URL");
    return;
  }

  const player = document.getElementById("song-player");
  player.setAttribute("videoid", videoId);
  player.setAttribute("videotitle", song.nombre_cancion);
}
