
document.addEventListener('DOMContentLoaded', () => {
  const btnLeer = document.getElementById('btn-leer');
  if (!btnLeer) return;

  const synth = window.speechSynthesis;
  let hablando = false;

  btnLeer.addEventListener('click', () => {
    // Si ya está hablando, detenemos
    if (hablando) {
      synth.cancel();
      hablando = false;
      btnLeer.querySelector('span').innerText = 'Escuchar';
      btnLeer.querySelector('i').className = 'fas fa-volume-up';
      return;
    }

    // Si el navegador tiene el audio en pausa por seguridad, intentamos reanudar
    if (synth.paused) {
      synth.resume();
    }

    // Seleccionamos el contenido de <main>
    const main = document.querySelector('main');
    if (!main) return;

    const contenido = main.textContent; 
    
    if (!contenido || contenido.trim() === "") return;

    // Crear la instancia de voz
    const utterThis = new SpeechSynthesisUtterance(contenido);
    utterThis.lang = 'es-AR';
    utterThis.rate = 1; 

    // Cuando termina de leer
    utterThis.onend = () => {
      hablando = false;
      btnLeer.querySelector('span').innerText = 'Escuchar';
      btnLeer.querySelector('i').className = 'fas fa-volume-up';
    };

    // Lanzar la lectura
    synth.speak(utterThis);
    hablando = true;
    btnLeer.querySelector('span').innerText = 'Detener';
    btnLeer.querySelector('i').className = 'fas fa-stop';
  });
});