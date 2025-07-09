
// Initialize animations on page load
document.addEventListener('DOMContentLoaded', function() {
    // Trigger hero animations
    setTimeout(() => {
        document.querySelector('.hero-subtitle').classList.add('visible');
        document.querySelector('.typewriter h1').classList.add('visible');
        document.querySelector('.hero-buttons').classList.add('visible');
    }, 300);
    
    // Initialize typewriter effect
    const typewriterText = document.getElementById('typewriter-text');
    const texts = [
        "SULAIMAN ABU",
        // "Building Sustainable Communities Nationwide",
        // "Redeveloping Urban Spaces for Tomorrow",
        // "Creating Infrastructure That Lasts Generations"
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            // Remove characters
            typewriterText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            // Add characters
            typewriterText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        // Check if text is complete
        if (!isDeleting && charIndex === currentText.length) {
            // Pause at end of text
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Move to next text
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }

    // Start the typewriter effect
    setTimeout(type, 1000);
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Initialize mobile menu
    initMobileMenu();

    // Initialize marquee
    initMarquee();
});

// Sticky header
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            document.getElementById('mobile-menu').classList.remove('active');
            document.getElementById('mobile-menu-btn').style.display = 'block';
        }
    });
});

// Testimonial slider functionality
function initTestimonialSlider() {
    const wrapper = document.getElementById('testimonials-wrapper');
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    
    let currentIndex = 0;
    let autoScrollInterval;
    

    function updateSlider() {

        // Get the width of the first testimonial (they should all be the same width)
        const testimonialWidth = testimonials[0].clientWidth;
        // Calculate the offset based on the current index and testimonial width
        // Also account for the margin (10px on each side = 20px total)
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
    
    // Auto-scroll testimonials every 5 seconds
    function startAutoScroll() {
        autoScrollInterval = setInterval(nextTestimonial, 5000);
    }
    
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    // Manual navigation
    nextBtn.addEventListener('click', () => {
        stopAutoScroll();
        nextTestimonial();
        startAutoScroll();
    });
    
    prevBtn.addEventListener('click', () => {
        stopAutoScroll();
        prevTestimonial();
        startAutoScroll();
    });
    
    // Start auto-scroll
    startAutoScroll();
    
    // Pause on hover
    wrapper.addEventListener('mouseenter', stopAutoScroll);
    wrapper.addEventListener('mouseleave', startAutoScroll);
    
    // Touch support for mobile
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
        const threshold = 50; // Minimum swipe distance
        if (touchStartX - touchEndX > threshold) {
            nextTestimonial(); // Swipe left
        } else if (touchEndX - touchStartX > threshold) {
            prevTestimonial(); // Swipe right
        }
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.createElement('button');
    
    closeMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeMenuBtn.classList.add('mobile-menu-btn');
    closeMenuBtn.style.position = 'absolute';
    closeMenuBtn.style.top = '20px';
    closeMenuBtn.style.right = '20px';
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        mobileMenu.appendChild(closeMenuBtn);
        mobileMenuBtn.style.display = 'none';
    });
    
    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenu.removeChild(closeMenuBtn);
        mobileMenuBtn.style.display = 'block';
    });
}

// Marquee functionality
function initMarquee() {
    const marqueeContent = document.querySelector('.marquee-content');
    if (!marqueeContent) return;
    
    // Duplicate the items for seamless looping
    const originalContent = marqueeContent.innerHTML;
    marqueeContent.innerHTML = originalContent + originalContent;
    
    // Calculate total width and set animation
    function updateMarqueeAnimation() {
        const items = marqueeContent.querySelectorAll('.marquee-item');
        let totalWidth = 0;
        
        items.forEach(item => {
            totalWidth += item.offsetWidth;
        });
        
        // Calculate animation duration (speed: 100px per second)
        const duration = Math.max(30, totalWidth / 100);
        
        // Remove existing animation style
        const existingStyle = document.getElementById('marquee-animation');
        if (existingStyle) existingStyle.remove();
        
        // Create new animation style
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
        
        // Pause on hover
        marqueeContent.onmouseenter = () => {
            marqueeContent.style.animationPlayState = 'paused';
        };
        marqueeContent.onmouseleave = () => {
            marqueeContent.style.animationPlayState = 'running';
        };
    }
    
    // Initialize and update on resize
    updateMarqueeAnimation();
    window.addEventListener('resize', updateMarqueeAnimation);
}

// Scroll animations
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

    // Observe all animated elements
    document.querySelectorAll('.section-title, .about-container, .service-card, .project-card, .timeline, .stat-item').forEach(el => {
        observer.observe(el);
    });
}