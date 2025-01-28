function sessionModal() {
    const wrappers = document.querySelectorAll('[data-modal-wrapper=""]');

    wrappers.forEach((wrapper) => {
        const trigger = wrapper.querySelector('[data-modal-open=""]');
        const modal = wrapper.querySelector('[data-modal=""]');
        const modalContent = wrapper.querySelector(".session_modal-wrap");
        const closeButtons = wrapper.querySelectorAll('[data-modal-close=""]');
        const overlay = wrapper.querySelector(".session_modal-overlay");

        if (modal) {
        document.body.appendChild(modal);
        }

        let lastFocusedElement;

        const tl = gsap.timeline({
        paused: true,
        defaults: {
            duration: 0.6,
            ease: easeBase,
        },
        onReverseComplete: () => {
            modal.style.display = "none";
            gsap.set(modalContent, { x: "100%" });
            overlay?.classList.remove("is-open");
        },
        });

        gsap.set(modalContent, { x: "100%" });

        tl.to(modal, {
        opacity: 1,
        duration: durationFast,
        display: "flex",
        onStart: () => overlay?.classList.add("is-open"),
        }).to(
        modalContent,
        {
            x: "0%",
        },
        "<"
        );

        function openModal() {
        lastFocusedElement = document.activeElement;
        tl.play();
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length) {
            focusableElements[0].focus();
        }

        modal.addEventListener("keydown", trapFocus);
        }

        function closeModal() {
        tl.reverse();
        overlay?.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }

        modal.removeEventListener("keydown", trapFocus);
        }

        function trapFocus(e) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.key === "Tab") {
            if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
            } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
            }
        }
        }

        function cleanupModal() {
        if (modal && modal.parentElement === document.body) {
            document.body.removeChild(modal);
        }
        }

        trigger?.addEventListener("click", openModal);

        closeButtons?.forEach((button) => {
        button.addEventListener("click", closeModal);
        });

        const handleEscape = (e) => {
        if (e.key === "Escape" && modal.style.display === "flex") {
            closeModal();
        }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
        trigger?.removeEventListener("click", openModal);
        closeButtons?.forEach((button) => {
            button.removeEventListener("click", closeModal);
        });
        document.removeEventListener("keydown", handleEscape);
        cleanupModal();
        };
    });
}

sessionModal();  