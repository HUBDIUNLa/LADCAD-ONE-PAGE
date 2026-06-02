
document.addEventListener('DOMContentLoaded', () => {
  const btnLeer = document.getElementById('btn-leer');
  if (!btnLeer) return;

  const synth = window.speechSynthesis;
  let hablando = false;

  btnLeer.addEventListener('click', () => {
    // 1. Buscamos TODOS los videos y los silenciamos/pausamos
    const todosLosVideos = document.querySelectorAll('video');
    
    if (!hablando) {
      // Detenemos cualquier audio que esté sonando en videos
      todosLosVideos.forEach(v => {
        v.muted = true; // Forzamos silencio
        v.pause();      // Forzamos pausa
      });

      // 2. Preparamos el contenido
      const main = document.querySelector('main');
      const contenido = main ? main.innerText : document.body.innerText;
      
      const utterThis = new SpeechSynthesisUtterance(contenido);
      utterThis.lang = 'es-AR';
      utterThis.rate = 1; // Velocidad normal

      // 3. Cuando termina o se cancela
      utterThis.onend = () => {
        restaurarBoton();
      };
      
      utterThis.onerror = () => {
        restaurarBoton();
      };

      synth.speak(utterThis);
      hablando = true;
      btnLeer.querySelector('span').innerText = 'Detener';
      btnLeer.querySelector('i').className = 'fas fa-stop';
      
    } else {
      synth.cancel();
      restaurarBoton();
    }
  });

  function restaurarBoton() {
    hablando = false;
    btnLeer.querySelector('span').innerText = 'Escuchar';
    btnLeer.querySelector('i').className = 'fas fa-volume-up';
  }
});