async function loadProductDetail() {
    try {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');

        if (!productId) {
            throw new Error('Product ID not found in URL');
        }

        const res = await fetch(`https://fakestoreapi.com/products/${productId}`);

        if (!res.ok) {
            throw new Error(`Network error: ${res.status} ${res.statusText}`);
        }

        const product = await res.json();
        displayProductDetail(product);
    } catch (error) {
        console.error('Error fetching product detail:', error);
        const container = document.getElementById('product-detail-container');
        container.innerHTML = '<p>Lỗi khi tải chi tiết sản phẩm. Vui lòng thử lại.</p>';
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
                <p class="product-price">Giá: <strong>$${product.price.toFixed(2)}</strong></p>
                <div class="product-rating">
                    <p>Đánh giá: ${product.rating ? product.rating.rate + '/5 (' + product.rating.count + ' reviews)' : 'N/A'}</p>
                </div>
                <div class="product-description">
                    <h3>Mô tả chi tiết:</h3>
                    <p>${product.description}</p>
                </div>
                <button class="btn-add-cart">Thêm vào giỏ hàng</button>
                <a href="index.html"><button class="btn-back">Quay lại</button></a>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', loadProductDetail);
