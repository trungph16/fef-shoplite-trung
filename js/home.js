let allProducts = [];
let currentDisplayList = []; 
let currentPage = 1;
let itemsPerPage = window.innerWidth <= 992 ? 6 : 8; 

// 1. OBJECT LƯU TRẠNG THÁI BỘ LỌC TOÀN CỤC
let filters = {
    search: '',
    category: 'all',
    sort: 'default'
};

// 2. BIẾN LƯU TRỮ TIMEOUT CHO DEBOUNCE TÌM KIẾM
let searchTimeout = null;

window.addEventListener('resize', () => {
    const newItemsPerPage = window.innerWidth <= 992 ? 6 : 8;
    if (newItemsPerPage !== itemsPerPage) {
        itemsPerPage = newItemsPerPage;
        currentPage = 1; 
        renderProductPage();
    }
});

async function loadProducts() {
    const container = document.getElementById('products-container');
    try {
        showProductSkeletons(container, itemsPerPage); 
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) throw new Error(`Network error: ${res.status}`);
        
        allProducts = await res.json();
        
        // Cập nhật và render lần đầu
        applyFilters(); 
    } catch (error) {
        console.error('Error fetching products:', error);
        container.innerHTML = `<p style="color: #e74c3c; text-align: center; width: 100%;">Lỗi kết nối máy chủ.</p>`;
    }
}

async function loadCategories() {
    const categoryContainer = document.getElementById('category-filter');
    try {
        const res = await fetch('https://fakestoreapi.com/products/categories');
        if (!res.ok) throw new Error(`Network error`);
        const categories = await res.json();
        
        categoryContainer.innerHTML = '';

        // Nút Tất cả
        const allBtn = document.createElement('button');
        allBtn.className = 'category-btn active';
        allBtn.textContent = 'All Products';
        allBtn.addEventListener('click', () => {
            setActiveButton(allBtn);
            filters.category = 'all'; // Cập nhật object thay vì lọc trực tiếp
            applyFilters();
        });
        categoryContainer.appendChild(allBtn);

        // Các nút danh mục khác
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            btn.addEventListener('click', () => {
                setActiveButton(btn);
                filters.category = category; // Cập nhật object
                applyFilters();
            });
            categoryContainer.appendChild(btn);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function setActiveButton(activeBtn) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// ------------------------------------------------------------------
// HÀM XỬ LÝ LỌC ĐA ĐIỀU KIỆN (TRẠM TRUNG CHUYỂN)
// ------------------------------------------------------------------
function applyFilters() {
    // Bắt đầu với mảng dữ liệu gốc
    let result = [...allProducts];

    // Lọc màng 1: Theo danh mục (Category)
    if (filters.category !== 'all') {
        result = result.filter(product => product.category === filters.category);
    }

    // Lọc màng 2: Theo từ khóa tìm kiếm (Search - không phân biệt hoa thường)
    if (filters.search.trim() !== '') {
        const keyword = filters.search.toLowerCase();
        result = result.filter(product => product.title.toLowerCase().includes(keyword));
    }

    // Lọc màng 3: Sắp xếp theo giá (Sort)
    if (filters.sort === 'asc') {
        result.sort((a, b) => a.price - b.price); // Giá: Thấp -> Cao
    } else if (filters.sort === 'desc') {
        result.sort((a, b) => b.price - a.price); // Giá: Cao -> Thấp
    }

    // Sau khi lọc xong, gán vào mảng hiển thị và ép quay về trang 1
    currentDisplayList = result;
    currentPage = 1;
    renderProductPage();
}

// ------------------------------------------------------------------
// LẮNG NGHE SỰ KIỆN TÌM KIẾM (DEBOUNCE) & SẮP XẾP
// ------------------------------------------------------------------
function initAdvancedFilters() {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            // Xóa bộ đếm cũ nếu người dùng vẫn đang gõ liên tục
            clearTimeout(searchTimeout);
            
            // Thiết lập bộ đếm mới (sau 500ms không gõ nữa thì mới chạy lọc)
            searchTimeout = setTimeout(() => {
                filters.search = e.target.value;
                applyFilters();
            }, 500);
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            filters.sort = e.target.value;
            applyFilters();
        });
    }
}

// ------------------------------------------------------------------
// RENDER GIAO DIỆN & PHÂN TRANG (Giữ nguyên như bản chuẩn cũ)
// ------------------------------------------------------------------
function renderProductPage() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    if (currentDisplayList.length === 0) {
        container.innerHTML = '<p style="text-align:center; width:100%; padding:2rem; color: #7f8c8d;">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>';
        updatePaginationUI(0);
        return;
    }

    const totalPages = Math.ceil(currentDisplayList.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToRender = currentDisplayList.slice(startIndex, endIndex);

    productsToRender.forEach(product => {
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
            e.stopPropagation();
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

    updatePaginationUI(totalPages);
}

function updatePaginationUI(totalPages) {
    const container = document.getElementById('products-container');
    let paginationContainer = document.getElementById('pagination-container');

    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination-container';
        paginationContainer.className = 'pagination-container';
        container.parentNode.insertBefore(paginationContainer, container.nextSibling);
    }

    paginationContainer.innerHTML = '';

    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';

    const btnBack = document.createElement('button');
    btnBack.className = 'btn-page';
    btnBack.textContent = 'Back';
    btnBack.disabled = currentPage === 1; 
    btnBack.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProductPage();
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        }
    });

    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    pageInfo.textContent = `Trang ${currentPage} / ${totalPages}`;

    const btnNext = document.createElement('button');
    btnNext.className = 'btn-page';
    btnNext.textContent = 'Next';
    btnNext.disabled = currentPage === totalPages; 
    btnNext.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProductPage();
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        }
    });

    paginationContainer.appendChild(btnBack);
    paginationContainer.appendChild(pageInfo);
    paginationContainer.appendChild(btnNext);
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
    showToast(`Đã thêm "${product.title}" vào giỏ hàng!`, 'success');
}

// Khởi chạy
document.addEventListener('DOMContentLoaded', async () => {
    initAdvancedFilters(); // Kích hoạt sự kiện nghe ngóng ô tìm kiếm & dropdown sắp xếp
    await loadCategories();
    await loadProducts();
});