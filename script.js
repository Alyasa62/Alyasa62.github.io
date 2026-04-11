document.addEventListener("DOMContentLoaded", () => {
    // Scroll Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    const sections = document.querySelectorAll('.container');
    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });

    // Lightbox Modal Logic
    const modal = document.getElementById("media-modal");
    const modalContent = document.getElementById("modal-content");
    const closeBtn = document.querySelector(".close-modal");
    const mediaTriggers = document.querySelectorAll(".media-trigger");

    mediaTriggers.forEach(media => {
        media.addEventListener("click", () => {
            modal.style.display = "flex";
            modalContent.innerHTML = ""; // Clear previous content
            
            if (media.tagName === "IMG") {
                const img = document.createElement("img");
                img.src = media.src;
                modalContent.appendChild(img);
            } else if (media.tagName === "VIDEO") {
                const video = document.createElement("video");
                video.src = media.src;
                video.controls = true;
                video.autoplay = true;
                modalContent.appendChild(video);
            }
            
            // Prevent scrolling on the body while modal is open
            document.body.style.overflow = "hidden";
        });
    });

    // Close Modal Logic
    const closeModal = () => {
        modal.style.display = "none";
        modalContent.innerHTML = ""; // Stop videos from playing in background
        document.body.style.overflow = "auto";
    };

    closeBtn.addEventListener("click", closeModal);
    
    // Close modal if clicked outside the media
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});