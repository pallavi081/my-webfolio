/**
 * V5 Luxury System Script
 * 3D Depth, Floating Parallax, and Card Physics
 */

gsap.registerPlugin(ScrollTrigger);

// 1. Entrance & Hero Parallax
const initHero = () => {
    gsap.from(".navbar", { y: -30, opacity: 0, duration: 1, ease: "power2.out" });

    gsap.from(".gsap-fade-up", {
        y: 40, opacity: 0, duration: 1, stagger: 0.15,
        ease: "power3.out", delay: 0.2
    });

    // Pure JS subtle parallax depth map for the background layer
    const parallaxBg = document.getElementById('parallax-bg');
    if(parallaxBg && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 40; // max 20px movement
            const y = (e.clientY / window.innerHeight - 0.5) * 40;
            
            // Move background in opposite direction of mouse
            gsap.to(parallaxBg, {
                x: -x,
                y: -y,
                duration: 2,
                ease: "power2.out"
            });
        });
    }
};

// 2. 3D Perspective Tilt Mechanics
const init3DTilt = () => {
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        // Only apply mouse mechanics on non-touch devices
        if(window.matchMedia("(pointer: fine)").matches) {
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top; // y position within the element
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation (max 6 degrees to avoid breaking layout)
                const rotateX = ((y - centerY) / centerY) * -6; 
                const rotateY = ((x - centerX) / centerX) * 6;
                
                gsap.to(card, {
                    transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    transform: `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.4)" // Soft bounce back to flat
                });
            });
        }
    });

    // Parallax Images within Project Gallery
    const parallaxImages = document.querySelectorAll('.parallax-img');
    parallaxImages.forEach(img => {
        gsap.to(img, {
            yPercent: 10, 
            ease: "none",
            scrollTrigger: {
                trigger: img.closest('.project-glass-card'),
                start: "top bottom", 
                end: "bottom top",
                scrub: true
            }
        });
    });
};

// 3. Scroll Reveal General Logic
const initScrollReveals = () => {
    const fadeUpElements = document.querySelectorAll('.gsap-fade-up');
    fadeUpElements.forEach(el => {
        if(!el.closest('.hero-section')) {
            const hasDelay = el.classList.contains('delay-1') ? 0.2 : (el.classList.contains('delay-2') ? 0.4 : 0);
            gsap.fromTo(el, 
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: hasDelay,
                    scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
                }
            );
        }
    });

    // Skill Bars
    const skillFills = document.querySelectorAll('.skill-fill');
    skillFills.forEach(bar => {
        const targetWidth = bar.style.width;
        gsap.fromTo(bar, { width: "0%" }, {
            width: targetWidth, duration: 1.5, ease: "power2.out",
            scrollTrigger: { trigger: ".skill-bars-container", start: "top 85%" }
        });
    });
};

// 4. Number Counter Impl
const initCounters = () => {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const symbol = counter.innerText.replace(/[0-9]/g, '');
        const counterObj = { val: 0 };
        gsap.to(counterObj, {
            val: target, duration: 2.5, ease: "power2.out",
            scrollTrigger: { trigger: ".impact-grid", start: "top 85%", toggleActions: "play none none none" },
            onUpdate: function() { counter.innerText = Math.floor(counterObj.val) + symbol; }
        });
    });
};

// 5. Navigation Bar 
const initNavbar = () => {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    const hamburger = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            if(navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(10, 10, 10, 0.95)';
                navLinks.style.padding = '2rem 0';
                navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
            }
        });
    }
};

// Initializer
document.addEventListener('DOMContentLoaded', () => {
    initHero();
    init3DTilt();
    initScrollReveals();
    initCounters();
    initNavbar();
});
