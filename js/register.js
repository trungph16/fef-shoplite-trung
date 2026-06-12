const registerForm = document.querySelector('form');

registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    clearAllErrors();
    let isValid = true;

    // Validate username
    if (username === '') {
        showError('username', 'Username không được để trống.');
        isValid = false;
    } else if (username.length < 3) {
        showError('username', 'Username phải có ít nhất 3 ký tự.');
        isValid = false;
    }

    // Validate email
    if (email === '') {
        showError('email', 'Email không được để trống.');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Email không hợp lệ (phải chứa @ và dấu chấm).');
        isValid = false;
    }

    // Validate password
    if (password === '') {
        showError('password', 'Mật khẩu không được để trống.');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'Mật khẩu phải có ít nhất 6 ký tự.');
        isValid = false;
    }

    // Validate confirm password
    if (confirmPassword === '') {
        showError('confirm-password', 'Xác nhận mật khẩu không được để trống.');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirm-password', 'Mật khẩu xác nhận không khớp.');
        isValid = false;
    }

    if (isValid) {
        alert('Đăng ký thành công!');
        registerForm.reset();
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(inputId, message) {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.createElement('p');
    errorElement.className = 'error-message';
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '5px';
    errorElement.textContent = message;

    inputElement.parentNode.appendChild(errorElement);
}

function clearAllErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach((msg) => msg.remove());
}
