document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       FORM HANDLING
       ========================================================================== */
    const courseCards = document.querySelectorAll('.selection-card');
    const courseInput = document.getElementById('course_type');
    
    if (courseCards.length > 0 && courseInput) {
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
    }

    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate custom course selection
            if (courseInput && !courseInput.value) {
                alert("Please select what you are looking for (Video Course or Personal Course).");
                return;
            }
            
            // Redirect to courses page with selection
            const selection = courseInput ? courseInput.value : '';
            if (window.handlePageTransition) {
                window.handlePageTransition(`/courses?journey=${encodeURIComponent(selection)}`);
            } else {
                window.location.href = `/courses?journey=${encodeURIComponent(selection)}`;
            }
        });
    }

    /* ==========================================================================
       WHATSAPP REDIRECTION LOGIC
       ========================================================================== */
    const redirectWhatsApp = (type) => {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const mobileInput = document.getElementById('mobile');
        const needsInput = document.getElementById('needs');
        
        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const mobile = mobileInput ? mobileInput.value.trim() : '';
        const needs = needsInput ? needsInput.value.trim() : '';
        
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
