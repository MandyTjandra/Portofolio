document.addEventListener("DOMContentLoaded", () => {

    // --- CONFIGURATION ---
    const username = "MandyTjandra";
    const maxProjects = 6;

    // --- THEME TOGGLE LOGIC ---
    const themeBtn = document.getElementById("theme-toggle");
    const themeIcon = themeBtn.querySelector("i");
    const body = document.body;

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        body.setAttribute("data-theme", "light");
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
    }

    themeBtn.addEventListener("click", () => {
        if (body.getAttribute("data-theme") === "light") {
            body.removeAttribute("data-theme");
            themeIcon.classList.remove("fa-moon");
            themeIcon.classList.add("fa-sun");
            localStorage.setItem("theme", "dark");
        } else {
            body.setAttribute("data-theme", "light");
            themeIcon.classList.remove("fa-sun");
            themeIcon.classList.add("fa-moon");
            localStorage.setItem("theme", "light");
        }
    });

    // --- FETCH GITHUB PROJECTS ---
    const projectsContainer = document.getElementById("github-projects");

    const fetchProjects = async () => {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`);
            if (!response.ok) throw new Error("Could not fetch projects");
            const data = await response.json();
            const displayRepos = data.slice(0, maxProjects);
            projectsContainer.innerHTML = "";

            displayRepos.forEach(repo => {
                const projectCard = document.createElement("div");
                projectCard.classList.add("project-card");
                projectCard.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div class="folder-icon"><i class="fas fa-folder"></i></div>
                        <div class="project-links">
                            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank"><i class="fas fa-external-link-alt"></i></a>` : ''}
                            <a href="${repo.html_url}" target="_blank"><i class="fab fa-github"></i></a>
                        </div>
                    </div>
                    <div>
                        <h3>${repo.name}</h3>
                        <p>${repo.description ? repo.description.substring(0, 80) + "..." : "No description available."}</p>
                        <div class="project-tags">
                            <span>${repo.language ? repo.language : "Code"}</span>
                            <span style="float:right">${repo.size} KB</span>
                        </div>
                    </div>
                `;
                projectsContainer.appendChild(projectCard);
            });
        } catch (error) {
            console.error(error);
            projectsContainer.innerHTML = `<p style="color:var(--text-light); text-align:center;">Error loading projects.</p>`;
        }
    };
    fetchProjects();

    // --- MOBILE MENU LOGIC (CLEAN VERSION) ---
    const hamburger = document.querySelector(".hamburger");
    const navGroup = document.querySelector(".nav-group");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navGroup.classList.toggle("active");
    });

    // Close menu when a link is clicked
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navGroup.classList.remove("active");
        });
    });

    // --- BACK TO TOP & SCROLL REVEAL ---
    const backToTopBtn = document.getElementById("backToTop");
    const revealElements = document.querySelectorAll(".reveal");

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;
        revealElements.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) reveal.classList.add("active");
        });
    };

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) backToTopBtn.classList.add("active");
        else backToTopBtn.classList.remove("active");

        revealOnScroll();
    });

    // Initial check
    revealOnScroll();

    // Smooth Scroll Hook
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
});