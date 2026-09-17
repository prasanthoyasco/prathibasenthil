document.addEventListener('DOMContentLoaded', () => {
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
        
        // Note: Title is statically managed in HTML for SEO now, 
        // so we avoid overwriting it via JS dynamically unless absolutely necessary.
    }
});
