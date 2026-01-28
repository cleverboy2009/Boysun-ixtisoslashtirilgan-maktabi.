/**
 * Client-side Security Enhancements
 * Provides XSS prevention, input sanitization, and secure form handling
 */

// XSS Prevention - Sanitize user input
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate Uzbekistan phone format
function isValidPhone(phone) {
    const phoneRegex = /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
    return phoneRegex.test(phone.replace(/-/g, ' '));
}

// Get CSRF token from server
async function getCSRFToken() {
    try {
        const response = await fetch('/api/csrf-token');
        const data = await response.json();
        return data.csrf_token;
    } catch (error) {
        console.error('Failed to get CSRF token:', error);
        return null;
    }
}

// Secure form submission
async function submitContactForm(formData) {
    try {
        // Get CSRF token
        const csrfToken = await getCSRFToken();

        if (!csrfToken) {
            throw new Error('Xavfsizlik tokeni olinmadi');
        }

        // Submit form with CSRF token
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!response.ok) {
            // Handle rate limiting
            if (response.status === 429) {
                throw new Error('Juda ko\'p so\'rov yuborildi. Iltimos 15 daqiqa kuting.');
            }

            // Handle validation errors
            if (result.errors && Array.isArray(result.errors)) {
                throw new Error(result.errors.join('\n'));
            }

            throw new Error(result.error || 'Xatolik yuz berdi');
        }

        return result;

    } catch (error) {
        console.error('Form submission error:', error);
        throw error;
    }
}

// Client-side form validation
function validateContactFormData(formData) {
    const errors = [];

    // Validate name
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Ism kamida 2 ta belgidan iborat bo\'lishi kerak');
    }

    // Validate email
    if (!formData.email || !isValidEmail(formData.email)) {
        errors.push('Noto\'g\'ri email manzil');
    }

    // Validate phone (optional but if provided, must be valid)
    if (formData.phone && !isValidPhone(formData.phone)) {
        errors.push('Telefon raqami +998 XX XXX XX XX formatida bo\'lishi kerak');
    }

    // Validate message
    if (!formData.message || formData.message.trim().length < 10) {
        errors.push('Xabar kamida 10 ta belgidan iborat bo\'lishi kerak');
    }

    return errors;
}

// Show notification message
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotif = document.querySelector('.security-notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `security-notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: start; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}" style="font-size: 20px; margin-top: 2px;"></i>
            <div style="flex: 1; white-space: pre-line;">${message}</div>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; padding: 0; margin-left: 10px;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions for use in forms
window.SecurityModule = {
    sanitizeInput,
    isValidEmail,
    isValidPhone,
    getCSRFToken,
    submitContactForm,
    validateContactFormData,
    showNotification
};
