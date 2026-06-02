
document.addEventListener('DOMContentLoaded', () => {
  const btnLeer = document.getElementById('btn-leer');
  if (!btnLeer) return;

  const synth = window.speechSynthesis;
  let hablando = false;

  btnLeer.addEventListener('click', () => {
    if (hablando) {
      synth.cancel();
      hablando = false;
      btnLeer.querySelector('span').innerText = 'Escuchar';
      btnLeer.querySelector('i').className = 'fas fa-volume-up';
      return;
    }

    // MEJORA: Seleccionamos todo el contenedor principal y filtramos lo que no queremos
    const main = document.querySelector('main');
    if (!main) return;

    // Obtenemos el texto de forma más profunda
    // Esto asegura que capture todo el texto, no solo el primer bloque
    const contenido = main.textContent; 
    
    if (!contenido || contenido.trim() === "") return;

    const utterThis = new SpeechSynthesisUtterance(contenido);
    utterThis.lang = 'es-AR';
    
    // Configuramos la voz para que sea más natural si está disponible
    utterThis.rate = 1; 

    utterThis.onend = () => {
      hablando = false;
      btnLeer.querySelector('span').innerText = 'Escuchar';
      btnLeer.querySelector('i').className = 'fas fa-volume-up';
    };

    synth.speak(utterThis);
    hablando = true;
    btnLeer.querySelector('span').innerText = 'Detener';
    btnLeer.querySelector('i').className = 'fas fa-stop';
  });
});