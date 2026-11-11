/**
 * Portfolio - Main Script Entry Point
 * Coordinates modular features: Theme, GitHub Projects, Navigation, and Scroll Effects.
 */
document.addEventListener('DOMContentLoaded', () => {
    window.Portfolio = window.Portfolio || {};

    // 1. Theme Manager (Dark / Light Mode)
    if (window.Portfolio.ThemeManager) {
        window.Portfolio.theme = new window.Portfolio.ThemeManager('theme-toggle');
    }

    // 2. Mobile Navigation & Hamburger Menu
    if (window.Portfolio.Navigation) {
        window.Portfolio.navigation = new window.Portfolio.Navigation();
    }

    // 3. GitHub Projects Fetcher
    if (window.Portfolio.GitHubProjects) {
        window.Portfolio.github = new window.Portfolio.GitHubProjects({
            username: 'MandyTjandra',
            maxProjects: 6,
            containerId: 'github-projects'
        });
    }

    // 4. Scroll Reveal, Back-to-Top Button & Smooth Scroll
    if (window.Portfolio.ScrollEffects) {
        window.Portfolio.scroll = new window.Portfolio.ScrollEffects();
    }
});
