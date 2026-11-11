/**
 * Portfolio - Scroll Effects Module
 * Handles scroll reveal animations, back-to-top button visibility, and smooth scrolling.
 */
window.Portfolio = window.Portfolio || {};

(function (exports) {
    'use strict';

    class ScrollEffects {
        constructor() {
            this.backToTopBtn = document.getElementById('backToTop');
            this.revealElements = document.querySelectorAll('.reveal');
            this.anchorLinks = document.querySelectorAll('a[href^="#"]');

            this.init();
        }

        init() {
            this.setupScrollListener();
            this.setupSmoothScroll();
            // Initial reveal check for elements visible on load
            this.checkReveal();
        }

        setupScrollListener() {
            window.addEventListener('scroll', () => {
                // Back to Top button visibility
                if (this.backToTopBtn) {
                    if (window.scrollY > 300) {
                        this.backToTopBtn.classList.add('active');
                    } else {
                        this.backToTopBtn.classList.remove('active');
                    }
                }

                this.checkReveal();
            });
        }

        checkReveal() {
            const windowHeight = window.innerHeight;
            const elementVisible = 150;

            this.revealElements.forEach(reveal => {
                const elementTop = reveal.getBoundingClientRect().top;
                if (elementTop < windowHeight - elementVisible) {
                    reveal.classList.add('active');
                }
            });
        }

        setupSmoothScroll() {
            this.anchorLinks.forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const href = this.getAttribute('href');
                    if (href && href.startsWith('#') && href.length > 1) {
                        const target = document.querySelector(href);
                        if (target) {
                            e.preventDefault();
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            });
        }
    }

    exports.ScrollEffects = ScrollEffects;
})(window.Portfolio);
