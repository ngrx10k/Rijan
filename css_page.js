/**
 * CSS Page Logic - Keywords
 */
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle-keywords');
    const container = document.getElementById('keyword-container');
    if (toggle && container) {
        toggle.onclick = () => container.classList.toggle('active');
    }
});
