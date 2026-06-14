// Lấy dữ liệu giỏ hàng từ localStorage
function getCart() {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
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


function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge(); 
}

function updateCartBadge() {
    const cart = getCart();
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', updateCartBadge);

window.addEventListener('storage', function(event) {
    if (event.key === 'cart') {
        updateCartBadge();
  
        if (typeof renderCart === 'function') {
            renderCart();
        }
    }
});