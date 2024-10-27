import { initNavbar } from './navbar.js';
import './scrollToTop.js';
import './formValidation.js';
import './projectSlider.js';
import { copiarCorreo } from './contact.js';

document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    
    const copiarButton = document.querySelector('.contact-email button');
    if (copiarButton) {
        copiarButton.addEventListener("click", (event) => {
            event.preventDefault(); // Evita el comportamiento por defecto del botón
            copiarCorreo(); // Llama a la función para copiar el correo
        });
    }
});
