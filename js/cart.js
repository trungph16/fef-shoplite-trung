function getCart() {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

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
        row.innerHTML = `
            <td>
                <img src="${item.image}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: contain;">
                <div style="margin-top: 0.5rem;">${item.title}</div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <button class="btn-qty" onclick="decreaseQuantity(${index})">−</button>
                <span style="margin: 0 1rem;">${item.quantity}</span>
                <button class="btn-qty" onclick="increaseQuantity(${index})">+</button>
            </td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td>
                <button class="btn-delete" onclick="removeItem(${index})">Xóa</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    calculateTotal();
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
    if (confirm(`Bạn có chắc muốn xóa ${cart[index].title}?`)) {
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
    }
}

function calculateTotal() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalElement = document.getElementById('cart-total');
    totalElement.textContent = `$${total.toFixed(2)}`;
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }
    alert(`Tổng tiền: $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}. Cảm ơn bạn đã mua sắm!`);
}

document.addEventListener('DOMContentLoaded', renderCart);
