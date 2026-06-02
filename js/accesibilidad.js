
const synth = window.speechSynthesis;
let hablando = false;
let utterThis = null;

function actualizarBoton(btn, estado) {
  const texto = btn.querySelector("span");
  const icono = btn.querySelector("i");

  if (estado === "leyendo") {
    if (texto) texto.innerText = "Detener";
    if (icono) icono.className = "fas fa-stop";
    btn.setAttribute("aria-label", "Detener lectura de la página");
  } else {
    if (texto) texto.innerText = "Escuchar";
    if (icono) icono.className = "fas fa-volume-up";
    btn.setAttribute("aria-label", "Escuchar contenido de la página");
  }
}

document.addEventListener("click", (event) => {
  const btnLeer = event.target.closest("#btn-leer");
  if (!btnLeer) return;

  if (!("speechSynthesis" in window)) {
    alert("Tu navegador no soporta lectura por voz.");
    return;
  }

  if (hablando) {
    synth.cancel();
    hablando = false;
    actualizarBoton(btnLeer, "idle");
    return;
  }

  synth.cancel();

  const contenido = document.body;
  const texto = contenido.innerText.replace(/\s+/g, " ").trim();

  if (!texto) return;

  utterThis = new SpeechSynthesisUtterance(texto);
  utterThis.lang = "es-AR";
  utterThis.rate = 1;
  utterThis.pitch = 1;

  utterThis.onend = () => {
    hablando = false;
    actualizarBoton(btnLeer, "idle");
  };

  utterThis.onerror = () => {
    hablando = false;
    actualizarBoton(btnLeer, "idle");
  };

  hablando = true;
  actualizarBoton(btnLeer, "leyendo");
  synth.speak(utterThis);
});