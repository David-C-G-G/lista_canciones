// --- Mezclar Karaoke ---
export async function mezclarKaraoke(crearElementoCancion) {
  const res = await fetch("/songs/random/karaoke");
  if (!res.ok) {
    console.error("Error al mezclar karaoke");
    return;
  }
  const songs = await res.json();

  const mezclarKaraokeList = document.getElementById("mezclar-karaoke-list");
  mezclarKaraokeList.innerHTML = "";

  songs.forEach(song => {
    const li = crearElementoCancion(song);
    mezclarKaraokeList.appendChild(li);
  });
}

// --- Mezclar Baile ---
export async function mezclarBaile(crearElementoCancion) {
  const res = await fetch("/songs/random/baile");
  if (!res.ok) {
    console.error("Error al mezclar baile");
    return;
  }
  const songs = await res.json();

  const mezclarBaileList = document.getElementById("mezclar-baile-list");
  mezclarBaileList.innerHTML = "";

  songs.forEach(song => {
    const li = crearElementoCancion(song);
    mezclarBaileList.appendChild(li);
  });
}

// --- Inicializar botones de mezcla ---
export function inicializarMezcla(crearElementoCancion) {
  const mezclarKaraokeBtn = document.getElementById("mezclar-karaoke");
  const mezclarBaileBtn = document.getElementById("mezclar-baile");

  mezclarKaraokeBtn.addEventListener("click", () => mezclarKaraoke(crearElementoCancion));
  mezclarBaileBtn.addEventListener("click", () => mezclarBaile(crearElementoCancion));
}
