
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

function obtenerEtiqueta(elemento) {
  return (
    elemento.getAttribute("aria-label") ||
    elemento.getAttribute("alt") ||
    elemento.innerText ||
    ""
  ).replace(/\s+/g, " ").trim();
}

function construirTextoAccesible() {
  const partes = [];
  const elementos = document.querySelectorAll(
    "header, nav, main, section, article, h1, h2, h3, p, li, a, button, summary, img"
  );

  elementos.forEach((elemento) => {
    if (elemento.closest("#cookie-privacy-banner")) return;
    if (elemento.closest("#modal-mapa-predio")) return;
    if (elemento.id === "btn-leer") return;

    const texto = obtenerEtiqueta(elemento);
    if (!texto) return;

    if (elemento.tagName === "HEADER") {
      partes.push("Encabezado del sitio.");
      return;
    }

    if (elemento.tagName === "NAV") {
      const nombre = elemento.getAttribute("aria-label") || "Navegación";
      partes.push(`${nombre}.`);
      return;
    }

    if (elemento.tagName === "MAIN") {
      partes.push("Contenido principal.");
      return;
    }

    if (elemento.tagName === "SECTION") {
      partes.push("Nueva sección.");
      return;
    }

    if (elemento.tagName === "ARTICLE") {
      partes.push("Artículo.");
      return;
    }

    if (elemento.tagName === "H1") {
      partes.push(`Título principal: ${texto}.`);
      return;
    }

    if (elemento.tagName === "H2") {
      partes.push(`Título de sección: ${texto}.`);
      return;
    }

    if (elemento.tagName === "H3") {
      partes.push(`Subtítulo: ${texto}.`);
      return;
    }

    if (elemento.tagName === "A") {
      partes.push(`Enlace: ${texto}.`);
      return;
    }

    if (elemento.tagName === "BUTTON") {
      partes.push(`Botón: ${texto}.`);
      return;
    }

    if (elemento.tagName === "SUMMARY") {
      partes.push(`Elemento desplegable: ${texto}.`);
      return;
    }

    if (elemento.tagName === "IMG") {
      partes.push(`Imagen: ${texto}.`);
      return;
    }

    partes.push(`${texto}.`);
  });

  return partes.join(" ");
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

  const texto = construirTextoAccesible();

  if (!texto) return;

  utterThis = new SpeechSynthesisUtterance(texto);
  utterThis.lang = "es-AR";

  // Más bajo = más lento. Probá entre 0.75 y 0.9.
  utterThis.rate = 0.82;
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

  let lecturaActual = null;
  let nivelTexto = 0;

  function obtenerTextoPagina() {
    const main = document.querySelector("main") || document.body;

    return main.innerText
      .replace(/\s+/g, " ")
      .trim();
  }

  function leerPagina() {
    if (!("speechSynthesis" in window)) {
      alert("Tu navegador no admite lectura de voz.");
      return;
    }

    detenerLectura();

    const texto = obtenerTextoPagina();

    if (!texto) {
      alert("No hay texto disponible para leer.");
      return;
    }

    lecturaActual = new SpeechSynthesisUtterance(texto);
    lecturaActual.lang = "es-AR";
    lecturaActual.rate = 0.95;
    lecturaActual.pitch = 1;
    lecturaActual.volume = 1;

    window.speechSynthesis.speak(lecturaActual);
  }

  function pausarLectura() {
    if (!("speechSynthesis" in window)) return;

    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    } else if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  function detenerLectura() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  function aumentarTexto() {
    document.body.classList.remove("font-large", "font-xlarge");

    if (nivelTexto === 0) {
      nivelTexto = 1;
      document.body.classList.add("font-large");
    } else {
      nivelTexto = 2;
      document.body.classList.add("font-xlarge");
    }

    localStorage.setItem("accesibilidad_nivel_texto", nivelTexto);
  }

  function disminuirTexto() {
    document.body.classList.remove("font-large", "font-xlarge");

    if (nivelTexto > 0) {
      nivelTexto--;
    }

    if (nivelTexto === 1) {
      document.body.classList.add("font-large");
    }

    localStorage.setItem("accesibilidad_nivel_texto", nivelTexto);
  }

  function activarTipografiaLegible() {
    document.body.classList.toggle("font-readable");
    guardarEstadoAccesibilidad();
  }

  function limpiarContrastes() {
    document.body.classList.remove("high-contrast", "inverted-contrast", "grayscale-mode");
  }

  function activarAltoContraste() {
    const activo = document.body.classList.contains("high-contrast");
    limpiarContrastes();

    if (!activo) {
      document.body.classList.add("high-contrast");
    }

    guardarEstadoAccesibilidad();
  }

  function activarContrasteInvertido() {
    const activo = document.body.classList.contains("inverted-contrast");
    limpiarContrastes();

    if (!activo) {
      document.body.classList.add("inverted-contrast");
    }

    guardarEstadoAccesibilidad();
  }

  function activarEscalaGrises() {
    const activo = document.body.classList.contains("grayscale-mode");
    limpiarContrastes();

    if (!activo) {
      document.body.classList.add("grayscale-mode");
    }

    guardarEstadoAccesibilidad();
  }

  function restablecerAccesibilidad() {
    detenerLectura();

    nivelTexto = 0;

    document.body.classList.remove(
      "font-large",
      "font-xlarge",
      "font-readable",
      "high-contrast",
      "inverted-contrast",
      "grayscale-mode"
    );

    localStorage.removeItem("accesibilidad_estado");
    localStorage.removeItem("accesibilidad_nivel_texto");
  }

  function guardarEstadoAccesibilidad() {
    const estado = {
      readable: document.body.classList.contains("font-readable"),
      highContrast: document.body.classList.contains("high-contrast"),
      inverted: document.body.classList.contains("inverted-contrast"),
      grayscale: document.body.classList.contains("grayscale-mode")
    };

    localStorage.setItem("accesibilidad_estado", JSON.stringify(estado));
  }

  function cargarEstadoAccesibilidad() {
    const estadoGuardado = localStorage.getItem("accesibilidad_estado");
    const textoGuardado = localStorage.getItem("accesibilidad_nivel_texto");

    if (textoGuardado) {
      nivelTexto = parseInt(textoGuardado, 10);

      if (nivelTexto === 1) {
        document.body.classList.add("font-large");
      }

      if (nivelTexto === 2) {
        document.body.classList.add("font-xlarge");
      }
    }

    if (!estadoGuardado) return;

    const estado = JSON.parse(estadoGuardado);

    if (estado.readable) document.body.classList.add("font-readable");
    if (estado.highContrast) document.body.classList.add("high-contrast");
    if (estado.inverted) document.body.classList.add("inverted-contrast");
    if (estado.grayscale) document.body.classList.add("grayscale-mode");
  }

  document.addEventListener("DOMContentLoaded", cargarEstadoAccesibilidad);