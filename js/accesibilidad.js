
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

(function () {
  let lecturaActual = null;
  let nivelTexto = Number(localStorage.getItem("access_nivel_texto")) || 0;

  function aplicarTamanoTexto() {
    const tamanos = ["100%", "115%", "130%"];
    document.documentElement.style.fontSize = tamanos[nivelTexto] || "100%";
    localStorage.setItem("access_nivel_texto", String(nivelTexto));
  }

  function obtenerTextoPagina() {
    const main = document.querySelector("main") || document.body;
    return main.innerText.replace(/\s+/g, " ").trim();
  }

  function leerPagina() {
    if (!("speechSynthesis" in window)) {
      alert("Tu navegador no admite lectura de voz.");
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      return;
    }

    if (window.speechSynthesis.speaking) {
      return;
    }

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
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  function detenerLectura() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  function limpiarContrastes() {
    document.documentElement.classList.remove(
      "access-high-contrast",
      "access-invert",
      "access-grayscale"
    );
  }

  function guardarClases() {
    localStorage.setItem("access_classes", document.documentElement.className);
  }

  function ejecutarAccion(action) {
    if (action === "play") leerPagina();

    if (action === "pause") pausarLectura();

    if (action === "stop") detenerLectura();

    if (action === "font-up") {
      nivelTexto = Math.min(nivelTexto + 1, 2);
      aplicarTamanoTexto();
    }

    if (action === "font-down") {
      nivelTexto = Math.max(nivelTexto - 1, 0);
      aplicarTamanoTexto();
    }

    if (action === "font-readable") {
      document.documentElement.classList.toggle("access-font-readable");
      guardarClases();
    }

    if (action === "contrast") {
      const activo = document.documentElement.classList.contains("access-high-contrast");
      limpiarContrastes();
      if (!activo) document.documentElement.classList.add("access-high-contrast");
      guardarClases();
    }

    if (action === "invert") {
      const activo = document.documentElement.classList.contains("access-invert");
      limpiarContrastes();
      if (!activo) document.documentElement.classList.add("access-invert");
      guardarClases();
    }

    if (action === "grayscale") {
      const activo = document.documentElement.classList.contains("access-grayscale");
      limpiarContrastes();
      if (!activo) document.documentElement.classList.add("access-grayscale");
      guardarClases();
    }

    if (action === "reset") {
      detenerLectura();
      nivelTexto = 0;
      document.documentElement.style.fontSize = "100%";
      document.documentElement.classList.remove(
        "access-font-readable",
        "access-high-contrast",
        "access-invert",
        "access-grayscale"
      );
      localStorage.removeItem("access_nivel_texto");
      localStorage.removeItem("access_classes");
    }
  }

  document.addEventListener("click", function (event) {
    const boton = event.target.closest("[data-accessibility-action]");
    if (!boton) return;

    event.preventDefault();

    const action = boton.getAttribute("data-accessibility-action");
    ejecutarAccion(action);
  });

  document.addEventListener("DOMContentLoaded", function () {
    const clasesGuardadas = localStorage.getItem("access_classes");

    if (clasesGuardadas) {
      clasesGuardadas.split(" ").forEach(function (clase) {
        if (clase.startsWith("access-")) {
          document.documentElement.classList.add(clase);
        }
      });
    }

    aplicarTamanoTexto();
  });
})();

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!menuToggle || !mobileMenu) return;

  function cerrarMenu() {
    mobileMenu.classList.add("hidden");
    mobileMenu.classList.remove("flex");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
  }

  function abrirMenu() {
    mobileMenu.classList.remove("hidden");
    mobileMenu.classList.add("flex");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Cerrar menú de navegación");
  }

  menuToggle.addEventListener("click", function () {
    const estaAbierto = menuToggle.getAttribute("aria-expanded") === "true";

    if (estaAbierto) {
      cerrarMenu();
    } else {
      abrirMenu();
    }
  });

  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", cerrarMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") cerrarMenu();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024) cerrarMenu();
  });
});


 