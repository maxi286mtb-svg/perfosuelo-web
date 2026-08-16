/* ==========================================================
   PROJECTS SLIDER
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const track = document.querySelector(".projects__track");
    const slides = [...document.querySelectorAll(".project-slide")];
    const nextBtn = document.querySelector(".projects__arrow--next");
    const prevBtn = document.querySelector(".projects__arrow--prev");
    const dots = [...document.querySelectorAll(".projects__pagination span")];

    let currentIndex = 0;

    function getVisibleSlides() {

        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;

    }

    function updateSlider() {

        const visible = getVisibleSlides();

        const slideWidth = slides[0].getBoundingClientRect().width;

        const gap = parseFloat(getComputedStyle(track).gap);

        const offset = currentIndex * (slideWidth + gap);

        track.style.transform = `translateX(-${offset}px)`;

        dots.forEach(dot => dot.classList.remove("active"));

        const totalPages = slides.length - visible + 1;

        const activeDot = Math.min(currentIndex, dots.length - 1);

        if (dots[activeDot]) {

            dots[activeDot].classList.add("active");

        }

    }

    nextBtn.addEventListener("click", () => {

        const maxIndex = slides.length - getVisibleSlides();

        if (currentIndex < maxIndex) {

            currentIndex++;

        } else {

            currentIndex = 0;

        }

        updateSlider();

    });

    prevBtn.addEventListener("click", () => {

        const maxIndex = slides.length - getVisibleSlides();

        if (currentIndex > 0) {

            currentIndex--;

        } else {

            currentIndex = maxIndex;

        }

        updateSlider();

    });

    window.addEventListener("resize", updateSlider);

    updateSlider();

});