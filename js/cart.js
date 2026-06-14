function renderCart() {
    const cart = getCart();
    const tableBody = document.getElementById('cart-items');
    tableBody.innerHTML = '';

    if (cart.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Giỏ hàng trống</td></tr>';
        calculateTotal();
        return;
    }

    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index; // Gắn index vào row để biết đang thao tác với sản phẩm nào
        row.innerHTML = `
            <td>
                <img src="${item.image}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: contain;">
                <div style="margin-top: 0.5rem;">${item.title}</div>
            </td>
            <td>${formatMoney(item.price)}</td>
            <td>
                <button class="btn-qty btn-decrease" data-action="decrease">−</button>
                <span style="margin: 0 1rem;">${item.quantity}</span>
                <button class="btn-qty btn-increase" data-action="increase">+</button>
            </td>
            <td>${formatMoney(item.price * item.quantity)}</td>
            <td>
                <button class="btn-delete" data-action="delete">Xóa</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    calculateTotal();
}

// Kỹ thuật Event Delegation (Xử lý mọi click trong giỏ hàng)
function handleCartAction(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const row = button.closest('tr');
    if (!row) return;

    const index = parseInt(row.dataset.index, 10);
    const action = button.dataset.action;

    if (action === 'increase') {
        increaseQuantity(index);
    } else if (action === 'decrease') {
        decreaseQuantity(index);
    } else if (action === 'delete') {
        removeItem(index);
    }
}

function increaseQuantity(index) {
    const cart = getCart();
    if (cart[index]) {
        cart[index].quantity += 1;
        saveCart(cart);
        renderCart();
    }
}

function decreaseQuantity(index) {
    const cart = getCart();
    if (cart[index] && cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        saveCart(cart);
        renderCart();
    }
}

function removeItem(index) {
    const cart = getCart();
    const removedItemName = cart[index].title; 

    showConfirmModal(`Bạn có chắc chắn muốn xóa "${removedItemName}" khỏi giỏ hàng?`, () => {
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
        
        showToast(`Đã xóa ${removedItemName} khỏi giỏ hàng!`, 'info');  
    });
}

function calculateTotal() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        totalElement.textContent = formatMoney(total);
    }
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast(`Giỏ hàng trống!`, 'info');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    showToast(`Thanh toán thành công ${formatMoney(total)}. Cảm ơn bạn đã mua sắm!`, 'success');
    
    saveCart([]);
    
    renderCart();
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        // Gắn 1 listener duy nhất cho toàn bộ danh sách giỏ hàng
        cartItems.addEventListener('click', handleCartAction);
    }
});