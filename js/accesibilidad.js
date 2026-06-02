
document.addEventListener('DOMContentLoaded', () => {
  const btnLeer = document.getElementById('btn-leer');

  // Si el botón no existe en esta página, simplemente salimos del script sin errores
  if (!btnLeer) return;

  const synth = window.speechSynthesis;
  let hablando = false;

  btnLeer.addEventListener('click', () => {
    if (!hablando) {
      // Intentamos obtener el main, si no, el body
      const main = document.querySelector('main');
      const contenido = main ? main.innerText : document.body.innerText;
      
      const utterThis = new SpeechSynthesisUtterance(contenido);
      utterThis.lang = 'es-AR';
      
      // Manejador para cuando termina de hablar
      utterThis.onend = () => {
        hablando = false;
        btnLeer.querySelector('span').innerText = 'Escuchar';
        btnLeer.querySelector('i').className = 'fas fa-volume-up';
      };

      synth.speak(utterThis);
      hablando = true;
      btnLeer.querySelector('span').innerText = 'Detener';
      btnLeer.querySelector('i').className = 'fas fa-stop';
    } else {
      synth.cancel();
      hablando = false;
      btnLeer.querySelector('span').innerText = 'Escuchar';
      btnLeer.querySelector('i').className = 'fas fa-volume-up';
    }
  });
});