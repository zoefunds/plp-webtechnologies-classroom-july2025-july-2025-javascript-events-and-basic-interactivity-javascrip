// ============= script.js =============
// Advanced interactivity for the professional UI assignment
// Modular, well-commented, and accessible

// =============== 1. LIGHT/DARK MODE TOGGLE (with Persistence) ===============
const modeToggle = document.getElementById('modeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark' || (!currentTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
    modeToggle.textContent = '☀️';
    modeToggle.setAttribute('aria-label', 'Switch to light mode');
    modeToggle.setAttribute('aria-pressed', 'true');
} else {
    modeToggle.textContent = '🌙';
    modeToggle.setAttribute('aria-label', 'Switch to dark mode');
    modeToggle.setAttribute('aria-pressed', 'false');
}
modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    modeToggle.textContent = isDark ? '☀️' : '🌙';
    modeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    modeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// =============== 2. NAVBAR DROPDOWN (Accessible) ===============
const dropdown = document.querySelector('.dropdown');
dropdown.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dropdown.querySelector('.dropdown-menu').style.display = 'block';
    }
});
dropdown.addEventListener('blur', () => {
    setTimeout(() => dropdown.querySelector('.dropdown-menu').style.display = 'none', 150);
});

// =============== 3. TABBED INTERFACE ===============
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => activateTab(idx));
    tab.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') {
            tabs[(idx + 1) % tabs.length].focus();
        } else if (e.key === 'ArrowLeft') {
            tabs[(idx - 1 + tabs.length) % tabs.length].focus();
        }
    });
});
function activateTab(idx) {
    tabs.forEach((t, i) => {
        t.classList.toggle('active', i === idx);
        t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
        tabContents[i].classList.toggle('hidden', i !== idx);
    });
}
activateTab(0);

// =============== 4. ANIMATED COUNTER GAME ===============
let counter = 0;
const counterValue = document.getElementById('counterValue');
const incrementBtn = document.getElementById('incrementBtn');
const decrementBtn = document.getElementById('decrementBtn');
const resetBtn = document.getElementById('resetBtn');
const counterMessage = document.getElementById('counterMessage');
const progress = document.getElementById('counterProgress');
const beepSound = document.getElementById('beepSound');

function animateCounter(newVal) {
    counterValue.style.transform = 'scale(1.21)';
    setTimeout(() => {
        counterValue.textContent = newVal;
        counterValue.style.transform = 'scale(1)';
    }, 120);
}
function playBeep() {
    beepSound.currentTime = 0;
    beepSound.play();
}
function updateCounterDisplay() {
    animateCounter(counter);
    progress.value = Math.abs(counter);
    if (counter === 20) {
        counterMessage.textContent = "🎉 Congrats! You've reached 20!";
        counterValue.style.color = '#38a169';
        playBeep();
    } else if (counter === -10) {
        counterMessage.textContent = "😮 Counter at -10. Try positive!";
        counterValue.style.color = '#e53e3e';
    } else if (counter === 0) {
        counterMessage.textContent = "Counter reset.";
        counterValue.style.color = '';
    } else {
        counterMessage.textContent = '';
        counterValue.style.color = '';
    }
}
incrementBtn.addEventListener('click', () => {
    counter = Math.min(counter + 1, 20);
    updateCounterDisplay();
});
decrementBtn.addEventListener('click', () => {
    counter = Math.max(counter - 1, -10);
    updateCounterDisplay();
});
resetBtn.addEventListener('click', () => {
    counter = 0;
    updateCounterDisplay();
});
updateCounterDisplay();

// =============== 5. COLLAPSIBLE FAQ ACCORDION (Accessible & Animated) ===============
const faqAccordion = document.getElementById('faqAccordion');
faqAccordion.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => toggleFaq(btn));
    btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFaq(btn);
        }
    });
});
function toggleFaq(btn) {
    const answer = document.getElementById(btn.getAttribute('aria-controls'));
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    // Collapse all if not multi-open (accordion style)
    faqAccordion.querySelectorAll('.faq-question').forEach(q => {
        q.setAttribute('aria-expanded', 'false');
        document.getElementById(q.getAttribute('aria-controls')).setAttribute('aria-hidden', 'true');
    });
    if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        answer.setAttribute('aria-hidden', 'false');
        answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
        btn.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');
        answer.style.maxHeight = null;
    }
}
// Init all FAQ answers as hidden
faqAccordion.querySelectorAll('.faq-answer').forEach(ans => {
    ans.setAttribute('aria-hidden', 'true');
    ans.style.maxHeight = null;
});

// =============== 6. CUSTOM FORM VALIDATION ===============
const signupForm = document.getElementById('signupForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const formSuccess = document.getElementById('formSuccess');
const passwordStrength = document.getElementById('passwordStrength');
const passwordStrengthLabel = document.getElementById('passwordStrengthLabel');

// Helper: Validate Name (letters, spaces, min 2 words)
function validateName() {
    const val = nameInput.value.trim();
    if (!val) {
        nameError.textContent = 'Full name is required.';
        return false;
    }
    if (!/^([A-Za-z]+ [A-Za-z]+)( [A-Za-z]+)*$/.test(val)) {
        nameError.textContent = 'Please enter at least two words (letters only).';
        return false;
    }
    nameError.textContent = '';
    return true;
}
// Helper: Validate Email (simple regex)
function validateEmail() {
    const val = emailInput.value.trim();
    if (!val) {
        emailError.textContent = 'Email is required.';
        return false;
    }
    if (!/^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$/.test(val)) {
        emailError.textContent = 'Enter a valid email address.';
        return false;
    }
    emailError.textContent = '';
    return true;
}
// Helper: Password Strength (returns score 0-4)
function getPasswordStrength(val) {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/\d/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
}
function strengthLabel(score) {
    return ['Too Weak', 'Weak', 'Moderate', 'Strong', 'Excellent'][score];
}
function validatePassword() {
    const val = passwordInput.value;
    const score = getPasswordStrength(val);
    passwordStrength.value = score;
    passwordStrengthLabel.textContent = strengthLabel(score);
    passwordStrengthLabel.style.color = score >= 3 ? '#38a169' : (score === 2 ? '#fbbf24' : '#e53e3e');
    if (!val) {
        passwordError.textContent = 'Password is required.';
        return false;
    }
    if (score < 3) {
        passwordError.textContent = 'Password should be at least 8 chars, include uppercase, digit, symbol.';
        return false;
    }
    passwordError.textContent = '';
    return true;
}
function validateConfirmPassword() {
    if (!confirmPasswordInput.value) {
        confirmPasswordError.textContent = 'Please confirm your password.';
        return false;
    }
    if (confirmPasswordInput.value !== passwordInput.value) {
        confirmPasswordError.textContent = 'Passwords do not match.';
        return false;
    }
    confirmPasswordError.textContent = '';
    return true;
}
// Real-time validation events
nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
passwordInput.addEventListener('input', validatePassword);
confirmPasswordInput.addEventListener('input', validateConfirmPassword);
// On submit
signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    formSuccess.textContent = '';
    const validName = validateName();
    const validEmail = validateEmail();
    const validPw = validatePassword();
    const validConfirm = validateConfirmPassword();
    if (validName && validEmail && validPw && validConfirm) {
        formSuccess.textContent = '🎉 Registration successful!';
        signupForm.reset();
        passwordStrength.value = 0;
        passwordStrengthLabel.textContent = '';
    }
});

// ============= END OF script.js =============