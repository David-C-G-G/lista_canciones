// --- Inicializar tema día/noche ---
export function inicializarTema() {
  const toggleCheckbox = document.getElementById("toggle-theme");
  const body = document.body;

  // Tema inicial: Noche
  body.classList.add("night");
  toggleCheckbox.checked = true;

  toggleCheckbox.addEventListener("change", () => {
    if (toggleCheckbox.checked) {
      body.classList.remove("day");
      body.classList.add("night");
    } else {
      body.classList.remove("night");
      body.classList.add("day");
    }
  });
}
