// --- Buscar canciones por autor ---
export async function buscarPorAutor(autor) {
  const res = await fetch(`/songs/search/autor/${autor}`);
  if (!res.ok) throw new Error("Error al buscar por autor");
  return res.json();
}

// --- Buscar canciones por título ---
export async function buscarPorTitulo(titulo) {
  const res = await fetch(`/songs/search/titulo/${titulo}`);
  if (!res.ok) throw new Error("Error al buscar por título");
  return res.json();
}

// --- Mostrar resultados de búsqueda ---
export function mostrarResultadosBusqueda(songs, crearElementoCancion) {
  const resultadoBusqueda = document.getElementById("resultado-busqueda");
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
// --- Inicializar búsqueda ---
export function inicializarBusqueda(crearElementoCancion) {
  const buscarAutorBtn = document.getElementById("btn-buscar-autor");
  const buscarTituloBtn = document.getElementById("btn-buscar-titulo");

  
  buscarAutorBtn.addEventListener("click", async () => {
    const autor = document.getElementById("buscar-autor").value;
    if (!autor) {
      alert("Ingresa un autor para buscar");
      return;
    }
    try {
      const songs = await buscarPorAutor(autor);
      mostrarResultadosBusqueda(songs, crearElementoCancion);
    } catch (err) {
      alert(err.message);
    }
  });

  buscarTituloBtn.addEventListener("click", async () => {
    const titulo = document.getElementById("buscar-titulo").value;
    if (!titulo) {
      alert("Ingresa un título para buscar");
      return;
    }
    try {
      const songs = await buscarPorTitulo(titulo);
      mostrarResultadosBusqueda(songs, crearElementoCancion);
    } catch (err) {
      alert(err.message);
    }
  });
}
