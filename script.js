/**
 * Saurabh Gaur — Synchronized Android Developer Portfolio Script
 * Features:
 * 1. Dynamic Footer Copyright Year
 * 2. Accessible Mobile Navigation Drawer + Backdrop + Escape Key + Body Scroll Lock
 * 3. Top Scroll Reading Progress Bar + Header Scroll State + Accurate Viewport Section Spy
 * 4. Interactive Hero Android Architecture Layer Switcher (UI / Domain / Data)
 * 5. Interactive Project Category Filtering
 * 6. One-Click Email Copy to Clipboard with Accessible Toast Feedback
 * 7. Resilient Resume PDF Existence Check on HTTP/HTTPS
 * 8. IntersectionObserver Scroll-Reveal Animations with Reduced-Motion Support
 */

document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js-enabled');

    // DOM References (100% synced with index.html IDs and classes)
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scrollProgress');
    const menuBtn = document.getElementById('menuBtn');
    const navLinksContainer = document.getElementById('navLinks');
    const navBackdrop = document.getElementById('navBackdrop');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section[id]');
    const backToTopBtn = document.getElementById('backToTop');
    const yearSpan = document.getElementById('currentYear');
    const statusToast = document.getElementById('statusToast');

    // Toast Helper
    let toastTimeout = null;
    const showToast = (message) => {
        if (!statusToast) return;
        statusToast.textContent = message;
        statusToast.classList.add('show');
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            statusToast.classList.remove('show');
        }, 3400);
    };

    // 1. Dynamic Footer Year
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Mobile Navigation Drawer & Backdrop Synchronization
    const setMobileMenuState = (isOpen) => {
        if (!menuBtn || !navLinksContainer) return;
        navLinksContainer.classList.toggle('active', isOpen);
        menuBtn.classList.toggle('open', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
        if (navBackdrop) {
            navBackdrop.classList.toggle('active', isOpen);
        }
        menuBtn.setAttribute('aria-expanded', String(isOpen));
        menuBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    };

    if (menuBtn && navLinksContainer) {
        menuBtn.addEventListener('click', () => {
            const isCurrentlyOpen = navLinksContainer.classList.contains('active');
            setMobileMenuState(!isCurrentlyOpen);
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => setMobileMenuState(false));
        });

        if (navBackdrop) {
            navBackdrop.addEventListener('click', () => setMobileMenuState(false));
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navLinksContainer.classList.contains('active')) {
                setMobileMenuState(false);
                menuBtn.focus();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navLinksContainer.classList.contains('active')) {
                setMobileMenuState(false);
            }
        });
    }

    // 3. Scroll Progress, Header Shadow, Back-to-Top & Viewport Section Spy
    const updateScrollUI = () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Update Top Scroll Progress Bar
        if (scrollProgress) {
            const progressPercent = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;
            scrollProgress.style.width = `${progressPercent}%`;
        }

        // Header Scrolled State
        if (header) {
            header.classList.toggle('scrolled', scrollY > 20);
        }

        // Back to Top Button Visibility
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', scrollY > 450);
        }

        // Accurate Section Spy (handles bottom-of-page Contact section reliably)
        let activeSectionId = 'home';
        const viewportProbe = window.innerHeight * 0.35;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= viewportProbe && rect.bottom >= viewportProbe) {
                activeSectionId = section.id;
            }
        });

        if (window.innerHeight + Math.round(scrollY) >= document.documentElement.scrollHeight - 30) {
            activeSectionId = 'contact';
        }

        navLinks.forEach(link => {
            const target = link.getAttribute('data-section') || link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', target === activeSectionId);
        });
    };

    window.addEventListener('scroll', updateScrollUI, { passive: true });
    updateScrollUI();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. Interactive Hero Android Architecture Layer Switcher
    const archFilename = document.getElementById('archFilename');
    const archCodeBlock = document.getElementById('archCodeBlock');
    const archPills = document.querySelectorAll('.arch-pill[data-layer]');

    const architectureSnippets = {
        ui: {
            filename: 'RideBookingScreen.kt',
            html: `<span class="kw">@Composable</span>
<span class="kw">fun</span> <span class="fn">RideBookingScreen</span>(
    viewModel: <span class="cls">ProductionViewModel</span> = <span class="fn">hiltViewModel</span>()
) {
    <span class="kw">val</span> state <span class="kw">by</span> viewModel.uiState.<span class="fn">collectAsStateWithLifecycle</span>()

    <span class="cls">Scaffold</span>(
        content = { padding -&gt;
            <span class="cls">RideMapContent</span>(state = state, modifier = <span class="cls">Modifier</span>.<span class="fn">padding</span>(padding))
        }
    )
}`
        },
        domain: {
            filename: 'ProductionViewModel.kt',
            html: `<span class="kw">@HiltViewModel</span>
<span class="kw">class</span> <span class="cls">ProductionViewModel</span> <span class="kw">@Inject</span> <span class="fn">constructor</span>(
    <span class="kw">private val</span> repository: <span class="cls">AppRepository</span>
) : <span class="cls">ViewModel</span>() {

    <span class="kw">val</span> uiState: <span class="cls">StateFlow</span>&lt;<span class="cls">UiState</span>&gt; =
        repository.<span class="fn">observeDataStream</span>()
            .<span class="fn">stateIn</span>(
                scope = viewModelScope,
                started = <span class="cls">SharingStarted</span>.WhileSubscribed(5000),
                initialValue = <span class="cls">UiState</span>.Loading
            )
}`
        },
        data: {
            filename: 'AppRepositoryImpl.kt',
            html: `<span class="kw">@Singleton</span>
<span class="kw">class</span> <span class="cls">AppRepositoryImpl</span> <span class="kw">@Inject</span> <span class="fn">constructor</span>(
    <span class="kw">private val</span> apiService: <span class="cls">RetrofitApiService</span>,
    <span class="kw">private val</span> roomDao: <span class="cls">LocalCacheDao</span>,
    <span class="kw">private val</span> socketManager: <span class="cls">SocketIoClient</span>
) : <span class="cls">AppRepository</span> {
    <span class="kw">override fun</span> <span class="fn">observeDataStream</span>(): <span class="cls">Flow</span>&lt;<span class="cls">UiState</span>&gt; =
        socketManager.<span class="fn">events</span>().<span class="fn">onEach</span> { roomDao.<span class="fn">upsert</span>(it) }
}`
        }
    };

    if (archPills.length > 0 && archFilename && archCodeBlock) {
        archPills.forEach(pill => {
            pill.addEventListener('click', () => {
                const layerKey = pill.getAttribute('data-layer');
                const snippet = architectureSnippets[layerKey];
                if (!snippet) return;

                archPills.forEach(p => {
                    const isSelected = p === pill;
                    p.classList.toggle('active', isSelected);
                    p.setAttribute('aria-selected', String(isSelected));
                });

                archFilename.textContent = snippet.filename;
                archCodeBlock.innerHTML = `<code>${snippet.html}</code>`;
            });
        });
    }

    // 5. Interactive Project Category Filter
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
    const projectCards = document.querySelectorAll('.project-card[data-category]');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedFilter = button.getAttribute('data-filter');

                filterButtons.forEach(btn => {
                    const isActive = btn === button;
                    btn.classList.toggle('active', isActive);
                    btn.setAttribute('aria-pressed', String(isActive));
                });

                projectCards.forEach(card => {
                    const categories = (card.getAttribute('data-category') || '').split(/\s+/);
                    const matches = selectedFilter === 'all' || categories.includes(selectedFilter);
                    card.classList.toggle('is-hidden', !matches);
                });
            });
        });
    }

    // 6. Copy Email to Clipboard with Toast Notification
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const copyEmailLabel = document.getElementById('copyEmailLabel');

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            const email = copyEmailBtn.getAttribute('data-email') || 'saurabhgaur988@gmail.com';
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(email);
                } else {
                    const tempInput = document.createElement('textarea');
                    tempInput.value = email;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                }
                copyEmailBtn.classList.add('copied');
                if (copyEmailLabel) copyEmailLabel.textContent = 'Copied!';
                showToast(`Copied ${email} to clipboard`);

                setTimeout(() => {
                    copyEmailBtn.classList.remove('copied');
                    if (copyEmailLabel) copyEmailLabel.textContent = 'Copy Email';
                }, 2500);
            } catch (err) {
                showToast(`Email: ${email}`);
            }
        });
    }

    // 7. Resilient Resume PDF Check (Prevents broken link experience if PDF is missing)
    const resumeButtons = document.querySelectorAll('[data-resume-btn]');
    if (resumeButtons.length > 0 && window.location.protocol.startsWith('http')) {
        resumeButtons.forEach(btn => {
            btn.addEventListener('click', async (event) => {
                const resumeUrl = btn.getAttribute('href');
                if (!resumeUrl) return;
                try {
                    const response = await fetch(resumeUrl, { method: 'HEAD' });
                    if (!response.ok) {
                        event.preventDefault();
                        showToast('Resume PDF (assets/resume.pdf) is being updated. Please reach out via email.');
                    }
                } catch (err) {
                    // Allow default browser navigation if offline or CORS restricted
                }
            });
        });
    }

    // 8. Scroll-Triggered Reveal Animations via IntersectionObserver
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
                rootMargin: '0px 0px -36px 0px'
            }
        );

        revealElements.forEach(el => revealObserver.observe(el));
    }
});
