let allProducts = [];

async function loadProducts() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const container = document.getElementById('products-container');

    try {
        showLoading(loadingIndicator);
        container.innerHTML = '';

        const res = await fetch('https://fakestoreapi.com/products');

        if (!res.ok) {
            throw new Error(`Network error: ${res.status} ${res.statusText}`);
        }

        const products = await res.json();
        allProducts = products;
        displayProducts(products);
        hideLoading(loadingIndicator);
    } catch (error) {
        console.error('Error fetching products:', error);
        showError(loadingIndicator, 'Lỗi kết nối máy chủ, vui lòng thử lại sau.');
    }
}

async function loadCategories() {
    const categoryContainer = document.getElementById('category-filter');
    const loadingIndicator = document.getElementById('loading-indicator');

    try {
        showLoading(loadingIndicator);

        const res = await fetch('https://fakestoreapi.com/products/categories');

        if (!res.ok) {
            throw new Error(`Network error: ${res.status}`);
        }

        const categories = await res.json();
        categoryContainer.innerHTML = '';

        const allBtn = document.createElement('button');
        allBtn.className = 'category-btn active';
        allBtn.textContent = 'All Products';

        allBtn.addEventListener('click', () => {
            setActiveButton(allBtn);
            displayProducts(allProducts);
        });

        categoryContainer.appendChild(allBtn);

        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);

            btn.addEventListener('click', () => {
                filterByCategory(category);
                setActiveButton(btn);
            });

            categoryContainer.appendChild(btn);
        });

        hideLoading(loadingIndicator);

    } catch (error) {
        console.error('Error loading categories:', error);
        showError(loadingIndicator, 'Lỗi kết nối máy chủ, vui lòng thử lại sau.');
    }
}

function filterByCategory(category) {
    const filtered = allProducts.filter(product => product.category === category);
    displayProducts(filtered);
}

function setActiveButton(activeBtn) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    products.forEach(product => {
        const productLink = document.createElement('a');
        productLink.href = `product.html?id=${product.id}`;
        productLink.className = 'product-link';

        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.title;
        img.className = 'product-image';

        const title = document.createElement('h3');
        title.className = 'product-title';
        title.textContent = product.title;

        const category = document.createElement('p');
        category.className = 'product-category';
        category.textContent = product.category;

        const price = document.createElement('p');
        price.className = 'product-price';
        price.textContent = formatMoney(product.price);

        const addBtn = document.createElement('button');
        addBtn.className = 'btn-add-cart';
        addBtn.textContent = 'Add to Cart';
        addBtn.type = 'button';
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Ngăn chặn việc click nút thêm vào giỏ lại bị chuyển sang trang chi tiết
            addToCart(product);
        });

        productCard.appendChild(img);
        productCard.appendChild(title);
        productCard.appendChild(category);
        productCard.appendChild(price);
        productCard.appendChild(addBtn);

        productLink.appendChild(productCard);
        container.appendChild(productLink);
    });
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
    alert(`${product.title} đã được thêm vào giỏ hàng!`);
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    await loadProducts();
});