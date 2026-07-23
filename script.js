/**
 * NextGen Web IT - Premium JavaScript
 * Handles: Navigation, animations, FAQ, counters, particles, form
 */

document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu ---
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', function() {
            mobileBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            mobileBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
                mobileBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // --- Navbar Scroll ---
    const navbar = document.getElementById('navbar');

    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = navbar ? navbar.offsetHeight : 0;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });

    // --- Active nav link on scroll ---
    const sections = document.querySelectorAll('section[id]');

    function highlightNav() {
        const pos = window.scrollY + 120;
        sections.forEach(function(section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector('.nav-link[href="#' + id + '"]');
            if (pos >= top && pos < top + height) {
                navLinks.forEach(function(l) { l.classList.remove('active'); });
                if (link) link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();

    // --- Particles ---
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 40; i++) {
            const dot = document.createElement('div');
            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 20;
            const duration = Math.random() * 20 + 10;
            const xMove = (Math.random() - 0.5) * 60;
            const yMove = (Math.random() - 0.5) * 60;
            dot.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(0, 212, 255, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                top: ${y}%;
                left: ${x}%;
                animation: floatParticle${i} ${duration}s ${delay}s infinite alternate;
                pointer-events: none;
            `;
            particlesContainer.appendChild(dot);
            
            // Create unique keyframe for each particle
            const style = document.createElement('style');
            style.textContent = `
                @keyframes floatParticle${i} {
                    0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                    100% { transform: translate(${xMove}px, ${yMove}px) scale(1.5); opacity: 0.8; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // --- Animated Counters ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    function animateCounters() {
        if (counted) return;
        statNumbers.forEach(function(el) {
            const target = parseFloat(el.getAttribute('data-count'));
            if (isNaN(target)) return;
            const duration = 2000;
            const startTime = performance.now();
            const isFloat = target % 1 !== 0;

            function updateCounter(time) {
                const progress = Math.min((time - startTime) / duration, 1);
                const current = progress * target;
                el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    el.textContent = isFloat ? target.toFixed(1) : target;
                }
            }
            requestAnimationFrame(updateCounter);
        });
        counted = true;
    }

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(statsSection);
    }

    // Also trigger hero counters
    const heroTrust = document.querySelector('.hero-trust');
    if (heroTrust && 'IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.hero-trust .trust-number').forEach(function(el) {
                        const target = parseFloat(el.getAttribute('data-count'));
                        if (isNaN(target)) return;
                        const duration = 1500;
                        const startTime = performance.now();
                        const isFloat = target % 1 !== 0;
                        function updateCounter(time) {
                            const progress = Math.min((time - startTime) / duration, 1);
                            const current = progress * target;
                            el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
                            if (progress < 1) {
                                requestAnimationFrame(updateCounter);
                            } else {
                                el.textContent = isFloat ? target.toFixed(1) : target;
                            }
                        }
                        requestAnimationFrame(updateCounter);
                    });
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        heroObserver.observe(heroTrust);
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            faqItems.forEach(function(i) { i.classList.remove('active'); });
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- Form ---
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            let valid = true;
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(function(input) {
                const group = input.closest('.form-group');
                let error = group.querySelector('.error-message');
                if (!error) {
                    error = document.createElement('div');
                    error.className = 'error-message';
                    group.appendChild(error);
                }
                input.classList.remove('error');
                error.textContent = '';

                if (!input.value.trim()) {
                    valid = false;
                    input.classList.add('error');
                    error.textContent = 'This field is required';
                } else if (input.type === 'email' && !/^[^@]+@[^@]+\.[^@]+$/.test(input.value)) {
                    valid = false;
                    input.classList.add('error');
                    error.textContent = 'Valid email required';
                }
            });

            if (!valid) return;

            const btn = form.querySelector('button[type="submit"]');
            const original = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            const data = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            })
            .then(function(res) {
                if (res.ok) {
                    form.reset();
                    successMsg.classList.add('show');
                    btn.textContent = original;
                    btn.disabled = false;
                    setTimeout(function() {
                        successMsg.classList.remove('show');
                    }, 5000);
                } else {
                    throw new Error('Failed');
                }
            })
            .catch(function() {
                alert('Something went wrong. Please try again.');
                btn.textContent = original;
                btn.disabled = false;
            });
        });
    }

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.bento-card, .work-card, .feature-card, .stat-card, .timeline-step, .pricing-card');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // --- Chart bars animation ---
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach(function(bar) {
        const height = bar.style.height;
        bar.style.height = '10px';
        bar.addEventListener('mouseenter', function() {
            this.style.height = height;
            this.style.opacity = '1';
        });
        bar.addEventListener('mouseleave', function() {
            this.style.height = '10px';
            this.style.opacity = '0.6';
        });
    });

});

/**
 * NEW JAVASCRIPT - Add to existing script.js
 */

// --- Parallax Scrolling for Tech Badges ---
document.addEventListener('DOMContentLoaded', function() {
    const techBadges = document.querySelectorAll('.tech-badge');
    
    if (techBadges.length > 0) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            techBadges.forEach(function(badge, index) {
                const speed = 0.02 + (index * 0.005);
                const yOffset = scrollY * speed;
                badge.style.transform = `translateY(${yOffset}px)`;
            });
        }, { passive: true });
    }

    // --- Workflow Step Animation ---
    const workflowSteps = document.querySelectorAll('.workflow-step');
    
    if ('IntersectionObserver' in window && workflowSteps.length > 0) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        workflowSteps.forEach(function(step) {
            step.style.opacity = '0';
            step.style.transform = 'translateY(20px)';
            step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(step);
        });
    }

    // --- Learning Cards Animation ---
    const learningCards = document.querySelectorAll('.learning-card');
    
    if ('IntersectionObserver' in window && learningCards.length > 0) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        learningCards.forEach(function(card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // --- Choose Cards Animation ---
    const chooseCards = document.querySelectorAll('.choose-card');
    
    if ('IntersectionObserver' in window && chooseCards.length > 0) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        chooseCards.forEach(function(card) {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            observer.observe(card);
        });
    }

    // --- Floating Shapes Parallax ---
    const shapes = document.querySelectorAll('.shape');
    
    if (shapes.length > 0) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            shapes.forEach(function(shape, index) {
                const speed = 0.015 + (index * 0.01);
                const yOffset = scrollY * speed;
                shape.style.transform = `translateY(${yOffset}px)`;
            });
        }, { passive: true });
    }
});