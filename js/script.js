/* ==========================================================================
   Sachi Patel - DevOps & Cloud Engineer Portfolio Scripts
   Pure Vanilla JavaScript (ES6+) - Fast, Modular, Zero Dependencies
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initBackgroundCanvas();
    initStickyHeader();
    initMobileNav();
    initScrollSpy();
    initPipelineVisualization();
    initInteractiveTerminal();
    initAnimatedCounters();
    initBackToTop();
    initContactForm();
});

/* --------------------------------------------------------------------------
   01. Background Canvas — Subtle Cloud Infrastructure Topology Network
   -------------------------------------------------------------------------- */
function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Handle window resize
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Particle nodes definition
    const particleCount = Math.min(Math.floor(width / 25), 45);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw faint grid pattern
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw particles and connection lines
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Move particle
            p.x += p.vx;
            p.y += p.vy;

            // Bounce edges
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // Draw dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
            ctx.fill();

            // Connect nearby nodes
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 * (1 - dist / 130)})`;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* --------------------------------------------------------------------------
   02. Sticky Header & Scroll Effects
   -------------------------------------------------------------------------- */
function initStickyHeader() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* --------------------------------------------------------------------------
   03. Mobile Navigation Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navMenu.classList.toggle('open');
        toggleBtn.classList.toggle('active', isOpen);
        toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when tapping anywhere outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
            navMenu.classList.remove('open');
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

/* --------------------------------------------------------------------------
   04. Scrollspy — Highlight Active Navigation Item
   -------------------------------------------------------------------------- */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   05. Interactive DevOps Pipeline Visualization
   -------------------------------------------------------------------------- */
function initPipelineVisualization() {
    const nodes = document.querySelectorAll('.pipeline-node');
    const display = document.getElementById('pipeline-info-display');

    if (!nodes.length || !display) return;

    const nodeDetails = {
        'node-dev': 'Source Repository (GitHub / GitLab): Commit event triggers webhook payload for automated build & test validation.',
        'node-cicd': 'CI/CD Pipeline Engine (GitHub Actions / GitLab CI): Matrix test runner, container build, and artifact generation in progress (~70% deployment time reduction).',
        'node-automation': 'Infrastructure Automation (Ansible / AWX): Idempotent playbooks provisioning configuration and updating fleet servers (~60% effort reduction).',
        'node-infra': 'Cloud & Virtual Compute (AWS / DigitalOcean / VMware): Production EC2 instances, Droplets, and VMware ESXi VMs configured with WireGuard VPN security.',
        'node-monitor': 'Observability Stack (Prometheus / Grafana / AWS CloudWatch): Ingesting real-time system metrics, container health telemetry, and log alarms.'
    };

    let currentNodeIndex = 0;
    const nodeArray = Array.from(nodes);

    // Auto-cycle through nodes every 3 seconds
    const interval = setInterval(() => {
        nodeArray.forEach(n => n.classList.remove('active'));
        const targetNode = nodeArray[currentNodeIndex];
        targetNode.classList.add('active');
        const detailText = nodeDetails[targetNode.id] || targetNode.getAttribute('data-info');
        display.innerHTML = `<span class="prompt-prefix">sys_log:</span> ${detailText}`;

        currentNodeIndex = (currentNodeIndex + 1) % nodeArray.length;
    }, 3200);

    // Manual hover or click interaction
    nodes.forEach((node) => {
        node.addEventListener('mouseenter', () => {
            clearInterval(interval);
            nodeArray.forEach(n => n.classList.remove('active'));
            node.classList.add('active');
            const detailText = nodeDetails[node.id] || node.getAttribute('data-info');
            display.innerHTML = `<span class="prompt-prefix">sys_log:</span> ${detailText}`;
        });
    });
}

/* --------------------------------------------------------------------------
   06. Interactive CLI Terminal Component
   -------------------------------------------------------------------------- */
function initInteractiveTerminal() {
    const termInput = document.getElementById('terminal-input');
    const termScreen = document.getElementById('terminal-screen');
    const clearBtn = document.getElementById('clear-term-btn');

    if (!termInput || !termScreen) return;

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            termScreen.innerHTML = `
                <div class="interactive-prompt-line">
                    <span class="prompt">sachi@devops:~$</span>
                    <input type="text" id="terminal-input" class="term-input" autocomplete="off" spellcheck="false" placeholder="type 'help'...">
                </div>
            `;
            initInteractiveTerminal();
        });
    }

    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawCmd = termInput.value.trim();
            const cmd = rawCmd.toLowerCase();
            termInput.value = '';

            // Render entered command
            const cmdLine = document.createElement('div');
            cmdLine.className = 'terminal-line';
            cmdLine.innerHTML = `<span class="prompt">sachi@devops:~$</span> <span class="cmd-text">${escapeHtml(rawCmd)}</span>`;

            const outputLine = document.createElement('div');
            outputLine.className = 'terminal-output';

            // Command switch handling
            switch (cmd) {
                case 'help':
                    outputLine.innerHTML = `
                        Available Commands:<br>
                        &bull; <code>whoami</code> — Display profile identity<br>
                        &bull; <code>uptime</code> — Display system reliability metric<br>
                        &bull; <code>skills</code> — List core DevOps engineering tools<br>
                        &bull; <code>impact</code> — View key metrics &amp; achievements<br>
                        &bull; <code>contact</code> — Get direct contact details<br>
                        &bull; <code>date</code> — Display current system timestamp<br>
                        &bull; <code>clear</code> — Clear terminal screen
                    `;
                    break;
                case 'whoami':
                    outputLine.innerHTML = `Sachi Patel // Cloud &amp; DevOps Engineer @ Sigzen Technologies`;
                    break;
                case 'uptime':
                    outputLine.innerHTML = `System Uptime: 99.99% // High Availability MariaDB Galera Cluster active.`;
                    break;
                case 'skills':
                    outputLine.innerHTML = `AWS, DigitalOcean, GitHub Actions, GitLab CI/CD, Docker, Ansible, AWX, Linux, Prometheus, Grafana, CloudWatch, ERPNext, Frappe Bench, WireGuard, Nginx`;
                    break;
                case 'impact':
                    outputLine.innerHTML = `~70% Deployment Speedup | ~60% Manual Effort Reduction | Zero Data Loss Cutover | Zero-Touch Automation`;
                    break;
                case 'contact':
                    outputLine.innerHTML = `Email: sachi.patel.devops@gmail.com | Phone: +91 98765 43210 | Location: India`;
                    break;
                case 'date':
                    outputLine.innerHTML = new Date().toUTCString();
                    break;
                case 'clear':
                    termScreen.innerHTML = '';
                    termScreen.appendChild(createPromptLine());
                    return;
                case '':
                    outputLine.innerHTML = '';
                    break;
                default:
                    outputLine.innerHTML = `command not found: '${escapeHtml(rawCmd)}'. Type <code>help</code> for available commands.`;
            }

            // Insert response before prompt
            const currentPromptLine = termInput.closest('.interactive-prompt-line');
            termScreen.insertBefore(cmdLine, currentPromptLine);
            if (outputLine.innerHTML) {
                termScreen.insertBefore(outputLine, currentPromptLine);
            }

            termScreen.scrollTop = termScreen.scrollHeight;
        }
    });
}

function createPromptLine() {
    const promptDiv = document.createElement('div');
    promptDiv.className = 'interactive-prompt-line';
    promptDiv.innerHTML = `
        <span class="prompt">sachi@devops:~$</span>
        <input type="text" id="terminal-input" class="term-input" autocomplete="off" spellcheck="false" placeholder="type 'help'...">
    `;
    setTimeout(initInteractiveTerminal, 50);
    return promptDiv;
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* --------------------------------------------------------------------------
   07. Animated Counters for Metrics Dashboard
   -------------------------------------------------------------------------- */
function initAnimatedCounters() {
    const counterElements = document.querySelectorAll('[data-target], [data-count]');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target') || el.getAttribute('data-count'), 10);
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';

                if (isNaN(target)) return;

                let start = 0;
                const duration = 1800; // ms
                const stepTime = 30;
                const steps = duration / stepTime;
                const increment = target / steps;

                const timer = setInterval(() => {
                    start += increment;
                    if (start >= target) {
                        el.textContent = `${prefix}${target}${suffix}`;
                        clearInterval(timer);
                    } else {
                        el.textContent = `${prefix}${Math.floor(start)}${suffix}`;
                    }
                }, stepTime);

                obs.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    counterElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   08. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
    const topBtn = document.getElementById('back-to-top');
    if (!topBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            topBtn.classList.add('visible');
        } else {
            topBtn.classList.remove('visible');
        }
    });

    topBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* --------------------------------------------------------------------------
   09. Contact Form Handling
   -------------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');

    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const message = document.getElementById('form-message').value.trim();

        if (!name || !email || !message) {
            feedback.className = 'form-feedback error';
            feedback.textContent = '● ERROR: All required fields must be populated.';
            return;
        }

        // Simulating automated email handler submit
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Sending Packet...`;
        feedback.className = 'form-feedback';
        feedback.textContent = '● Transmitting payload over encrypted connection...';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Send Message
            `;
            feedback.className = 'form-feedback success';
            feedback.textContent = '● SUCCESS: Message transmitted successfully! Sachi will get back to you shortly.';
            form.reset();
        }, 1500);
    });
}
