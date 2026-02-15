/**
 * Learn Code By Rijan - Premium Interactive Engine
 * Handles Live Playground and UI Interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Keyword Selection Logic ---
    const toggleBtn = document.getElementById('toggle-keywords');
    const container = document.getElementById('keyword-container');
    const btnText = toggleBtn?.querySelector('.btn-text');
    const icon = toggleBtn?.querySelector('.btn-icon');

    if (toggleBtn && container) {
        toggleBtn.addEventListener('click', () => {
            container.classList.toggle('active');

            if (container.classList.contains('active')) {
                if (btnText) btnText.textContent = 'Hide All Keywords';
                if (icon) icon.style.transform = 'rotate(180deg)';
                container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                if (btnText) btnText.textContent = 'View All Keywords';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        });
    }

    // --- Live Playground Engine ---
    const editor = document.getElementById('html-editor');
    const preview = document.getElementById('preview-frame');

    if (editor && preview) {
        const updatePreview = () => {
            const content = editor.value;
            const doc = preview.contentDocument || preview.contentWindow.document;
            doc.open();
            doc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { 
                            font-family: -apple-system, sans-serif; 
                            padding: 20px; 
                            background: white; 
                            color: #1c1c1e;
                        }
                        * { transition: all 0.3s ease; }
                    </style>
                </head>
                <body>${content}</body>
                </html>
            `);
            doc.close();
        };

        editor.addEventListener('input', updatePreview);
        // Initial render
        updatePreview();
    }
});
