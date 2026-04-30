/**
 * Portfolio Interaction & Form Submission Logic
 */

// Tab functionality
function openTab(e, id) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    e.currentTarget.classList.add('active');
    const panel = document.getElementById(id);
    if (panel) panel.classList.add('active');
}

// Mobile menu toggle
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('open');
}

// Intersection Observer for reveal animations
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    // Contact Form Submission to Google Sheet
    const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE'; // Replace with your actual script URL
    const form = document.forms['submit-to-google-sheet'];
    const msg = document.getElementById('form-msg');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            
            // Basic UI feedback
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            fetch(scriptURL, { method: 'POST', body: new FormData(form) })
                .then(response => {
                    msg.innerHTML = "Message sent successfully!";
                    msg.style.color = "#4ade80"; // Success color
                    setTimeout(() => {
                        msg.innerHTML = "";
                    }, 5000);
                    form.reset();
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    msg.innerHTML = "Something went wrong. Please try again.";
                    msg.style.color = "#f87171"; // Error color
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
});
