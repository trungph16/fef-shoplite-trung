async function loadProductDetail() {
    const container = document.getElementById('product-detail-container');

    try {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');

        if (!productId) throw new Error('Product ID not found in URL');

        showDetailSkeleton(container);

        const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
        if (!res.ok) throw new Error(`Network error: ${res.status}`);

        const product = await res.json();
        displayProductDetail(product);
    } catch (error) {
        console.error('Error fetching product detail:', error);
        container.innerHTML = `<p style="color: #e74c3c; text-align: center; padding: 2rem;">Lỗi kết nối máy chủ, vui lòng thử lại sau.</p>`;
    }
}

function displayProductDetail(product) {
    const container = document.getElementById('product-detail-container');

    container.innerHTML = `
        <div class="product-detail-content">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-detail-info">
                <h2>${product.title}</h2>
                <p class="product-category">Danh mục: ${product.category}</p>
                <p class="product-price">Giá: <strong>${formatMoney(product.price)}</strong></p>
                <div class="product-rating">
                    <p>Đánh giá: ${product.rating ? product.rating.rate + '/5 (' + product.rating.count + ' reviews)' : 'N/A'}</p>
                </div>
                <div class="product-description">
                    <h3>Mô tả chi tiết:</h3>
                    <p>${product.description}</p>
                </div>
                <button class="btn-add-cart" data-product-id="${product.id}">Thêm vào giỏ hàng</button>
                <a href="index.html"><button class="btn-back">Quay lại</button></a>
            </div>
        </div>
    `;

    const addCartBtn = container.querySelector('.btn-add-cart');
    addCartBtn.addEventListener('click', () => addToCart(product));
}

function addToCart(product) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);
    showToast(`Đã thêm sản phẩm vào giỏ hàng!`, 'success');
}

document.addEventListener('DOMContentLoaded', loadProductDetail);