document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("song-form");
  const listarBtn = document.getElementById("listar");
  const karaokeList = document.getElementById("karaoke-list");
  const baileList = document.getElementById("baile-list");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cantante = document.getElementById("cantante").value;
    const nombre_cancion = document.getElementById("nombre_cancion").value;
    const tipo = document.getElementById("tipo").value;

    const res = await fetch("http://localhost:3000/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantante, nombre_cancion, tipo })
    });

    if (res.ok) {
      form.reset();
      listarCanciones();
    }
  });

  listarBtn.addEventListener("click", listarCanciones);

  async function listarCanciones() {
    const res = await fetch("http://localhost:3000/songs");
    const songs = await res.json();

    // Limpia listas
    karaokeList.innerHTML = "";
    baileList.innerHTML = "";

    // Renderiza canciones con botón de borrar
    songs.forEach(song => {
      const li = document.createElement("li");
      li.textContent = `${song.cantante} - ${song.nombre_cancion}`;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌";
      deleteBtn.style.marginLeft = "10px";
      deleteBtn.addEventListener("click", () => borrarCancion(song.id));
      console.log({songId: song.id});

      li.appendChild(deleteBtn);

      if (song.tipo.toLowerCase() === "karaoke") {
        karaokeList.appendChild(li);
      } else if (song.tipo.toLowerCase() === "baile") {
        baileList.appendChild(li);
      }
    });
  }

  async function borrarCancion(id) {
    const res = await fetch(`http://localhost:3000/songs/${id}`, {
      method: "DELETE"
    });
    console.log({res});
    if (res.ok) {
      listarCanciones(); // refresca listas
    } else {
      const error = await res.json();
      console.error("Error al borrar canción:", error);
      alert("Error al borrar canción");
    }
  }
});
