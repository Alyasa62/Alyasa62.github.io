document.addEventListener("DOMContentLoaded", () => {
    const page = document.body;
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-links a, .nav-cta");
    const dialog = document.getElementById("project-dialog");
    const dialogBody = document.getElementById("project-dialog-body");
    const dialogCloseButton = document.querySelector(".project-dialog__close");
    const modalTriggers = document.querySelectorAll("[data-modal-template]");
    const revealElements = document.querySelectorAll("[data-reveal]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lastTrigger = null;

    function syncPageLock() {
        const menuOpen = navMenu?.classList.contains("is-open");
        const dialogOpen = dialog?.open;
        page.classList.toggle("is-locked", Boolean(menuOpen || dialogOpen));
    }

    function closeMenu() {
        if (!navToggle || !navMenu) {
            return;
        }

        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open site navigation");
        syncPageLock();
    }

    function toggleMenu() {
        if (!navToggle || !navMenu) {
            return;
        }

        const isOpen = navMenu.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Close site navigation" : "Open site navigation");
        syncPageLock();
    }

    function setupNavigation() {
        if (!navToggle || !navMenu) {
            return;
        }

        navToggle.addEventListener("click", toggleMenu);

        navLinks.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 896) {
                closeMenu();
            }
        });

        document.addEventListener("click", (event) => {
            if (!navMenu.classList.contains("is-open")) {
                return;
            }

            const target = event.target;
            if (!(target instanceof Node)) {
                return;
            }

            if (!navMenu.contains(target) && !navToggle.contains(target)) {
                closeMenu();
            }
        });
    }

    function setupReveal() {
        if (reducedMotion.matches || !("IntersectionObserver" in window)) {
            revealElements.forEach((element) => {
                element.classList.add("is-visible");
            });
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -48px 0px"
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    }

    function closeDialog() {
        if (!dialog?.open) {
            return;
        }

        dialog.close();
    }

    function openDialog(templateId, trigger) {
        const template = document.getElementById(templateId);

        if (!dialog || !dialogBody || !(template instanceof HTMLTemplateElement)) {
            return;
        }

        dialogBody.innerHTML = "";
        dialogBody.appendChild(template.content.cloneNode(true));

        lastTrigger = trigger;
        dialog.showModal();
        dialogCloseButton?.focus();
        syncPageLock();
    }

    function setupDialog() {
        if (!dialog || !dialogBody) {
            return;
        }

        modalTriggers.forEach((trigger) => {
            trigger.addEventListener("click", () => {
                const templateId = trigger.getAttribute("data-modal-template");

                if (!templateId) {
                    return;
                }

                closeMenu();
                openDialog(templateId, trigger);
            });
        });

        dialogCloseButton?.addEventListener("click", closeDialog);

        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) {
                closeDialog();
            }
        });

        dialog.addEventListener("close", () => {
            dialogBody.innerHTML = "";
            syncPageLock();

            if (lastTrigger instanceof HTMLElement) {
                lastTrigger.focus();
                lastTrigger = null;
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navMenu?.classList.contains("is-open")) {
            closeMenu();
        }
    });

    setupNavigation();
    setupReveal();
    setupDialog();
});
