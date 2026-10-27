document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js-enabled');

    const header = document.getElementById('header');
    const menuBtn = document.getElementById('menuBtn');
    const navLinksContainer = document.getElementById('navLinks');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section[id]');
    const backToTopBtn = document.getElementById('backToTop');
    const yearSpan = document.getElementById('currentYear');

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Accessible Mobile Navigation Drawer
    const closeMobileMenu = () => {
        if (!menuBtn || !navLinksContainer) return;
        navLinksContainer.classList.remove('active');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open navigation menu');
    };

    const toggleMobileMenu = () => {
        if (!menuBtn || !navLinksContainer) return;
        const isOpen = navLinksContainer.classList.toggle('active');
        menuBtn.classList.toggle('open', isOpen);
        menuBtn.setAttribute('aria-expanded', String(isOpen));
        menuBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    };

    if (menuBtn && navLinksContainer) {
        menuBtn.addEventListener('click', toggleMobileMenu);

        // Close menu when a navigation item is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close menu on Escape key press
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navLinksContainer.classList.contains('active')) {
                closeMobileMenu();
                menuBtn.focus();
            }
        });

        // Close menu when clicking outside header on mobile
        document.addEventListener('click', (event) => {
            if (
                navLinksContainer.classList.contains('active') &&
                header &&
                !header.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });
    }

    // 3. Header Scroll State, Back-to-Top Visibility & Active Section Spy
    const handleScroll = () => {
        const scrollY = window.scrollY;

        if (header) {
            header.classList.toggle('scrolled', scrollY > 24);
        }

        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', scrollY > 480);
        }

        // Highlight active section in navbar
        let currentSectionId = 'home';
        const scrollPosition = scrollY + 140;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${currentSectionId}`);
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 4. Smooth Back-to-Top Interaction
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 5. Scroll-Triggered Reveal Animations via IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal-up');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                root: null,
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        revealElements.forEach(el => revealObserver.observe(el));
    }
});
