/**
 * HASKAYA KAROSER - Main JavaScript File
 * Description: Interactive features and animations
 * Version: 1.0
 */

(function() {
    'use strict';

    // DOM Elements
    const preloader = document.getElementById('preloader');
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scrollProgress');
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const backToTop = document.getElementById('backToTop');
    const statNumbers = document.querySelectorAll('.stat-number');
    const contactForm = document.getElementById('contactForm');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // ========================================
    // Preloader
    // ========================================
    function hidePreloader() {
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 500);
        }
    }

    window.addEventListener('load', hidePreloader);

    // ========================================
    // Header Scroll Effect
    // ========================================
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll);

    // ========================================
    // Scroll Progress Bar
    // ========================================
    function updateScrollProgress() {
        if (!scrollProgress) return;
        
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollProgress.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateScrollProgress);

    // ========================================
    // Mobile Menu Toggle
    // ========================================
    function toggleMobileMenu() {
        mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });

    // ========================================
    // Smooth Scroll Navigation
    // ========================================
    function smoothScroll(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // ========================================
    // Active Navigation Link
    // ========================================
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + header.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);

    // ========================================
    // Back to Top Button
    // ========================================
    function toggleBackToTop() {
        if (!backToTop) return;
        
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    if (backToTop) {
        backToTop.addEventListener('click', scrollToTop);
    }

    window.addEventListener('scroll', toggleBackToTop);

    // ========================================
    // Counter Animation
    // ========================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        };

        updateCounter();
    }

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => animateCounter(counter));
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        counterObserver.observe(heroStats);
    }

    // ========================================
    // Gallery Filter
    // ========================================
    function filterGallery() {
        const filterValue = this.getAttribute('data-filter');

        // Update active button
        filterBtns.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Filter items
        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filterValue === 'all' || category === filterValue) {
                item.classList.add('show');
            } else {
                item.classList.remove('show');
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', filterGallery);
    });

    // Show all gallery items initially
    galleryItems.forEach(item => item.classList.add('show'));

    // ========================================
    // Contact Form Handling
    // ========================================
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.phone) {
            showNotification('Lütfen zorunlu alanları doldurun.', 'error');
            return;
        }

        // Phone validation
        const phoneRegex = /^[0-9]{10,11}$/;
        const phoneClean = data.phone.replace(/\s/g, '').replace(/^0/, '');
        if (!phoneRegex.test(phoneClean)) {
            showNotification('Lütfen geçerli bir telefon numarası girin.', 'error');
            return;
        }

        // Email validation (if provided)
        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Lütfen geçerli bir e-posta adresi girin.', 'error');
                return;
            }
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // ========================================
    // Notification System
    // ========================================
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                     type === 'error' ? 'exclamation-circle' : 'info-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            font-weight: 500;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // ========================================
    // Initialize AOS (Animate On Scroll)
    // ========================================
    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                delay: 0,
                mirror: false,
                anchorPlacement: 'top-bottom'
            });
        }
    }

    // ========================================
    // Parallax Effect for Hero Shapes
    // ========================================
    function handleParallax() {
        const shapes = document.querySelectorAll('.shape');
        const scrolled = window.scrollY;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.3;
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }

    // Only apply parallax on non-touch devices
    if (!window.matchMedia('(pointer: coarse)').matches) {
        window.addEventListener('scroll', handleParallax, { passive: true });
    }

    // ========================================
    // Lazy Loading Images
    // ========================================
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        }
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // ========================================
    // Input Focus Effects
    // ========================================
    function initInputEffects() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.closest('.form-group')?.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.closest('.form-group')?.classList.remove('focused');
            });
        });
    }

    // ========================================
    // Phone Input Mask
    // ========================================
    function initPhoneMask() {
        const phoneInput = document.getElementById('phone');
        
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 0) {
                    if (value.length <= 4) {
                        value = value;
                    } else if (value.length <= 7) {
                        value = value.slice(0, 4) + ' ' + value.slice(4);
                    } else if (value.length <= 9) {
                        value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7);
                    } else {
                        value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7, 9) + ' ' + value.slice(9, 11);
                    }
                }
                
                e.target.value = value;
            });
        }
    }

    // ========================================
    // Reveal on Scroll Animation
    // ========================================
    function initRevealOnScroll() {
        const revealElements = document.querySelectorAll('.service-card, .reason-item, .info-card');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            revealObserver.observe(el);
        });
    }

    // ========================================
    // Sticky Elements Enhancement
    // ========================================
    function initStickyElements() {
        const stickyElements = document.querySelectorAll('.service-icon, .experience-badge');
        
        stickyElements.forEach(el => {
            el.style.willChange = 'transform';
        });
    }

    // ========================================
    // Performance: Debounce function
    // ========================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Debounced scroll handler for better performance
    const debouncedScrollHandler = debounce(() => {
        handleHeaderScroll();
        updateScrollProgress();
        setActiveNavLink();
        toggleBackToTop();
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler, { passive: true });

    // ========================================
    // Keyboard Navigation Support
    // ========================================
    function initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC to close mobile menu
            if (e.key === 'Escape') {
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    }

    // ========================================
    // Initialize All Functions
    // ========================================
    function init() {
        initAOS();
        initLazyLoading();
        initInputEffects();
        initPhoneMask();
        initRevealOnScroll();
        initStickyElements();
        initKeyboardNavigation();
        
        // Initial calls
        handleHeaderScroll();
        updateScrollProgress();
        
        console.log('%c HASKAYA KAROSER ', 'background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 10px;');
        console.log('%c Profesyonel Karoser Çözümleri ', 'color: #f39c12; font-size: 14px;');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle visibility change for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations when tab is not visible
            document.body.classList.add('tab-inactive');
        } else {
            document.body.classList.remove('tab-inactive');
        }
    });

})();
