export function inicializarFormulario(listarCanciones, crearElementoCancion) {
  const form = document.getElementById("song-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cantante = document.getElementById("cantante").value;
    const nombre_cancion = document.getElementById("nombre_cancion").value;
    const tipo = document.getElementById("tipo").value;
    const nombre = document.getElementById("nombre").value;
    const apellido1 = document.getElementById("apellido1").value;
    const apellido2 = document.getElementById("apellido2").value;
    const url = document.getElementById("url").value;

    // Validaciones básicas
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      alert("La URL debe ser de YouTube");
      return;
    }

    const res = await fetch("/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantante, nombre_cancion, tipo, nombre, apellido1, apellido2, url })
    });

    if (res.ok) {
      form.reset();
      listarCanciones(crearElementoCancion);
    } else {
      const error = await res.json();
      console.error("Error al agregar canción:", error);
      alert(error.error || "Error al agregar canción");
    }
  });
}
