/* Main Script */
document.addEventListener('DOMContentLoaded', () => {
    console.log('School website loaded');

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- Theme Toggle Logic ---
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');

            // Update icon
            if (icon) {
                if (body.classList.contains('light-mode')) {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                    localStorage.setItem('theme', 'light');
                } else {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                    localStorage.setItem('theme', 'dark');
                }
            }
        });
    }

    // --- Header Scroll Effect (Liquid Glass) ---
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }


    // --- 3D Tilt Interaction ---
    const cards = document.querySelectorAll('.glass-card, .menu-card, .btn');

    // 3D Toggle Logic
    const threeDToggle = document.querySelector('.three-d-toggle');
    let is3DEnabled = localStorage.getItem('is3DEnabled') !== 'false'; // Default to true

    function update3DIcon() {
        if (!threeDToggle) return;
        const icon = threeDToggle.querySelector('i');
        if (!icon) return;

        if (is3DEnabled) {
            icon.classList.remove('fa-cube');
            icon.classList.add('fa-cube');
            threeDToggle.style.opacity = '1';
            threeDToggle.setAttribute('aria-label', 'Disable 3D Effects');
            document.body.classList.remove('static-mode');
        } else {
            icon.classList.remove('fa-cube');
            icon.classList.add('fa-ban');
            threeDToggle.style.opacity = '0.7';
            threeDToggle.setAttribute('aria-label', 'Enable 3D Effects');
            document.body.classList.add('static-mode');
        }
    }

    if (threeDToggle) {
        update3DIcon();
        threeDToggle.addEventListener('click', () => {
            is3DEnabled = !is3DEnabled;
            localStorage.setItem('is3DEnabled', is3DEnabled);
            update3DIcon();

            // Reset if disabled
            if (!is3DEnabled) {
                cards.forEach(card => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                });
            }
        });
    }

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (!is3DEnabled) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation (max 15deg)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Invert axis for natural tilt
            const rotateY = ((x - centerX) / centerX) * 10;

            // Apply transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Shininess effect (optional update to pseudo element if needed, but CSS handles basic shine)
            // We can also move the shine interactively if we select it
            // card.style.setProperty('--shine-x', `${x}px`);
            // card.style.setProperty('--shine-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            // Reset position
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // --- Background Parallax ---
    const blobs = document.querySelectorAll('.blob');
    if (blobs.length > 0) {
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            blobs.forEach((blob, index) => {
                const speed = (index + 1) * 20; // Different speeds
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;

                // We keep the original animation (morph) by using a separate transform property or wrapper if strict needed, 
                // but adding translate here acts as an offset.
                // However, the blob has an animation 'morph'. 
                // To combine, we should better apply this to the wrapper OR modify the animation.
                // Simpler approach: Apply to .blob-container but inverted for depth.
            });

            // Apply to container for global feel
            const container = document.querySelector('.blob-container');
            if (container) {
                const moveX = (mouseX - 0.5) * 30;
                const moveY = (mouseY - 0.5) * 30;
                container.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
    }
});
