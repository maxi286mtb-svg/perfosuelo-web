// ==========================================================
// HEADER.JS
// Cambia el aspecto del header al hacer scroll
// ==========================================================

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {
        header.classList.add("header--scrolled");
    } else {
        header.classList.remove("header--scrolled");
    }

});