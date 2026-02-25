document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section'); // Get all main sections

    // --- Mobile Navigation Toggle ---
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active'); // Animate hamburger icon
        });

        // Close nav menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
            setActiveLink(targetId); // Update active link after click
        });
    });

    // --- Intersection Observer for Fade-in Animations ---
    const fadeInElements = document.querySelectorAll('.section-title,.section-description,.dish-card,.footer-col,.about-image,.about-text,.contact-info,.contact-form');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // When 10% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('fade-in');
                }
                setTimeout(() => {
                    entry.target.classList.add('appear');
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // --- Active Navigation Link on Scroll & Sticky Header ---
    const header = document.querySelector('.main-header');
    const homeSection = document.querySelector('#home'); // Using home section for initial height
    const headerHeight = header? header.offsetHeight : 0;

    // Adjust home section margin-top initially to account for fixed header
    if (homeSection) {
        homeSection.style.marginTop = `${headerHeight}px`;
    }

    function setActiveLink(currentId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentId) {
                link.classList.add('active');
            }
        });
    }

    // Set initial active link when page loads
    window.addEventListener('load', () => {
        let currentSectionId = '#home';
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.getBoundingClientRect().top - headerHeight <= 100) {
                currentSectionId = '#' + section.id;
                break;
            }
        }
        setActiveLink(currentSectionId);
    });

    window.addEventListener('scroll', () => {
        // Sticky Header: add 'scrolled' class when scrolled past initial position
        if (header && window.scrollY > headerHeight) {
             header.classList.add('scrolled');
        } else if (header) {
             header.classList.remove('scrolled');
        }

        // Active navigation link logic
        let current = '';
        sections.forEach(section => {
            // Adjust offset for fixed header
            const sectionTop = section.offsetTop - headerHeight;
            const sectionHeight = section.clientHeight;
            // Check if top of section is at or above viewport's top, plus a small buffer
            if (pageYOffset >= sectionTop - 50) {
                current = '#' + section.id;
            }
        });
        setActiveLink(current);
    });

});