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
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyMcs6xKTii0cE87NLLcQh6ciwVF3b6n2AuYxpFPO5aqrqY_VH49J6yLVP7Mlbnu-0k/exec'; 
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
                .then(response => response.json())
                .then(data => {
                    console.log('Server Response:', data); // Diagnostic log
                    if (data.result === 'success') {
                        msg.innerHTML = "Thank you! Your message has been sent successfully.";
                        msg.style.color = "#4ade80"; 
                        form.reset();
                    } else {
                        throw new Error(data.error || 'Server error');
                    }
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    msg.innerHTML = "Unable to send message directly. Please email me at nirmitktripathii@yahoo.com";
                    msg.style.color = "#f87171";
                })
                .finally(() => {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                    setTimeout(() => { msg.innerHTML = ""; }, 5000);
                });
        });
    }
    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    // Load saved theme or use system preference
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    
    const applyTheme = (theme) => {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    };

    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    }
});
