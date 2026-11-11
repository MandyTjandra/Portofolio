/**
 * Portfolio - Navigation Module
 * Handles mobile hamburger menu interaction and auto-close behavior.
 */
window.Portfolio = window.Portfolio || {};

(function (exports) {
    'use strict';

    class Navigation {
        constructor() {
            this.hamburger = document.querySelector('.hamburger');
            this.navGroup = document.querySelector('.nav-group');
            this.navLinks = document.querySelectorAll('.nav-links a');

            this.init();
        }

        init() {
            if (!this.hamburger || !this.navGroup) return;

            this.hamburger.addEventListener('click', () => this.toggleMenu());

            // Close mobile menu when a navigation link is clicked
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
        }

        toggleMenu() {
            this.hamburger.classList.toggle('active');
            this.navGroup.classList.toggle('active');
        }

        closeMenu() {
            this.hamburger.classList.remove('active');
            this.navGroup.classList.remove('active');
        }
    }

    exports.Navigation = Navigation;
})(window.Portfolio);
