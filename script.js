// Global application state
const OrangeApp = {
    currentStep: 0,
    currentUser: null,
    userData: {},
    selectedSim: null,
    attemptCount: 0,
    maxAttempts: 3,

    // Simulated user database
    mockUsers: {
        '75167171': {
            phone: '75167171',
            password: 'password123',
            name: 'Oaitse Kokome',
            email: 'kokomeodk@gmail.com'
        }
    },

    // Simulated user data
    mockUserData: {
        phoneNumber: '75167171',
        idNumber: '936510813',
        fullName: 'Oaitse Kokome',
        dateOfBirth: '1990-01-01',
        postalAddress: 'P.O. Box 1234, Gaborone',
        simCards: [
            {
                id: 'sim_001',
                number: '75167171',
                status: 'blocked',
                plan: 'Premium Unlimited',
                activatedDate: '2023-01-15'
            },
            {
                id: 'sim_002',
                number: '+267 9876 543',
                status: 'active',
                plan: 'Basic Plan',
                activatedDate: '2023-06-20'
            }
        ],
        email: 'kokomeodk@gmail.com'
    }
};

// Utility functions
const Utils = {
    // Show loading overlay
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.add('active');
    },

    // Hide loading overlay
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.remove('active');
    },

    // Simulate API delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Format phone number
    formatPhoneNumber(number) {
        return number.replace(/(\+267)(\d{3})(\d{3})/, '$1 $2 $3');
    },

    // Generate random transaction ID
    generateTransactionId() {
        return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    },

    // Generate PUK code
    generatePukCode() {
        return Math.floor(10000000 + Math.random() * 90000000).toString();
    },

    // Validate form fields
    validateForm(formId) {
        const form = document.getElementById(formId);
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });

        return isValid;
    },

    // Show field error
    showFieldError(input, message) {
        input.style.borderColor = '#dc3545';
        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('small');
            errorElement.className = 'error-message';
            errorElement.style.color = '#dc3545';
            input.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    },

    // Clear field error
    clearFieldError(input) {
        input.style.borderColor = '#e9ecef';
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    },

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#ff6b35'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Show/hide progress bar
    const progressContainer = document.getElementById('progressContainer');
    if (sectionId === 'loginPage' || sectionId === 'dashboardPage') {
        progressContainer.style.display = 'none';
    } else {
        progressContainer.style.display = 'block';
    }
}

function updateProgressBar(step) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((stepElement, index) => {
        stepElement.classList.remove('active', 'completed');
        if (index < step - 1) {
            stepElement.classList.add('completed');
        } else if (index === step - 1) {
            stepElement.classList.add('active');
        }
    });
    OrangeApp.currentStep = step;
}

// Authentication functions
function showAuthForm(formType) {
    // Update tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[onclick="showAuthForm('${formType}')"]`).classList.add('active');

    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(formType + 'Form').classList.add('active');
}

async function handleLogin(event) {
    event.preventDefault();

    if (!Utils.validateForm('userLoginForm')) {
        return;
    }

    const phoneNumber = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;

    Utils.showLoading();

    try {
        // Simulate API call
        await Utils.delay(1500);

        // Simple validation (in real app, this would be server-side)
        const user = OrangeApp.mockUsers[phoneNumber.replace(/\s/g, '')];
        const isValid = user && user.password === password;

        if (isValid) {
            OrangeApp.currentUser = user;
            Utils.hideLoading();
            Utils.showNotification('Login successful!', 'success');

            // Update dashboard with user name
            document.getElementById('userName').textContent = user.name.split(' ')[0];

            showSection('dashboardPage');
        } else {
            OrangeApp.attemptCount++;
            Utils.hideLoading();
            Utils.showNotification('Invalid phone number or password.', 'error');
        }
    } catch (error) {
        Utils.hideLoading();
        Utils.showNotification('Login failed. Please try again.', 'error');
    }
}

async function handleRegistration(event) {
    event.preventDefault();

    if (!Utils.validateForm('userRegisterForm')) {
        return;
    }

    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        Utils.showNotification('Passwords do not match.', 'error');
        return;
    }

    Utils.showLoading();

    try {
        // Simulate API call
        await Utils.delay(2000);

        Utils.hideLoading();
        Utils.showNotification('Registration successful! Please login.', 'success');

        // Switch to login form
        showAuthForm('login');
    } catch (error) {
        Utils.hideLoading();
        Utils.showNotification('Registration failed. Please try again.', 'error');
    }
}

// Dashboard functions
function showAirtimeService() {
    Utils.showNotification('Airtime service coming soon!', 'info');
}

function showBundlesService() {
    Utils.showNotification('Bundles service coming soon!', 'info');
}

function startPukRequest() {
    showSection('verificationPage');
    updateProgressBar(1);
}

function goBackToDashboard() {
    showSection('dashboardPage');
    updateProgressBar(0);
}

function goBack() {
    switch(OrangeApp.currentStep) {
        case 2:
            showSection('verificationPage');
            updateProgressBar(1);
            break;
        default:
            goBackToDashboard();
    }
}

// Identity verification handling
async function handleVerification(event) {
    event.preventDefault();

    if (!Utils.validateForm('verificationForm')) {
        return;
    }

    const idType = document.getElementById('idType').value;
    const idNumber = document.getElementById('idNumber').value;
    const fullName = document.getElementById('fullName').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const postalAddress = document.getElementById('postalAddress').value;

    Utils.showLoading();

    try {
        // Simulate API call
        await Utils.delay(2000);

        // Simple validation (in real app, this would be server-side)
        const isValid = idNumber === '936510813' &&
            fullName === "Oaitse Kokome" &&
            dateOfBirth === '1990-01-01';

        if (isValid) {
            OrangeApp.userData = {
                idType,
                idNumber,
                fullName,
                dateOfBirth,
                postalAddress
            };

            Utils.hideLoading();
            Utils.showNotification('Identity verification successful!', 'success');

            // Check if user has multiple SIMs
            if (OrangeApp.mockUserData.simCards.length > 1) {
                populateSimCards();
                showSection('simSelectionPage');
                updateProgressBar(2);
            } else {
                OrangeApp.selectedSim = OrangeApp.mockUserData.simCards[0];
                await generateAndDisplayPuk();
            }
        } else {
            OrangeApp.attemptCount++;
            Utils.hideLoading();
            Utils.showNotification('Invalid identity details. Please check and try again.', 'error');
        }
    } catch (error) {
        Utils.hideLoading();
        Utils.showNotification('Verification failed. Please try again.', 'error');
    }
}

// SIM card handling
function populateSimCards() {
    const simCardsList = document.getElementById('simCardsList');
    simCardsList.innerHTML = '';

    OrangeApp.mockUserData.simCards.forEach(sim => {
        const simCard = document.createElement('div');
        simCard.className = 'sim-card';
        simCard.dataset.simId = sim.id;

        simCard.innerHTML = `
            <div class="sim-card-header">
                <div class="sim-number">${Utils.formatPhoneNumber(sim.number)}</div>
                <div class="sim-status ${sim.status}">${sim.status.toUpperCase()}</div>
            </div>
            <div class="sim-details">
                <div>Plan: ${sim.plan}</div>
                <div>Activated: ${new Date(sim.activatedDate).toLocaleDateString()}</div>
            </div>
        `;

        simCard.addEventListener('click', () => selectSimCard(sim.id));
        simCardsList.appendChild(simCard);
    });
}

function selectSimCard(simId) {
    // Remove previous selection
    document.querySelectorAll('.sim-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Select current card
    const selectedCard = document.querySelector(`[data-sim-id="${simId}"]`);
    selectedCard.classList.add('selected');

    // Store selection
    OrangeApp.selectedSim = OrangeApp.mockUserData.simCards.find(sim => sim.id === simId);

    // Enable continue button
    document.getElementById('continueToDelivery').disabled = false;
}

async function proceedToDelivery() {
    if (!OrangeApp.selectedSim) {
        Utils.showNotification('Please select a SIM card to continue.', 'error');
        return;
    }

    await generateAndDisplayPuk();
}

// PUK generation and display
async function generateAndDisplayPuk() {
    Utils.showLoading();

    try {
        // Simulate PUK retrieval from network
        await Utils.delay(2000);

        const pukCode = Utils.generatePukCode();
        const transactionId = Utils.generateTransactionId();

        Utils.hideLoading();

        // Show delivery page with PUK code
        showSection('deliveryPage');
        updateProgressBar(3);

        // Set PUK code and transaction details
        document.getElementById('pukCodeValue').textContent = pukCode;
        document.getElementById('transactionId').textContent = transactionId;
        document.getElementById('transactionDate').textContent = new Date().toLocaleString();

        Utils.showNotification('PUK code generated successfully!', 'success');

        // Log transaction for audit
        console.log('PUK Retrieval Transaction:', {
            transactionId,
            userId: OrangeApp.currentUser?.phone || 'Guest',
            simId: OrangeApp.selectedSim?.id,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        Utils.hideLoading();
        Utils.showNotification('Failed to generate PUK code. Please try again.', 'error');
    }
}

// PUK delivery functions
function copyPukCode() {
    const pukCode = document.getElementById('pukCodeValue').textContent;

    // Copy to clipboard
    navigator.clipboard.writeText(pukCode).then(() => {
        Utils.showNotification('PUK code copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = pukCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        Utils.showNotification('PUK code copied!', 'success');
    });
}

async function sendPukViaSMS() {
    const pukCode = document.getElementById('pukCodeValue').textContent;

    Utils.showLoading();

    try {
        // Simulate SMS sending
        await Utils.delay(1500);

        Utils.hideLoading();
        Utils.showNotification(`PUK code sent via SMS to ${OrangeApp.selectedSim?.number}`, 'success');

    } catch (error) {
        Utils.hideLoading();
        Utils.showNotification('Failed to send SMS. Please try again.', 'error');
    }
}

async function sendPukViaEmail() {
    const pukCode = document.getElementById('pukCodeValue').textContent;

    Utils.showLoading();

    try {
        // Simulate Email sending
        await Utils.delay(1500);

        Utils.hideLoading();
        Utils.showNotification(`PUK code sent via email to ${OrangeApp.mockUserData.email}`, 'success');

    } catch (error) {
        Utils.hideLoading();
        Utils.showNotification('Failed to send email. Please try again.', 'error');
    }
}

function requestAnotherPuk() {
    // Reset form data but keep user logged in
    OrangeApp.userData = {};
    OrangeApp.selectedSim = null;

    // Reset forms
    document.getElementById('verificationForm').reset();

    // Clear selections
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));

    // Reset buttons
    document.getElementById('continueToDelivery').disabled = true;

    // Go back to verification
    showSection('verificationPage');
    updateProgressBar(1);
}

// Logout function
function logout() {
    OrangeApp.currentUser = null;
    OrangeApp.userData = {};
    OrangeApp.selectedSim = null;
    OrangeApp.attemptCount = 0;

    // Reset all forms
    document.querySelectorAll('form').forEach(form => form.reset());
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));

    showSection('loginPage');
    Utils.showNotification('Logged out successfully', 'info');
}

// Event listeners setup
function setupEventListeners() {
    // Authentication forms
    document.getElementById('userLoginForm').addEventListener('submit', handleLogin);
    document.getElementById('userRegisterForm').addEventListener('submit', handleRegistration);

    // Verification form
    document.getElementById('verificationForm').addEventListener('submit', handleVerification);

    // Phone number formatting
    const phoneInputs = ['loginPhone', 'regPhone'];
    phoneInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.startsWith('267')) {
                    value = '+' + value;
                }
                e.target.value = value;
            });
        }
    });

    // Password validation
    const regPassword = document.getElementById('regPassword');
    const regConfirmPassword = document.getElementById('regConfirmPassword');

    if (regConfirmPassword) {
        regConfirmPassword.addEventListener('input', function() {
            if (regPassword.value !== regConfirmPassword.value) {
                Utils.showFieldError(regConfirmPassword, 'Passwords do not match');
            } else {
                Utils.clearFieldError(regConfirmPassword);
            }
        });
    }
}

// Add CSS animations dynamically
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .notification {
            animation: slideIn 0.3s ease !important;
        }
        
        .service-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .auth-tab {
            transition: all 0.3s ease;
        }
        
        .sim-card {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    addAnimations();

    // Set initial state
    showSection('loginPage');

    // Console welcome message
    console.log('Orange Online Services initialized');
    console.log('Test credentials:');
    console.log('Phone: 75167171');
    console.log('Password: password123');
    console.log('Verification details:');
    console.log('ID: 936510813');
    console.log('Name: Oaitse Kokome');
    console.log('DOB: 1990-01-01');
});