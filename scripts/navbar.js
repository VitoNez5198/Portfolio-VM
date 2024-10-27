export function initNavbar() {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("show");
        hamburger.classList.toggle("show"); // Agregar clase para efecto en el botón

    });
}

document.addEventListener("DOMContentLoaded", initNavbar);
