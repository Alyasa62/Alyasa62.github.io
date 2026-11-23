document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("nav");

    toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-img");

    document.querySelectorAll(".zoom").forEach((button) => {
        button.addEventListener("click", () => {
            const img = button.querySelector("img");
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightbox.showModal();
        });
    });

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) lightbox.close();
    });
});
