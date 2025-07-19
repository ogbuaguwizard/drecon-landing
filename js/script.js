document.addEventListener('DOMContentLoaded', function() {
    initHeaderScroll();
    initMobileMenu();
    initScrollAnimations();
    initSmoothScrollLinks();
    updateCurrentYear();
    highlightActiveNav(); 
    initDropdowns(); 

    if (document.body.classList.contains('homepage')) {
        initHomepageHeroAnimations();
        initTypewriterEffect();
        initMarquee();
    }

    if (document.body.classList.contains('aboutpage')) {
        initAboutPageHeroAnimations();
    }

    if (document.body.classList.contains('csrpage')) { 
        initCsrPageHeroAnimations(); 
    }

    if (document.body.classList.contains('mentorshippage')) {
        initMentorshipModal();
    }

    initTestimonialSlider();
});

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
        if (!link.closest('.dropdown')) { 
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }
    });
    
    document.addEventListener('click', function(event) {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(event.target) && 
            !mobileMenuBtn.contains(event.target)) {
            
            mobileMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

function initSmoothScrollLinks() {
    document.querySelectorAll('a[href^="#"], a[href*=".html#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const [page, hash] = href.split('#');

            if ((hash && (page === '' || page === window.location.pathname.split('/').pop())) || (href.startsWith('#') && href.length > 1)) {
                e.preventDefault(); 

                const target = document.getElementById(hash || href.substring(1)); 
                if (target) {
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0; 
                    const offsetTop = target.offsetTop - headerHeight - 20; 

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    const mobileMenu = document.querySelector('.mobile-menu');
                    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        if(mobileMenuBtn) {
                            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                        }
                    }
                }
            }
        });
    });
}

function updateCurrentYear() {
    const yearSpan = document.getElementById('current-year');
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
        '.page-hero-content h1, ' +
        '.page-hero-content p.page-hero-subtitle, ' +
         '.about-ceo .ceo-image, ' +
        '.about-ceo .ceo-content, ' +
        '.specialty-item, ' +
        '.stat-item, ' +
        '.testimonial, ' +
        '.work-experience, ' +
        '.work-content #current-work, ' +
        '.work-content #past-work, ' +
        '.work-content .animatable, ' +
        '.specialties, ' + 
        '.specialties .specialty-item, ' + 
        '.esg-item, ' +
        '.esg-text, ' +
        '.mentorship-content p, ' +
        '.mentorship-content h3, ' +
        '.mentorship-content ul, ' +
        '.mentorship-call-to-action, ' +
        '.publications-list, ' + 
        '.publications-list .container .animatable, ' + 
        '.job-header, ' + 
        '.work-content p'
    ).forEach(el => {
        if(el) {
            // Add a class to elements that should be animated
            el.classList.add('animatable'); 
            observer.observe(el);
        }
    });
}

function highlightActiveNav() {
    const navLinks = document.querySelectorAll('header nav ul li a:not(.dropdown-menu a)'); 
    const mobileNavLinks = document.querySelectorAll('.mobile-menu ul li a:not(.dropdown-menu a)'); 
    const currentPathname = window.location.pathname.split('/').pop();

    const setActive = (link) => {
        link.classList.add('active');
        const parentDropdown = link.closest('.dropdown');
        if (parentDropdown) {
            const parentLink = parentDropdown.querySelector(':scope > a'); 
            if (parentLink) parentLink.classList.add('active');
        }
    };

    const removeActive = (link) => {
        link.classList.remove('active');
        const parentDropdown = link.closest('.dropdown');
        if (parentDropdown) {
            const parentLink = parentDropdown.querySelector(':scope > a');
            const anyChildActive = Array.from(parentDropdown.querySelectorAll('.dropdown-menu a')).some(childLink => childLink.classList.contains('active'));
            if (parentLink && !anyChildActive) parentLink.classList.remove('active');
        }
    };

    [...navLinks, ...mobileNavLinks].forEach(link => { 
        const linkHref = link.getAttribute('href');

        if (currentPathname === 'index.html' || currentPathname === '') {
            if (linkHref === 'index.html' || linkHref === '') {
                setActive(link);
            } else {
                removeActive(link);
            }
        }
        else if (linkHref === currentPathname) {
            setActive(link);
        } 
        else if (link.closest('.dropdown') && linkHref.endsWith(currentPathname)) {
            setActive(link); 
        }
        else {
            removeActive(link);
        }
    });
}

function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector(':scope > a'); 

        dropdownToggle.addEventListener('click', function(event) {
            const isDesktop = window.matchMedia('(min-width: 993px)').matches;

            if (isDesktop) {
                if (dropdown.classList.contains('active')) {
                    if (dropdownToggle.getAttribute('href') !== '#') { 
                    } else {
                        event.preventDefault(); 
                    }
                    dropdown.classList.remove('active'); 
                } else {
                    event.preventDefault(); 
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                    dropdown.classList.add('active'); 
                }
            } else {
                event.preventDefault(); 
                dropdown.classList.toggle('active'); 
            }
        });

        if (window.matchMedia('(min-width: 993px)').matches) {
            document.addEventListener('click', function(event) {
                if (!dropdown.contains(event.target) && dropdown.classList.contains('active')) {
                    dropdown.classList.remove('active');
                }
            });
        }
    });

    window.addEventListener('resize', function() {
        if (window.matchMedia('(min-width: 993px)').matches) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active'); 
            });
            const mobileMenu = document.querySelector('.mobile-menu');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                }
            }
        }
    });
}

function initMentorshipModal() {
    const openModalBtn = document.getElementById('openMentorshipModal');
    const modal = document.getElementById('mentorshipModal');
    const closeBtn = document.querySelector('#mentorshipModal .close-button');
    const mentorshipForm = document.getElementById('mentorshipForm');
    const formStatus = document.getElementById('formStatus');

    if (!openModalBtn || !modal || !closeBtn || !mentorshipForm || !formStatus) {
        console.warn("Mentorship modal elements not found. Skipping initialization.");
        return;
    }

    openModalBtn.addEventListener('click', function(event) {
        event.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        formStatus.textContent = '';
        mentorshipForm.reset();
    });

    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; 
        document.documentElement.style.overflow = ''; // Added to ensure scroll is restored on html element too
    });

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = ''; // Added to ensure scroll is restored on html element too
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = ''; // Added to ensure scroll is restored on html element too
        }
    });

    mentorshipForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        formStatus.textContent = 'Sending...';
        formStatus.style.color = 'var(--emerald-light)';

        const formData = new FormData(mentorshipForm);
        try {
            const response = await fetch(mentorshipForm.action, {
                method: mentorshipForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.textContent = 'Application submitted successfully! We will get back to you soon.';
                formStatus.style.color = 'var(--emerald-dark)';
                mentorshipForm.reset();
                setTimeout(() => {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                }, 3000); 
            } else {
                const data = await response.json();
                if (data.errors) {
                    formStatus.textContent = data.errors.map(error => error.message).join(', ');
                } else {
                    formStatus.textContent = 'Oops! There was a problem submitting your form.';
                }
                formStatus.style.color = 'var(--red-dark)';
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            formStatus.textContent = 'Network error. Please try again later.';
            formStatus.style.color = 'var(--red-dark)';
        }
    });
}

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

function initAboutPageHeroAnimations() {
    setTimeout(() => {
        const pageHeroH1 = document.querySelector('.page-hero-content h1');
        if (pageHeroH1) pageHeroH1.classList.add('visible');
        const pageHeroSubtitle = document.querySelector('.page-hero-content p.page-hero-subtitle');
        if (pageHeroSubtitle) pageHeroSubtitle.classList.add('visible');
    }, 300);
}

function initCsrPageHeroAnimations() {
    setTimeout(() => {
        const csrHeroH1 = document.querySelector('#csr-hero .page-hero-title');
        if (csrHeroH1) csrHeroH1.classList.add('visible');
        const csrHeroSubtitle = document.querySelector('#csr-hero .page-hero-subtitle');
        if (csrHeroSubtitle) csrHeroSubtitle.classList.add('visible');
    }, 300);
}