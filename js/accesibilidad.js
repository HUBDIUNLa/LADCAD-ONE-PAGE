
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