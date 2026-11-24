let deckController = null;
let projectsController = null;

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initThemeToggle();
    initScrollToTop();
    initEmailCopy();
    projectsController = initProjectsPagination();
    deckController = initSectionDeck();
    initSmoothScroll();
});

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navItems = navLinks.querySelectorAll('a');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('show');
        document.body.style.overflow = navLinks.classList.contains('show') ? 'hidden' : '';
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('show');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinks.classList.contains('show')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('.material-symbols-outlined');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        icon.textContent = 'light_mode';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        icon.textContent = isLight ? 'light_mode' : 'dark_mode';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', () => {
        scrollBtn.classList.toggle('show', window.scrollY > 300);
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initEmailCopy() {
    const copyBtn = document.getElementById('copyEmailButton');
    const emailInput = document.getElementById('email');
    const copyMessage = document.getElementById('copyMessage');

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(emailInput.value);
            copyMessage.classList.add('show');

            const icon = copyBtn.querySelector('.material-symbols-outlined');
            const originalIcon = icon.textContent;
            icon.textContent = 'check';

            setTimeout(() => {
                copyMessage.classList.remove('show');
                icon.textContent = originalIcon;
            }, 2000);
        } catch (err) {
            console.error('Error al copiar el correo:', err);
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').slice(1);
            if (!targetId) return;

            if (deckController && deckController.isActive()) {
                e.preventDefault();
                deckController.goToId(targetId);
                return;
            }

            const targetElement = document.getElementById(targetId);
            if (!targetElement) return;

            e.preventDefault();
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            window.scrollTo({
                top: targetElement.offsetTop - navbarHeight,
                behavior: 'smooth'
            });
        });
    });
}

function initSectionDeck() {
    const sections = Array.from(document.querySelectorAll('section[data-deck]'));
    const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    const railItems = Array.from(document.querySelectorAll('.rail-item'));
    const progressBar = document.getElementById('scrollProgress');
    const desktopQuery = window.matchMedia('(min-width: 1024px)');

    if (sections.length === 0) return null;

    let currentIndex = 0;
    let wheelLocked = false;

    function updateProgress() {
        if (!progressBar) return;
        const pct = ((currentIndex + 1) / sections.length) * 100;
        progressBar.style.width = `${pct}%`;
    }

    function setActive(index) {
        currentIndex = Math.max(0, Math.min(sections.length - 1, index));
        const activeId = sections[currentIndex].id;

        sections.forEach((sec, i) => {
            sec.classList.toggle('deck-active', i === currentIndex);
            if (i === currentIndex) sec.scrollTop = 0;
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
        });

        railItems.forEach(item => {
            item.classList.toggle('active', item.dataset.target === activeId);
        });

        updateProgress();
    }

    function applyMode() {
        if (desktopQuery.matches) {
            document.body.classList.add('deck-mode');
            setActive(currentIndex);
        } else {
            document.body.classList.remove('deck-mode');
            sections.forEach(sec => sec.classList.remove('deck-active'));
        }
    }

    railItems.forEach(item => {
        item.addEventListener('click', () => {
            const idx = sections.findIndex(s => s.id === item.dataset.target);
            if (idx !== -1) setActive(idx);
        });
    });

    window.addEventListener('wheel', (e) => {
        if (!desktopQuery.matches || wheelLocked) return;
        if (Math.abs(e.deltaY) < 18) return;

        const activeSection = sections[currentIndex];
        const canScrollDown = activeSection.scrollTop + activeSection.clientHeight < activeSection.scrollHeight - 4;
        const canScrollUp = activeSection.scrollTop > 4;

        if (e.deltaY > 0 && canScrollDown) return;
        if (e.deltaY < 0 && canScrollUp) return;

        e.preventDefault();
        wheelLocked = true;

        if (e.deltaY > 0 && currentIndex < sections.length - 1) {
            setActive(currentIndex + 1);
        } else if (e.deltaY < 0 && currentIndex > 0) {
            setActive(currentIndex - 1);
        }

        setTimeout(() => {
            wheelLocked = false;
        }, 480);
    }, { passive: false });

    window.addEventListener('keydown', (e) => {
        if (!desktopQuery.matches) return;
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentIndex < sections.length - 1) setActive(currentIndex + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentIndex > 0) setActive(currentIndex - 1);
        } else if (sections[currentIndex].id === 'proyectos' && projectsController) {
            if (e.key === 'ArrowRight') projectsController.next();
            if (e.key === 'ArrowLeft') projectsController.prev();
        }
    });

    desktopQuery.addEventListener('change', applyMode);
    applyMode();

    return {
        isActive: () => desktopQuery.matches,
        goToId: (id) => {
            const idx = sections.findIndex(s => s.id === id);
            if (idx !== -1) setActive(idx);
        }
    };
}

function initProjectsPagination() {
    const grid = document.getElementById('projectsGrid');
    const filterContainer = document.getElementById('projectFilters');
    const pagination = document.getElementById('projectsPagination');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');

    if (!grid || !filterContainer || !pagination) return null;

    const cards = Array.from(grid.querySelectorAll('.project-card'));
    const filterBtns = Array.from(filterContainer.querySelectorAll('.filter-btn'));
    const perPage = 2;

    let currentFilter = 'all';
    let currentPage = 1;
    let totalPages = 1;

    function render() {
        const filtered = cards.filter(card =>
            currentFilter === 'all' || card.dataset.category === currentFilter
        );

        totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
        if (currentPage > totalPages) currentPage = totalPages;

        const start = (currentPage - 1) * perPage;
        const end = start + perPage;

        cards.forEach(card => {
            card.classList.add('is-hidden');
            card.classList.remove('page-fade');
        });

        filtered.slice(start, end).forEach(card => {
            card.classList.remove('is-hidden');
            void card.offsetWidth;
            card.classList.add('page-fade');
        });

        pageInfo.textContent = `${currentPage} / ${totalPages}`;
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
        pagination.style.display = totalPages > 1 ? 'flex' : 'none';
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            currentPage = 1;
            render();
        });
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage -= 1;
            render();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage += 1;
            render();
        }
    });

    render();

    return {
        prev: () => {
            if (currentPage > 1) {
                currentPage -= 1;
                render();
            }
        },
        next: () => {
            if (currentPage < totalPages) {
                currentPage += 1;
                render();
            }
        }
    };
}
