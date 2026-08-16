/* ==========================================================
   CLIENTES
========================================================== */

const clientsSection = document.querySelector(".clients");

const clientsObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            clientsSection.classList.add("active");

        }else{

            clientsSection.classList.remove("active");

        }

    });

},{
    threshold:0.35
});

clientsObserver.observe(clientsSection);

/* ==========================================================
   ESTADÍSTICAS
========================================================== */

const statsSection = document.querySelector(".stats");
const counters = document.querySelectorAll(".counter");

let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {

    if (entries[0].isIntersecting && !statsAnimated) {

        statsAnimated = true;

        counters.forEach(counter => {

            const target = Number(counter.dataset.target);

            const duration = 2000;

            const start = performance.now();

            function update(now){

                const rawProgress = Math.min((now - start) / duration, 1);

const progress = 1 - Math.pow(1 - rawProgress, 3);

                const current = Math.floor(progress * target);

                counter.textContent = current.toLocaleString("es-AR");

                if(progress < 1){

                    requestAnimationFrame(update);

                }else{

    if(target >= 1000){

        counter.textContent = "+" + target.toLocaleString("es-AR");

    }else{

        counter.textContent = target.toLocaleString("es-AR") + "+";

    }

}

            }

            requestAnimationFrame(update);

        });

    }

},{
    threshold:0.4
});

statsObserver.observe(statsSection);