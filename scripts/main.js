document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initThemeToggle();
    initScrollToTop();
    initEmailCopy();
    initSmoothScroll();
    initScrollProgress();
    initSectionFade();
    initActiveNavSection();
    initProjectsPagination();
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
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        });
    });
}

function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = `${pct}%`;
    }, { passive: true });
}

function initSectionFade() {
    const sections = document.querySelectorAll('.section');
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    sections.forEach(section => {
        section.classList.add('section-reveal');
        observer.observe(section);
    });
}

function initActiveNavSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));
}

function initProjectsPagination() {
    const grid = document.getElementById('projectsGrid');
    const filterContainer = document.getElementById('projectFilters');
    const pagination = document.getElementById('projectsPagination');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');

    if (!grid || !filterContainer || !pagination) return;

    const cards = Array.from(grid.querySelectorAll('.project-card'));
    const filterBtns = Array.from(filterContainer.querySelectorAll('.filter-btn'));
    const perPage = 2;

    let currentFilter = 'all';
    let currentPage = 1;

    function render() {
        const filtered = cards.filter(card =>
            currentFilter === 'all' || card.dataset.category === currentFilter
        );

        const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
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
        currentPage += 1;
        render();
    });

    render();
}
