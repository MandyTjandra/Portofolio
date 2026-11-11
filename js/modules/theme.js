/**
 * Portfolio - Theme Manager Module
 * Handles dark / light theme switching and localStorage persistence.
 */
window.Portfolio = window.Portfolio || {};

(function (exports) {
    'use strict';

    class ThemeManager {
        constructor(toggleBtnId = 'theme-toggle') {
            this.themeBtn = document.getElementById(toggleBtnId);
            this.body = document.body;
            this.themeIcon = this.themeBtn ? this.themeBtn.querySelector('i') : null;

            this.init();
        }

        init() {
            if (!this.themeBtn) return;

            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light') {
                this.setLightTheme(false);
            }

            this.themeBtn.addEventListener('click', () => this.toggleTheme());
        }

        setLightTheme(save = true) {
            this.body.setAttribute('data-theme', 'light');
            if (this.themeIcon) {
                this.themeIcon.classList.remove('fa-sun');
                this.themeIcon.classList.add('fa-moon');
            }
            if (save) localStorage.setItem('theme', 'light');
        }

        setDarkTheme(save = true) {
            this.body.removeAttribute('data-theme');
            if (this.themeIcon) {
                this.themeIcon.classList.remove('fa-moon');
                this.themeIcon.classList.add('fa-sun');
            }
            if (save) localStorage.setItem('theme', 'dark');
        }

        toggleTheme() {
            if (this.body.getAttribute('data-theme') === 'light') {
                this.setDarkTheme(true);
            } else {
                this.setLightTheme(true);
            }
        }
    }

    exports.ThemeManager = ThemeManager;
})(window.Portfolio);
