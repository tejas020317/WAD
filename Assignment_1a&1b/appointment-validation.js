document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('appointmentForm');

    // Gender Radio Buttons allow only one selection by default due to name="gender"

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validateForm()) {
            saveDataAndRedirect();
        }
    });

    function validateForm() {
        let isValid = true;
        let errorMessages = [];

        // Reset previous validation states
        clearValidationErrors();

        // 1. Phone Number Validation
        // Should be 10 digits starting with 6-9
        const phoneInput = document.getElementById('phone');
        const phoneValue = phoneInput.value.trim();
        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneRegex.test(phoneValue)) {
            showError(phoneInput);
            isValid = false;
            errorMessages.push("Phone number must be 10 digits and start with 6-9.");
        } else {
            showSuccess(phoneInput);
        }

        // 2. Password Validation
        // One letter capital, one special symbol, 8 chars
        const passwordInput = document.getElementById('password');
        const passwordValue = passwordInput.value;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

        if (!passwordRegex.test(passwordValue)) {
            showError(passwordInput);
            isValid = false;
            errorMessages.push("Password must have at least 8 characters, one capital letter, and one special symbol.");
        } else {
            showSuccess(passwordInput);
        }

        // 3. Gender Validation
        const genderRadios = document.querySelectorAll('input[name="gender"]');
        let isGenderSelected = false;
        let selectedGender = '';
        genderRadios.forEach(radio => {
            if (radio.checked) {
                isGenderSelected = true;
                selectedGender = radio.value;
            }
        });

        if (!isGenderSelected) {
            isValid = false;
            errorMessages.push("Please select a gender.");
        }

        // 4. Multi Checkbox Validation (Preferred Days)
        const dayCheckboxes = document.querySelectorAll('input[name="days"]');
        let isDaySelected = false;
        const selectedDays = [];

        dayCheckboxes.forEach(cb => {
            if (cb.checked) {
                isDaySelected = true;
                selectedDays.push(cb.value);
            }
        });

        const daysContainer = dayCheckboxes[0].closest('.bg-light');
        const daysError = document.getElementById('daysError');

        if (!isDaySelected) {
            daysContainer.classList.add('border', 'border-danger');
            daysError.style.display = 'block';
            isValid = false;
            errorMessages.push("Please select at least one preferred consultation day.");
        } else {
            daysContainer.classList.remove('border', 'border-danger');
            daysError.style.display = 'none';
        }

        // 4. Single Checkbox Validation (Terms)
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            termsCheckbox.classList.add('is-invalid');
            isValid = false;
            errorMessages.push("You must agree to the Terms and Conditions.");
        } else {
            termsCheckbox.classList.remove('is-invalid');
            termsCheckbox.classList.add('is-valid');
        }

        // 5. Standard Fields & EMAIL REGEX FIX
        const nameInput = document.getElementById('name');
        const nameValue = nameInput.value.trim();
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameValue || !nameRegex.test(nameValue)) {
            showError(nameInput);
            isValid = false;
            errorMessages.push("Please enter a valid name.");
        } else { showSuccess(nameInput); }

        const emailInput = document.getElementById('email');
        // Regex: Must have '@' and '.' and characters
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
            showError(emailInput);
            isValid = false;
            errorMessages.push("Please enter a valid email address (e.g., user@example.com).");
        } else { showSuccess(emailInput); }

        const subjectInput = document.getElementById('subject');
        if (!subjectInput.value) {
            showError(subjectInput);
            isValid = false;
            errorMessages.push("Please select a subject.");
        } else { showSuccess(subjectInput); }

        const messageInput = document.getElementById('message');
        if (!messageInput.value.trim()) {
            showError(messageInput);
            isValid = false;
            errorMessages.push("Please enter a message.");
        } else { showSuccess(messageInput); }

        // 6. AGE VALIDATION (18 - 60)
        const dobInput = document.getElementById('dob');
        const dobValue = dobInput.value;
        if (!dobValue) {
            showError(dobInput);
            isValid = false;
            errorMessages.push("Please enter your Date of Birth.");
        } else {
            const dob = new Date(dobValue);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
            }

            if (age < 18 || age > 60) {
                showError(dobInput);
                isValid = false;
                errorMessages.push("You must be between 18 and 60 years old to book an appointment.");
            } else {
                showSuccess(dobInput);
            }
        }

        if (!isValid) {
            alert("Validation Error:\n" + errorMessages.join("\n"));
        }

        return isValid;
    }

    function showError(input) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }

    function showSuccess(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }

    function clearValidationErrors() {
        const inputs = form.querySelectorAll('.form-control, .form-select, .form-check-input');
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
            input.classList.remove('is-valid');
        });

        // Reset custom containers if any
        const customContainers = form.querySelectorAll('.border-danger');
        customContainers.forEach(el => el.classList.remove('border', 'border-danger'));

        const customErrors = form.querySelectorAll('.invalid-feedback');
        customErrors.forEach(el => {
            if (el.id === 'daysError') el.style.display = 'none';
        });
    }

    function saveDataAndRedirect() {
        const formData = {
            name: document.getElementById('name').value,
            dob: document.getElementById('dob').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            preferredDays: Array.from(document.querySelectorAll('input[name="days"]:checked')).map(cb => cb.value),
            submittedAt: new Date().toLocaleString()
        };

        // Store in localStorage
        localStorage.setItem('appointmentData', JSON.stringify(formData));

        // Redirect to card page
        window.location.href = 'appointment-card.html';
    }
});
