/* ============================================================
   NEURO — Futuristic Premium Landing Page
   JavaScript: 3D Parallax, Scroll Animations, Particles
   ============================================================ */

/* ------------------------------------------------------------
   1. NAVBAR — Glass effect on scroll + Mobile hamburger menu
   ------------------------------------------------------------ */
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Add .scrolled class when scrollY > 50 to trigger glass effect
    function onScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Throttled scroll listener for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                onScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial check
    onScroll();

    // Mobile hamburger toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }
})();

/* ------------------------------------------------------------
   2. MOUSE 3D PARALLAX — Efecto de acercamiento en todo el hero
   La perspectiva 3D y el parallax responden al mouse en toda
   el área del hero, no solo en elementos individuales.
   ------------------------------------------------------------ */
(function init3DParallax() {
    const hero = document.getElementById('hero');
    const heroInner = document.querySelector('.hero-inner');
    const heroBg = document.querySelector('.hero-bg img');
    const scene3d = document.getElementById('scene-3d');

    if (!hero || !heroInner) return;

    const MAX_TILT = 6;

    function onMouseMove(e) {
        const rect = hero.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = (e.clientX - centerX) / (rect.width / 2);
        const mouseY = (e.clientY - centerY) / (rect.height / 2);

        // Perspectiva 3D en todo el contenedor del hero
        heroInner.style.transform = `
            perspective(1200px)
            rotateY(${mouseX * MAX_TILT}deg)
            rotateX(${-mouseY * MAX_TILT}deg)
            translateZ(5px)
        `;
        heroInner.style.transition = 'transform 0.08s ease-out';
        heroInner.style.transformStyle = 'preserve-3d';

        // Parallax sutil en la imagen de fondo (se mueve en dirección opuesta)
        if (heroBg) {
            heroBg.style.transform = `
                scale(1.08)
                translate(${-mouseX * 12}px, ${-mouseY * 12}px)
            `;
            heroBg.style.transition = 'transform 0.08s ease-out';
        }

        // 3D tilt en anillos decorativos
        if (scene3d) {
            scene3d.style.transform = `
                perspective(1200px)
                rotateY(${mouseX * MAX_TILT * 1.5}deg)
                rotateX(${-mouseY * MAX_TILT * 1.5}deg)
                translateZ(15px)
            `;
            scene3d.style.transition = 'transform 0.08s ease-out';
        }

        // Glow dinámico que se desplaza
        const glow = scene3d?.querySelector('.scene-glow');
        if (glow) {
            glow.style.transform = `
                translate(${-mouseX * 18}px, ${-mouseY * 18}px)
            `;
            glow.style.transition = 'transform 0.08s ease-out';
        }
    }

    function resetTransform() {
        heroInner.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg) translateZ(0)';
        heroInner.style.transition = 'transform 0.5s ease-out';

        if (heroBg) {
            heroBg.style.transform = 'scale(1) translate(0, 0)';
            heroBg.style.transition = 'transform 0.5s ease-out';
        }

        if (scene3d) {
            scene3d.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg) translateZ(0)';
            scene3d.style.transition = 'transform 0.5s ease-out';
        }

        const glow = scene3d?.querySelector('.scene-glow');
        if (glow) {
            glow.style.transform = 'translate(0, 0)';
            glow.style.transition = 'transform 0.5s ease-out';
        }
    }

    hero.addEventListener('mousemove', onMouseMove);
    hero.addEventListener('mouseleave', resetTransform);
})();

/* ------------------------------------------------------------
   3. SCROLL REVEAL — Intersection Observer for [data-reveal]
   Animates elements into view when they enter the viewport.
   Uses staggered delays via data-delay attribute.
   ------------------------------------------------------------ */
(function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                // Read custom delay from data-delay attribute (ms), default 0
                const delay = parseInt(el.getAttribute('data-delay')) || 0;

                // Apply delay via CSS custom property
                el.style.setProperty('--reveal-delay', `${delay}ms`);
                el.classList.add('revealed');

                // Stop observing once revealed
                observer.unobserve(el);
            }
        });
    }, {
        // Trigger when 15% of the element is visible
        threshold: 0.15,
        // Slight root margin to trigger a bit early
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
})();

/* ------------------------------------------------------------
   4. PARTICLE CANVAS — Animated background particles
   Renders floating particles with glow effect in the hero.
   ------------------------------------------------------------ */
(function initParticleCanvas() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');

    // Resize canvas to match hero dimensions
    function resizeCanvas() {
        const rect = hero.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle configuration
    const PARTICLE_COUNT = 80;
    const CONNECTION_DISTANCE = 120;
    const PARTICLE_SPEED = 0.3;

    // Create particles with random positions and velocities
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * PARTICLE_SPEED,
            vy: (Math.random() - 0.5) * PARTICLE_SPEED,
            // Size between 1 and 3 pixels
            size: Math.random() * 2 + 1,
            // Opacity between 0.2 and 0.6
            alpha: Math.random() * 0.4 + 0.2
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw each particle
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Move particle
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Draw particle as a small glowing circle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();

            // Draw connections between nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DISTANCE) {
                    // Opacity fades with distance
                    const lineAlpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
})();

/* ------------------------------------------------------------
   5. FEATURE CARD MOUSE TRACKING — Dynamic glow on hover
   Tracks mouse position inside each .feature-card and
   updates CSS custom properties for a radial gradient glow.
   ------------------------------------------------------------ */
(function initFeatureCardGlow() {
    const cards = document.querySelectorAll('.feature-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update CSS custom properties used by the card's ::before pseudo-element
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            card.classList.add('glow-active');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('glow-active');
        });
    });
})();

/* ------------------------------------------------------------
   6. SMOOTH SCROLL — Anchor links with smooth behavior
   Polyfill for older browsers that don't support scroll-behavior.
   ------------------------------------------------------------ */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
})();

/* ------------------------------------------------------------
   7. PARALLAX ON SCROLL — Subtle background shift on hero
   ------------------------------------------------------------ */
(function initScrollParallax() {
    const heroScene = document.getElementById('hero-scene');
    if (!heroScene) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = heroScene.offsetHeight;

        // Only apply while hero is visible
        if (scrollY < heroHeight) {
            const offset = scrollY * 0.15;
            heroScene.style.transform = `translateY(${offset}px)`;
            heroScene.style.opacity = 1 - (scrollY / heroHeight) * 0.3;
        }
    }, { passive: true });
})();
