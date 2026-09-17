document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       CINEMATIC PAGE TRANSITIONS & ANIMATIONS
       ========================================================================== */
    const transitionOverlay = document.getElementById('app-transition');
    
    // Page load fade in
    if (transitionOverlay) {
        setTimeout(() => {
            transitionOverlay.classList.remove('active');
            triggerScrollAnimations();
        }, 100);
    } else {
        triggerScrollAnimations();
    }

    // Intercept clicks on local links for fade out transition
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        // Check if it's a local link, not an ID, not a blank target
        if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto:') && link.target !== '_blank') {
            e.preventDefault();
            
            // Check prefers-reduced-motion
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            if (transitionOverlay && !prefersReducedMotion) {
                transitionOverlay.classList.add('active');
                setTimeout(() => {
                    window.location.href = href;
                }, 400); // 400ms fade out before navigation
            } else {
                window.location.href = href;
            }
        }
    });

    // Expose transition function globally for other scripts (like enquiry.js)
    window.handlePageTransition = function(url) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (transitionOverlay && !prefersReducedMotion) {
            transitionOverlay.classList.add('active');
            setTimeout(() => {
                window.location.href = url;
            }, 400);
        } else {
            window.location.href = url;
        }
    };

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
            }
        });
    }, observerOptions);

    function triggerScrollAnimations() {
        const fadeElements = document.querySelectorAll('.fade-up, .journey-line');
        fadeElements.forEach(el => animateOnScroll.observe(el));
    }
    
    // Highlight logic for courses page
    const urlParams = new URLSearchParams(window.location.search);
    const journey = urlParams.get('journey');
    if (journey) {
        const premiumCard = document.querySelector('.premium-card');
        const regularCard = document.querySelector('.course-card:not(.premium-card)');
        
        if (journey === 'personal' && premiumCard) {
            premiumCard.style.boxShadow = '0 0 20px rgba(200, 169, 107, 0.4)';
            premiumCard.style.borderColor = 'var(--color-champagne-gold)';
        } else if (journey === 'video' && regularCard) {
            regularCard.style.boxShadow = '0 0 20px rgba(200, 169, 107, 0.4)';
            regularCard.style.borderColor = 'var(--color-champagne-gold)';
        }
    }
});
