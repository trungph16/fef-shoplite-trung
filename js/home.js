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

    products.forEach(product => {
        // Tạo link sản phẩm
        const productLink = document.createElement('a');
        productLink.href = `product.html?id=${product.id}`;
        productLink.className = 'product-link';

        // Tạo card sản phẩm
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        // Tạo image
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.title;
        img.className = 'product-image';

        // Tạo title
        const title = document.createElement('h3');
        title.className = 'product-title';
        title.textContent = product.title;

        // Tạo category
        const category = document.createElement('p');
        category.className = 'product-category';
        category.textContent = product.category;

        // Tạo price
        const price = document.createElement('p');
        price.className = 'product-price';
        price.textContent = `$${product.price.toFixed(2)}`;

        // Tạo button Add to Cart
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-add-cart';
        addBtn.textContent = 'Add to Cart';
        addBtn.type = 'button';
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product);
        });

        // Ghép các phần tử vào card
        productCard.appendChild(img);
        productCard.appendChild(title);
        productCard.appendChild(category);
        productCard.appendChild(price);
        productCard.appendChild(addBtn);

        // Ghép card vào link
        productLink.appendChild(productCard);

        // Ghép link vào container
        container.appendChild(productLink);
    });
}

function addToCart(product) {
    console.log('Thêm sản phẩm vào giỏ hàng:', product);
    alert(`${product.title} đã được thêm vào giỏ hàng!`);
    // TODO: Implement cart functionality
}

document.addEventListener('DOMContentLoaded', loadProducts);