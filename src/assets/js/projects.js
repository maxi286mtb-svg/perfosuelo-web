/* ==========================================================
   PROYECTOS.JS
   PÁGINA DE PROYECTOS
========================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* ======================================================
       SLIDER — PROYECTOS DESTACADOS
    ====================================================== */

    const slider = document.querySelector(
        ".proyectos-featured-slider"
    );

    const slides = document.querySelectorAll(
        ".proyecto-featured"
    );

    const prevButton = document.querySelector(
        ".slider-prev"
    );

    const nextButton = document.querySelector(
        ".slider-next"
    );

    const indicators = document.querySelectorAll(
        ".slider-indicators button"
    );


    if (slider && slides.length > 0) {


        let currentSlide = 0;
        let isAnimating = false;


        /* --------------------------------------------------
           Preparar slides
        -------------------------------------------------- */

        slides.forEach((slide, index) => {

            slide.classList.remove("is-active");

            if (index === 0) {
                slide.classList.add("is-active");
            }

        });


        /* --------------------------------------------------
           Mostrar slide
        -------------------------------------------------- */

        function showSlide(index, direction = "next") {


            if (isAnimating || slides.length <= 1) {
                return;
            }


            if (index < 0) {
                index = slides.length - 1;
            }


            if (index >= slides.length) {
                index = 0;
            }


            if (index === currentSlide) {
                return;
            }


            isAnimating = true;


            const current =
                slides[currentSlide];

            const next =
                slides[index];


            /* ----------------------------------------------
               Preparar dirección
            ---------------------------------------------- */

            const enterClass =
                direction === "next"
                    ? "slide-enter-right"
                    : "slide-enter-left";

            const exitClass =
                direction === "next"
                    ? "slide-exit-left"
                    : "slide-exit-right";


            /* ----------------------------------------------
               Preparar nuevo slide
            ---------------------------------------------- */

            next.classList.remove(
                "is-active",
                "slide-exit-left",
                "slide-exit-right",
                "slide-enter-left",
                "slide-enter-right"
            );


            current.classList.remove(
                "slide-enter-left",
                "slide-enter-right"
            );


            next.classList.add(
                enterClass
            );


            /* Forzar reflow para activar transición */

            void next.offsetWidth;


            /* ----------------------------------------------
               Animación
            ---------------------------------------------- */

            current.classList.remove(
                "is-active"
            );

            current.classList.add(
                exitClass
            );


            next.classList.add(
                "is-active"
            );


            next.classList.remove(
                enterClass
            );


            /* ----------------------------------------------
               Actualizar estado
            ---------------------------------------------- */

            currentSlide = index;


            /* ----------------------------------------------
               Indicadores
            ---------------------------------------------- */

            indicators.forEach(
                (indicator, indicatorIndex) => {

                    indicator.classList.toggle(
                        "active",
                        indicatorIndex === currentSlide
                    );

                }
            );


            /* ----------------------------------------------
               Finalizar animación
            ---------------------------------------------- */

            setTimeout(() => {

                current.classList.remove(
                    "slide-exit-left",
                    "slide-exit-right"
                );

                isAnimating = false;

            }, 650);

        }


        /* --------------------------------------------------
           Botón anterior
        -------------------------------------------------- */

        if (prevButton) {

            prevButton.addEventListener(
                "click",
                () => {

                    showSlide(
                        currentSlide - 1,
                        "prev"
                    );

                }
            );

        }


        /* --------------------------------------------------
           Botón siguiente
        -------------------------------------------------- */

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                () => {

                    showSlide(
                        currentSlide + 1,
                        "next"
                    );

                }
            );

        }


        /* --------------------------------------------------
           Indicadores
        -------------------------------------------------- */

        indicators.forEach(
            (indicator, index) => {

                indicator.addEventListener(
                    "click",
                    () => {

                        const direction =
                            index > currentSlide
                                ? "next"
                                : "prev";


                        showSlide(
                            index,
                            direction
                        );

                    }
                );

            }
        );


        /* --------------------------------------------------
           Teclado
        -------------------------------------------------- */

        slider.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "ArrowLeft") {

                    showSlide(
                        currentSlide - 1,
                        "prev"
                    );

                }


                if (event.key === "ArrowRight") {

                    showSlide(
                        currentSlide + 1,
                        "next"
                    );

                }

            }
        );


        /* --------------------------------------------------
           Swipe en móviles
        -------------------------------------------------- */

        let touchStartX = 0;
        let touchEndX = 0;


        slider.addEventListener(
            "touchstart",
            (event) => {

                touchStartX =
                    event.changedTouches[0].screenX;

            },
            { passive: true }
        );


        slider.addEventListener(
            "touchend",
            (event) => {

                touchEndX =
                    event.changedTouches[0].screenX;


                const difference =
                    touchStartX - touchEndX;


                if (Math.abs(difference) < 50) {
                    return;
                }


                if (difference > 0) {

                    showSlide(
                        currentSlide + 1,
                        "next"
                    );

                } else {

                    showSlide(
                        currentSlide - 1,
                        "prev"
                    );

                }

            },
            { passive: true }
        );


        /* --------------------------------------------------
           Estado inicial
        -------------------------------------------------- */

        indicators.forEach(
            (indicator, index) => {

                indicator.classList.toggle(
                    "active",
                    index === 0
                );

            }
        );

    }



    /* ======================================================
       FILTROS DE PROYECTOS
    ====================================================== */

    const filters = document.querySelectorAll(
        ".proyectos-filtros .filtro"
    );

    const projects = document.querySelectorAll(
        ".proyecto-card"
    );


    if (
        filters.length > 0 &&
        projects.length > 0
    ) {


        function filterProjects(category) {


            projects.forEach((project) => {


                const projectCategory =
                    project.dataset.category;


                const shouldShow =
                    category === "todos" ||
                    projectCategory === category;


                if (shouldShow) {

                    project.classList.remove(
                        "is-hidden"
                    );

                    project.classList.add(
                        "is-visible"
                    );

                } else {

                    project.classList.remove(
                        "is-visible"
                    );

                    project.classList.add(
                        "is-hidden"
                    );

                }

            });

        }


        filters.forEach((filter) => {


            filter.addEventListener(
                "click",
                () => {


                    const category =
                        filter.dataset.filter;


                    filters.forEach(
                        (item) => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    filter.classList.add(
                        "active"
                    );


                    filterProjects(category);

                }
            );

        });


        filterProjects("todos");

    }

});