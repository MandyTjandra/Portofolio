/**
 * Portfolio - GitHub Projects Module
 * Fetches public repositories from GitHub API and dynamically renders project cards.
 */
window.Portfolio = window.Portfolio || {};

(function (exports) {
    'use strict';

    class GitHubProjects {
        constructor(options = {}) {
            this.username = options.username || 'MandyTjandra';
            this.maxProjects = options.maxProjects || 6;
            this.containerId = options.containerId || 'github-projects';
            this.container = document.getElementById(this.containerId);

            if (this.container) {
                this.fetchProjects();
            }
        }

        async fetchProjects() {
            try {
                const response = await fetch(
                    `https://api.github.com/users/${this.username}/repos?sort=updated&direction=desc`
                );
                if (!response.ok) throw new Error('Could not fetch projects');

                const data = await response.json();
                const displayRepos = data.slice(0, this.maxProjects);
                this.render(displayRepos);
            } catch (error) {
                console.error('GitHubProjects Error:', error);
                if (this.container) {
                    this.container.innerHTML = `<p style="color:var(--text-light); text-align:center;">Error loading projects.</p>`;
                }
            }
        }

        render(repos) {
            if (!this.container) return;
            this.container.innerHTML = '';

            repos.forEach(repo => {
                const projectCard = document.createElement('div');
                projectCard.classList.add('project-card');

                const description = repo.description
                    ? (repo.description.length > 80 ? repo.description.substring(0, 80) + '...' : repo.description)
                    : 'No description available.';

                const homepageLink = repo.homepage
                    ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i></a>`
                    : '';

                projectCard.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div class="folder-icon"><i class="fas fa-folder"></i></div>
                        <div class="project-links">
                            ${homepageLink}
                            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>
                        </div>
                    </div>
                    <div>
                        <h3>${repo.name}</h3>
                        <p>${description}</p>
                        <div class="project-tags">
                            <span>${repo.language ? repo.language : 'Code'}</span>
                            <span style="float:right">${repo.size} KB</span>
                        </div>
                    </div>
                `;
                this.container.appendChild(projectCard);
            });
        }
    }

    exports.GitHubProjects = GitHubProjects;
})(window.Portfolio);
