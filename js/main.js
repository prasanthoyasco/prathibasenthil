document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       SPA NAVIGATION LOGIC
       ========================================================================== */
    const navLinks = document.querySelectorAll('nav a[data-target], .nav-link, .logo, .nav-btn');
    const sections = document.querySelectorAll('section');
    const transitionOverlay = document.getElementById('app-transition');
    
    // Helper to transition to a section
    const navigateTo = (targetId, showTransition = false) => {
        // Update nav links active state (if any)
        document.querySelectorAll('nav a').forEach(link => {
            if (link.dataset.target === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        if (showTransition) {
            transitionOverlay.classList.add('active');
            
            setTimeout(() => {
                // Hide all sections, show target
                sections.forEach(sec => {
                    if (sec.id === targetId) {
                        sec.classList.remove('section-hidden');
                        setTimeout(() => { sec.style.opacity = '1'; }, 50); // slight delay to allow display:flex to apply
                    } else {
                        sec.classList.add('section-hidden');
                        sec.style.opacity = '0';
                    }
                });
                
                // Reset scroll
                window.scrollTo(0, 0);
                
                // Hide transition overlay
                setTimeout(() => {
                    transitionOverlay.classList.remove('active');
                    // Re-trigger scroll animations in the new section
                    triggerScrollAnimations();
                }, 1500); // Overlay stays for 1.5s
            }, 800); // wait for fade to black
        } else {
            // Direct transition without overlay
            sections.forEach(sec => {
                if (sec.id === targetId) {
                    sec.classList.remove('section-hidden');
                    setTimeout(() => { sec.style.opacity = '1'; }, 50);
                } else {
                    sec.style.opacity = '0';
                    setTimeout(() => { sec.classList.add('section-hidden'); }, 800);
                }
            });
            window.scrollTo(0, 0);
            setTimeout(triggerScrollAnimations, 100);
        }
    };

    // Attach click events
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if (targetId) {
                navigateTo(targetId);
            }
        });
    });

    /* ==========================================================================
       SCROLL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('fade-up')) {
                    entry.target.classList.add('visible');
                } else if (entry.target.classList.contains('journey-line')) {
                    entry.target.classList.add('draw');
                }
                // Stop observing once animated
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const triggerScrollAnimations = () => {
        const fadeElements = document.querySelectorAll('.fade-up, .journey-line');
        fadeElements.forEach(el => animateOnScroll.observe(el));
    };
    
    // Initial trigger
    triggerScrollAnimations();

    /* ==========================================================================
       FORM HANDLING
       ========================================================================== */
    const courseCards = document.querySelectorAll('.selection-card');
    const courseInput = document.getElementById('course_type');
    
    courseCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active from all
            courseCards.forEach(c => {
                c.classList.remove('active');
                c.style.borderColor = 'rgba(200, 169, 107, 0.15)';
            });
            // Set active to current
            card.classList.add('active');
            card.style.borderColor = 'var(--color-champagne-gold)';
            courseInput.value = card.getAttribute('data-value');
        });
    });

    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate custom course selection
            if (!courseInput.value) {
                alert("Please select what you are looking for (Video Course or Personal Course).");
                return;
            }
            
            // Show cinematic transition to courses page
            navigateTo('courses', true);
        });
    }

    /* ==========================================================================
       COURSE DETAILS LOGIC
       ========================================================================== */
    const detailBtns = document.querySelectorAll('.detail-btn');
    const backBtns = document.querySelectorAll('.back-btn');
    const coursesHero = document.getElementById('courses-hero');
    const coursesPathway = document.getElementById('courses-pathway');
    const coursesList = document.getElementById('courses-list');
    
    detailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetDetail = document.getElementById(targetId);
            
            // Hide list
            coursesHero.classList.add('section-hidden');
            coursesPathway.classList.add('section-hidden');
            coursesList.classList.add('section-hidden');
            
            // Show detail
            if (targetDetail) {
                targetDetail.classList.remove('section-hidden');
                setTimeout(() => { triggerScrollAnimations(); }, 100);
            }
            window.scrollTo(0, 0);
        });
    });
    
    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Hide all details
            document.querySelectorAll('.course-detail-view').forEach(detail => {
                detail.classList.add('section-hidden');
            });
            
            // Show list
            coursesHero.classList.remove('section-hidden');
            coursesPathway.classList.remove('section-hidden');
            coursesList.classList.remove('section-hidden');
            
            window.scrollTo(0, 0);
        });
    });

    /* ==========================================================================
       DYNAMIC CONFIGURATION INJECTION
       ========================================================================== */
    if (window.SOULVERSE_CONFIG) {
        // Resolve nested object path
        const getNestedValue = (obj, path) => {
            return path.split('.').reduce((acc, part) => acc && acc[part], obj);
        };

        // Populate text content [data-config]
        document.querySelectorAll('[data-config]').forEach(el => {
            const value = getNestedValue(window.SOULVERSE_CONFIG, el.getAttribute('data-config'));
            if (value !== undefined) {
                // If it's an input/textarea, set value, otherwise set textContent
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.value = value;
                } else {
                    el.textContent = value;
                }
            }
        });

        // Populate links [data-config-href]
        document.querySelectorAll('[data-config-href]').forEach(el => {
            const hrefAttr = el.getAttribute('data-config-href');
            let url = '';
            
            if (hrefAttr.startsWith('whatsapp:')) {
                const waType = hrefAttr.split(':')[1];
                url = window.SOULVERSE_CONFIG.getWhatsAppUrl(waType);
            } else {
                url = getNestedValue(window.SOULVERSE_CONFIG, hrefAttr);
            }
            
            if (url) el.href = url;
        });
        
        if (window.SOULVERSE_CONFIG.brand && window.SOULVERSE_CONFIG.brand.name) {
            document.title = window.SOULVERSE_CONFIG.brand.name + " - " + window.SOULVERSE_CONFIG.brand.tagline;
        }
    }

    /* ==========================================================================
       WHATSAPP REDIRECTION LOGIC
       ========================================================================== */
    const redirectWhatsApp = (type) => {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        const needs = document.getElementById('needs').value.trim();
        
        let details = "";
        if (name || email || mobile || needs) {
            details = `\n\nMy Details:\nName: ${name || 'N/A'}\nEmail: ${email || 'N/A'}\nMobile: ${mobile || 'N/A'}\nNeeds: ${needs || 'N/A'}`;
        }
        
        if (window.SOULVERSE_CONFIG) {
            const url = window.SOULVERSE_CONFIG.getWhatsAppUrl(type, details);
            window.open(url, '_blank');
        } else {
            alert("Configuration not found. Please try again later.");
        }
    };

    const btnBeginPersonal = document.getElementById('btn-begin-personal');
    if (btnBeginPersonal) {
        btnBeginPersonal.addEventListener('click', () => {
            redirectWhatsApp('supernaturalCourse');
        });
    }

    const btnBeginVideo = document.getElementById('btn-begin-video');
    if (btnBeginVideo) {
        btnBeginVideo.addEventListener('click', () => {
            redirectWhatsApp('jobMoneyCourse');
        });
    }
});
