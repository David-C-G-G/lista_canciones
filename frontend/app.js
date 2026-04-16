import { inicializarBusqueda } from "./modules/busqueda.js";
import { listarCanciones, borrarCancion } from "./modules/listas.js";
import { inicializarMezcla } from "./modules/mezclar.js";
import { inicializarTema } from "./modules/tema.js";
import { inicializarFormulario } from "./modules/formulario.js";
import { inicializarReproductor } from "./modules/reproductor.js";

// --- Crear elemento canción con click para reproducir ---
function crearElementoCancion(song) {
  const li = document.createElement("li");
  li.textContent = `${song.cantante} - ${song.nombre_cancion} - ${song.agregado_por}`;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // evitar que dispare el reproductor
    borrarCancion(song.id, crearElementoCancion);
  });

  li.appendChild(deleteBtn);

  // Reproducir al hacer click
  li.addEventListener("click", () => inicializarReproductor(song));

  return li;
}

// Inicializar formulario
inicializarFormulario(listarCanciones, crearElementoCancion);

// Inicializar búsqueda
inicializarBusqueda(crearElementoCancion);

// Iniciarlizar mezcla
inicializarMezcla(crearElementoCancion);

// Inicializar lista al cargar
listarCanciones(crearElementoCancion);

// Inicializar tema día/noche
inicializarTema();


