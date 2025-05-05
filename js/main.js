document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const heroImage = document.querySelector('.hero-img');

    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-theme');
        themeIcon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
        if (heroImage) {
            heroImage.src = '/assets/moodboard-example-light.png';
        }
    }
    console.log(themeIcon)
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const isLightTheme = body.classList.contains('light-theme');
        
        // Update icon and save preference
        themeIcon.innerHTML = isLightTheme 
            ? '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>'
            : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        
        // Update hero image based on theme
        if (heroImage) {
            console.log(heroImage.src)
            heroImage.src = isLightTheme 
                ? '/assets/moodboard-example-light.png' 
                : '/assets/moodboard-example.png';
            console.log(heroImage.src)

        }
        
        localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });

    // Create Page Functionality
    if (document.getElementById('generateBtn')) {
        const generateBtn = document.getElementById('generateBtn');
        const inputView = document.getElementById('inputView');
        const moodboardView = document.getElementById('moodboardView');
        const newBoardBtn = document.getElementById('newBoardBtn');
        const promptInput = document.getElementById('promptInput');
        const exampleChips = document.querySelectorAll('.example-chip');

        generateBtn.addEventListener('click', () => {
            inputView.style.display = 'none';
            moodboardView.style.display = 'block';
            document.querySelector('.board-prompt-display').textContent = `Based on: "${promptInput.value || 'Modern minimalist tech interface with neon accents'}"`;
        });

        newBoardBtn.addEventListener('click', () => {
            inputView.style.display = 'block';
            moodboardView.style.display = 'none';
            promptInput.value = '';
        });

        exampleChips.forEach(chip => {
            chip.addEventListener('click', () => {
                promptInput.value = chip.textContent;
                inputView.style.display = 'none';
                moodboardView.style.display = 'block';
                document.querySelector('.board-prompt-display').textContent = `Based on: "${chip.textContent}"`;
            });
        });
    }

    // Login Page Functionality
    if (document.getElementById('authForm')) {
        const authForm = document.getElementById('authForm');
        const authToggle = document.getElementById('authToggle');
        const formTitle = document.getElementById('formTitle');
        const submitBtn = document.getElementById('submitBtn');
        const nameField = document.getElementById('nameField');

        let isSignup = true;

        authToggle.addEventListener('click', () => {
            isSignup = !isSignup;
            formTitle.textContent = isSignup ? 'Sign Up' : 'Log In';
            submitBtn.textContent = isSignup ? 'Sign Up' : 'Log In';
            nameField.style.display = isSignup ? 'block' : 'none';
            authToggle.textContent = isSignup ? 'Already have an account? Log In' : 'Need an account? Sign Up';
        });

        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically handle form submission to a backend
            // For now, we'll just log the form data
            const formData = new FormData(authForm);
            console.log({
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                action: isSignup ? 'signup' : 'login'
            });
            // Redirect to create page after successful auth
            window.location.href = 'create.html';
        });
    }
});
