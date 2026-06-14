// Lấy dữ liệu giỏ hàng từ localStorage
function getCart() {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
}

// Lưu dữ liệu giỏ hàng xuống localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Định dạng tiền tệ
function formatMoney(amount) {
    return `$${amount.toFixed(2)}`;
}

// Hiển thị lỗi API
function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.style.color = '#e74c3c';
        element.style.display = 'block';
    }
}

// Hiển thị trạng thái Loading
function showLoading(element, message = 'Đang tải dữ liệu...') {
    if (element) {
        element.textContent = message;
        element.style.color = '#2c3e50';
        element.style.display = 'block';
    }
}

// Ẩn trạng thái Loading
function hideLoading(element) {
    if (element) {
        element.style.display = 'none';
    }
}