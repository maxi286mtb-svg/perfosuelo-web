/* ==========================================================
   PERFOSUELO
   GALERÍA EMPRESA
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const mainImage =
        document.querySelector("#empresaGalleryMain");

    const thumbnails =
        document.querySelectorAll(".empresa-gallery__thumb");


    if (!mainImage || !thumbnails.length) {
        return;
    }


    thumbnails.forEach((thumbnail) => {

        thumbnail.addEventListener("click", () => {

            const image =
                thumbnail.dataset.image;

            const alt =
                thumbnail.dataset.alt;


            if (!image) {
                return;
            }


            /* Cambiar imagen principal */

            mainImage.style.opacity = "0";


            setTimeout(() => {

                mainImage.src = image;

                if (alt) {
                    mainImage.alt = alt;
                }

                mainImage.style.opacity = "1";

            }, 150);


            /* Cambiar miniatura activa */

            thumbnails.forEach((item) => {

                item.classList.remove("is-active");

            });


            thumbnail.classList.add("is-active");

        });

    });

});