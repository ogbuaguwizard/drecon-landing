document.addEventListener('DOMContentLoaded', function() {
    // Universal functions (apply to all pages where elements exist)
    initHeaderScroll();
    initMobileMenu();
    initScrollAnimations();
    initSmoothScrollLinks();
    updateCurrentYear();
    highlightActiveNav(); // Call to highlight active navigation link

    // Page-specific initializations
    if (document.body.classList.contains('homepage')) {
        initHomepageHeroAnimations();
        initTypewriterEffect();
        initMarquee();
    }

    if (document.body.classList.contains('aboutpage')) {
        initAboutPageHeroAnimations();
    }

    // NEW: Check if it's the CSR page
    if (document.body.classList.contains('csrpage')) { // Ensure this matches the body class in HTML
        initCsrPageHeroAnimations(); // Initialize CSR page hero animations
    }

    initTestimonialSlider();
});

// --- Universal Functions ---

function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}

function initSmoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });

                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                    if(mobileMenuBtn) {
                        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                    }
                }
            }
        });
    });
}

function updateCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(
        '.section-title, ' +
        '.about-container, ' +
        '.service-card, ' +
        '.project-card, ' +
        '.timeline, ' +
        '.stat-item, ' +
        '.about-content, ' +
        '.contact-cta .section-title, ' +
        '.contact-cta p, ' +
        '.contact-cta .btn, ' +
        '.page-hero-content h1, ' +
        '.page-hero-content p.page-hero-subtitle, ' +
        '.gallery-item, ' +
        '.csr-pillar-item'
    ).forEach(el => {
        if(el) {
            observer.observe(el);
        }
    });
}

function highlightActiveNav() {
    const navLinks = document.querySelectorAll('header nav ul li a');
    const mobileNavLinks = document.querySelectorAll('.mobile-menu ul li a');
    const currentPathname = window.location.pathname.split('/').pop();

    const setActive = (link) => {
        link.classList.add('active');
    };

    const removeActive = (link) => {
        link.classList.remove('active');
    };

    [...navLinks, ...mobileNavLinks].forEach(link => { // Combine for efficiency
        const linkHref = link.getAttribute('href');

        if (currentPathname === 'index.html' || currentPathname === '') {
            if (linkHref === 'index.html' || linkHref === '') {
                setActive(link);
            } else {
                removeActive(link);
            }
        }
        // Specific check for 'csr.html'
        else if (currentPathname === 'csr.html') {
            if (linkHref === 'csr.html') {
                setActive(link);
            } else {
                removeActive(link);
            }
        }
        // For other dedicated pages (like about.html)
        else if (linkHref === currentPathname) {
            setActive(link);
        } else {
            removeActive(link);
        }
    });
}


// --- Homepage Specific Functions ---

function initHomepageHeroAnimations() {
    setTimeout(() => {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) heroSubtitle.classList.add('visible');
        const typewriterH1 = document.querySelector('.typewriter h1');
        if (typewriterH1) typewriterH1.classList.add('visible');
        const heroButtons = document.querySelector('.hero-buttons');
        if (heroButtons) heroButtons.classList.add('visible');
    }, 300);
}

function initTypewriterEffect() {
    const typewriterText = document.getElementById('typewriter-text');
    if (!typewriterText) return;

    const texts = ["SULAIMAN ABU"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typewriterText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

function initMarquee() {
    const marqueeContent = document.querySelector('.marquee-content');
    if (!marqueeContent) return;

    const originalContent = marqueeContent.innerHTML;
    marqueeContent.innerHTML = originalContent + originalContent;

    function updateMarqueeAnimation() {
        const items = marqueeContent.querySelectorAll('.marquee-item');
        let totalWidth = 0;

        items.forEach(item => {
            totalWidth += item.offsetWidth;
        });

        const duration = Math.max(30, totalWidth / 100);

        const existingStyle = document.getElementById('marquee-animation');
        if (existingStyle) existingStyle.remove();

        const style = document.createElement('style');
        style.id = 'marquee-animation';
        style.textContent = `
            @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-${totalWidth / 2}px); }
            }
            .marquee-content {
                animation: marquee ${duration}s linear infinite;
            }
        `;
        document.head.appendChild(style);

        marqueeContent.onmouseenter = () => {
            marqueeContent.style.animationPlayState = 'paused';
        };
        marqueeContent.onmouseleave = () => {
            marqueeContent.style.animationPlayState = 'running';
        };
    }

    updateMarqueeAnimation();
    window.addEventListener('resize', updateMarqueeAnimation);
}

function initTestimonialSlider() {
    const wrapper = document.getElementById('testimonials-wrapper');
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    
    if (!wrapper || testimonials.length === 0) return;
    
    let currentIndex = 0;
    let autoScrollInterval;
    
    function updateSlider() {
        const testimonialWidth = testimonials[0].clientWidth;
        const offset = -currentIndex * (testimonialWidth + 20);
        wrapper.style.transform = `translateX(${offset}px)`;
    }
    
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateSlider();
    }
    
    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        updateSlider();
    }
    
    function startAutoScroll() {
        autoScrollInterval = setInterval(nextTestimonial, 5000);
    }
    
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoScroll();
            nextTestimonial();
            startAutoScroll();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoScroll();
            prevTestimonial(); 
            startAutoScroll();
        });
    }
    
    startAutoScroll();
    
    wrapper.addEventListener('mouseenter', stopAutoScroll);
    wrapper.addEventListener('mouseleave', startAutoScroll);
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoScroll();
    }, {passive: true});
    
    wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoScroll();
    }, {passive: true});
    
    function handleSwipe() {
        const threshold = 50;
        if (touchStartX - touchEndX > threshold) {
            nextTestimonial();
        } else if (touchEndX - touchStartX > threshold) {
            prevTestimonial();
        }
    }
}


// --- About Page Specific Functions ---

function initAboutPageHeroAnimations() {
    setTimeout(() => {
        const pageHeroH1 = document.querySelector('.page-hero-content h1');
        if (pageHeroH1) pageHeroH1.classList.add('visible');
        const pageHeroSubtitle = document.querySelector('.page-hero-content p.page-hero-subtitle');
        if (pageHeroSubtitle) pageHeroSubtitle.classList.add('visible');
    }, 300);
}

// NEW: CSR Page Specific Functions
function initCsrPageHeroAnimations() {
    setTimeout(() => {
        const csrHeroH1 = document.querySelector('#csr-hero .page-hero-title');
        if (csrHeroH1) csrHeroH1.classList.add('visible');
        const csrHeroSubtitle = document.querySelector('#csr-hero .page-hero-subtitle');
        if (csrHeroSubtitle) csrHeroSubtitle.classList.add('visible');
    }, 300);
}