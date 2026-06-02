
document.addEventListener('DOMContentLoaded', () => {
  const btnLeer = document.getElementById('btn-leer');
  
  // Verificamos si el botón existe antes de ejecutar nada para evitar errores en páginas que no lo tengan
  if (btnLeer) {
    const synth = window.speechSynthesis;
    let hablando = false;

    btnLeer.addEventListener('click', () => {
      if (!hablando) {
        // Buscamos el contenido principal
        const contenido = document.querySelector('main') ? document.querySelector('main').innerText : document.body.innerText;
        const utterThis = new SpeechSynthesisUtterance(contenido);
        
        utterThis.lang = 'es-AR';
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
  }
});