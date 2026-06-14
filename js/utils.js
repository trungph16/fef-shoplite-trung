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

function showProductSkeletons(container, count = 8) {
    if (!container) return;
    let skeletonHTML = '';
    for (let i = 0; i < count; i++) {
        skeletonHTML += `
            <div class="skeleton-card">
                <div class="skeleton skeleton-img"></div>
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-price"></div>
                <div class="skeleton skeleton-btn"></div>
            </div>
        `;
    }
    container.innerHTML = skeletonHTML;
}

function showDetailSkeleton(container) {
    if (!container) return;
    container.innerHTML = `
        <div class="product-detail-content" style="width: 100%;">
            <div class="product-detail-image">
                <div class="skeleton" style="width: 100%; height: 350px; border-radius: 8px;"></div>
            </div>
            <div class="product-detail-info" style="width: 100%;">
                <div class="skeleton" style="height: 32px; width: 90%; margin-bottom: 0.5rem;"></div>
                <div class="skeleton" style="height: 18px; width: 40%; margin-bottom: 0.5rem;"></div>
                <div class="skeleton" style="height: 24px; width: 30%; margin-bottom: 1rem;"></div>
                <div class="skeleton" style="height: 60px; width: 100%; margin-bottom: 1rem;"></div>
                <div class="skeleton" style="height: 45px; width: 100%; border-radius: 4px;"></div>
            </div>
        </div>
    `;
}

function showToast(message, type = 'success') {
    // Tự động tìm hoặc tạo vùng chứa container nếu chưa tồn tại trên DOM
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // Tạo phần tử toast mới
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Trượt thông báo vào sau một nhịp hiển thị của trình duyệt
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    // Tự động dọn dẹp biến mất sau 3 giây
    setTimeout(() => {
        toast.classList.remove('show');
        // Đợi hiệu ứng trượt ẩn kết thúc (400ms) rồi xóa hẳn khỏi DOM để tránh rác mã nguồn
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3000);
}


// Hàm hiển thị Bảng xác nhận tùy chỉnh (Custom Confirm Modal)
function showConfirmModal(message, onConfirmCallback) {
    // 1. Tạo lớp phủ (overlay)
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    // 2. Tạo nội dung hộp thoại (content)
    const content = document.createElement('div');
    content.className = 'modal-content';

    // 3. Đoạn text hỏi người dùng
    const text = document.createElement('div');
    text.className = 'modal-title';
    text.textContent = message;

    // 4. Khu vực chứa nút bấm
    const actions = document.createElement('div');
    actions.className = 'modal-actions';

    // Nút Hủy (Không)
    const btnCancel = document.createElement('button');
    btnCancel.className = 'btn-modal-cancel';
    btnCancel.textContent = 'Không';
    
    // Nút Đồng ý
    const btnConfirm = document.createElement('button');
    btnConfirm.className = 'btn-modal-confirm';
    btnConfirm.textContent = 'Đồng ý';

    // Ráp các phần tử lại với nhau
    actions.appendChild(btnCancel);
    actions.appendChild(btnConfirm);
    content.appendChild(text);
    content.appendChild(actions);
    overlay.appendChild(content);
    
    // Chèn vào giao diện
    document.body.appendChild(overlay);

    // Kích hoạt hiệu ứng hiện ra (cần một chút delay nhỏ để CSS transition chạy)
    setTimeout(() => overlay.classList.add('active'), 10);

    // Hàm đóng Modal
    const closeModal = () => {
        overlay.classList.remove('active');
        // Chờ hiệu ứng mờ đi xong rồi mới xóa hẳn khỏi DOM
        setTimeout(() => overlay.remove(), 300);
    };

    // Bắt sự kiện click
    btnCancel.addEventListener('click', closeModal);
    
    btnConfirm.addEventListener('click', () => {
        closeModal(); // Đóng bảng xác nhận
        if (onConfirmCallback) {
            onConfirmCallback(); // Thực thi hành động xóa
        }
    });
}