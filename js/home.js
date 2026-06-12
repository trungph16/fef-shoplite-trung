async function loadProducts() {
    try {
        const res = await fetch('https://fakestoreapi.com/products');

        if (!res.ok) {
            throw new Error(`Network error: ${res.status} ${res.statusText}`);
        }

        const products = await res.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        const container = document.getElementById('products-container');
        container.innerHTML = '<p>Lỗi khi tải sản phẩm. Vui lòng thử lại.</p>';
    }
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        const productLink = document.createElement('a');
        productLink.href = `product.html?id=${product.id}`;
        productLink.className = 'product-link';
        productLink.style.textDecoration = 'none';
        productLink.style.color = 'inherit';

        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="btn-add-cart">Add to Cart</button>
        `;

        productLink.appendChild(productCard);
        container.appendChild(productLink);
    }
}

document.addEventListener('DOMContentLoaded', loadProducts);
