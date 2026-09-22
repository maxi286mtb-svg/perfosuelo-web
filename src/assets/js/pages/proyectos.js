 /* ==========================================================
    PROYECTOS.JS
    PÁGINA DE PROYECTOS
========================================================== */


/* ==========================================================
   PROYECTOS DESTACADOS
========================================================== */

document.addEventListener("DOMContentLoaded", () => {


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


    /* ------------------------------------------------------
       Si no existen proyectos destacados, salir
    ------------------------------------------------------ */

    if (!slider || slides.length === 0) {
        return;
    }


    let currentSlide = 0;


    /* ------------------------------------------------------
       Preparar slider
    ------------------------------------------------------ */

    slides.forEach((slide, index) => {

        slide.style.display =
            index === 0
                ? "grid"
                : "none";

    });


    /* ------------------------------------------------------
       Mostrar slide
    ------------------------------------------------------ */

    function showSlide(index) {


        if (index < 0) {

            index = slides.length - 1;

        }


        if (index >= slides.length) {

            index = 0;

        }


        currentSlide = index;


        slides.forEach((slide, slideIndex) => {

            const isActive =
                slideIndex === currentSlide;


            slide.style.display =
                isActive
                    ? "grid"
                    : "none";


            slide.setAttribute(
                "aria-hidden",
                isActive
                    ? "false"
                    : "true"
            );

        });


        /* --------------------------------------------------
           Actualizar indicadores
        -------------------------------------------------- */

        indicators.forEach(
            (indicator, indicatorIndex) => {

                indicator.classList.toggle(
                    "active",
                    indicatorIndex === currentSlide
                );

            }
        );

    }


    /* ------------------------------------------------------
       Proyecto anterior
    ------------------------------------------------------ */

    if (prevButton) {

        prevButton.addEventListener(
            "click",
            () => {

                showSlide(
                    currentSlide - 1
                );

            }
        );

    }


    /* ------------------------------------------------------
       Proyecto siguiente
    ------------------------------------------------------ */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                showSlide(
                    currentSlide + 1
                );

            }
        );

    }


    /* ------------------------------------------------------
       Indicadores
    ------------------------------------------------------ */

    indicators.forEach(
        (indicator, index) => {

            indicator.addEventListener(
                "click",
                () => {

                    showSlide(index);

                }
            );

        }
    );


    /* ------------------------------------------------------
       Navegación con teclado
    ------------------------------------------------------ */

    slider.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "ArrowLeft") {

                showSlide(
                    currentSlide - 1
                );

            }


            if (event.key === "ArrowRight") {

                showSlide(
                    currentSlide + 1
                );

            }

        }
    );


    /* ------------------------------------------------------
       Estado inicial
    ------------------------------------------------------ */

    showSlide(0);

});



/* ==========================================================
   FILTROS DE PROYECTOS
========================================================== */

document.addEventListener("DOMContentLoaded", () => {


    const filters = document.querySelectorAll(
        ".proyectos-filtros .filtro"
    );

    const projects = document.querySelectorAll(
        ".proyecto-card"
    );


    /* ------------------------------------------------------
       Si no hay filtros o proyectos, salir
    ------------------------------------------------------ */

    if (
        filters.length === 0 ||
        projects.length === 0
    ) {

        return;

    }


    /* ------------------------------------------------------
       Aplicar filtro
    ------------------------------------------------------ */

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


    /* ------------------------------------------------------
       Eventos de los filtros
    ------------------------------------------------------ */

    filters.forEach((filter) => {


        filter.addEventListener(
            "click",
            () => {


                /* ------------------------------------------
                   Obtener categoría
                ------------------------------------------ */

                const category =
                    filter.dataset.filter;


                /* ------------------------------------------
                   Actualizar botón activo
                ------------------------------------------ */

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


                /* ------------------------------------------
                   Aplicar filtro
                ------------------------------------------ */

                filterProjects(category);

            }
        );

    });


    /* ------------------------------------------------------
       Estado inicial
    ------------------------------------------------------ */

    filterProjects("todos");

});