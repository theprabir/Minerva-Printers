// ========== TYPING ANIMATION FOR SEARCH BAR ==========
const searchPlaceholders = [
    "Search for wedding invitations...",
    "Search for business cards...",
    "Search for banners...",
    "Search for calendars...",
    "Search for ID cards...",
    "Search for invitation cards...",
    "Search for election materials...",
    "Search for certificates..."
];

let placeholderIndex = 0;
let charIndex = 0;
let isDeleting = false;
const searchInput = document.getElementById('globalSearch');

function typeAnimation() {
    const currentText = searchPlaceholders[placeholderIndex];
    
    if (isDeleting) {
        searchInput.placeholder = currentText.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            placeholderIndex = (placeholderIndex + 1) % searchPlaceholders.length;
        }
    } else {
        searchInput.placeholder = currentText.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(() => {}, 1500);
        }
    }
    
    setTimeout(typeAnimation, isDeleting ? 100 : 150);
}

typeAnimation();

// ========== GLOBAL VARIABLES ==========
let products = [];
let currentCategory = 'all';
let currentSearch = '';
let currentSort = '';
let currentProduct = null;
let selectedVariantIndex = 0;
let quantity = 1;

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const sortOrderSelect = document.getElementById('sortOrder');
const categoryList = document.getElementById('categoryList');
const modal = document.getElementById('productModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

// ========== LOAD PRODUCTS FROM JSON ==========
async function loadProducts() {
    productsGrid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading products...</div>';
    
    try {
        const response = await fetch('products.json?' + Date.now());
        if (!response.ok) throw new Error('Failed to load products');
        const data = await response.json();
        products = data.products || [];
        init();
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = '<div class="no-products"><i class="fas fa-exclamation-triangle"></i> Failed to load products. Please try again later.</div>';
    }
}

// ========== EXTRACT UNIQUE CATEGORIES ==========
function getUniqueCategories() {
    return ['all', ...new Set(products.map(p => p.category))];
}

// ========== RENDER CATEGORY BUTTONS ==========
function renderCategoryButtons() {
    const categories = getUniqueCategories();
    categoryList.innerHTML = categories.map(category => `
        <button data-category="${category}" class="${currentCategory === category ? 'active' : ''}">
            ${category === 'all' ? '<i class="fas fa-th-large"></i> All Products' : `<i class="fas fa-tag"></i> ${category}`}
        </button>
    `).join('');

    document.querySelectorAll('.category-list button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-list button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            filterAndDisplayProducts();
        });
    });
}

// ========== FILTER AND DISPLAY PRODUCTS ==========
function filterAndDisplayProducts() {
    let filtered = [...products];

    if (currentSearch) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
            p.category.toLowerCase().includes(currentSearch.toLowerCase())
        );
    }
    
    if (currentSearch === '') {
        if (currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category === currentCategory);
        }
    }

    if (currentSort === 'lowest') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'highest') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderProducts(filtered);
}

// ========== RENDER PRODUCTS GRID ==========
function renderProducts(productsToRender) {
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                No products found for "${currentSearch}"
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = productsToRender.map((product, index) => `
        <div class="product-card" data-product-id="${product.id || index}">
            <div class="product-image">
                <img src="${product.images && product.images[0] ? product.images[0] : product.imageURL}" alt="${product.name}" onerror="this.src='https://placehold.co/400x400/1a0b2e/8b5cf6?text=No+Image'">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
                <div class="product-price">₹${product.price}/pc</div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.productId;
            const product = products.find(p => (p.id || p.name) === productId);
            openProductModal(product);
        });
    });
}

// ========== CALCULATE TOTAL PRICE ==========
function calculateTotal() {
    const productPrice = currentProduct.price * quantity;
    const printingCost = (currentProduct.printingCost || 0) * quantity;
    const packagingCost = (currentProduct.packagingCost || 0) * quantity;
    const subtotal = productPrice + printingCost + packagingCost;
    const gstAmount = (subtotal * (currentProduct.gst || 18)) / 100;
    const total = subtotal + gstAmount;
    
    return { productPrice, printingCost, packagingCost, subtotal, gstAmount, total };
}

// ========== CHECK IF PRODUCT HAS VARIANTS ==========
function hasVariants() {
    return currentProduct.variants && currentProduct.variants.length > 0;
}

// ========== GET CURRENT DISPLAY IMAGE ==========
function getCurrentDisplayImage() {
    if (hasVariants() && currentProduct.variants[selectedVariantIndex]?.imageURL) {
        return currentProduct.variants[selectedVariantIndex].imageURL;
    }
    if (currentProduct.images && currentProduct.images.length > 0) {
        return currentProduct.images[0];
    }
    return currentProduct.imageURL;
}

// ========== GET ALL IMAGES FOR GALLERY ==========
function getAllGalleryImages() {
    let images = [];
    if (hasVariants() && currentProduct.variants[selectedVariantIndex]?.imageURL) {
        images.push(currentProduct.variants[selectedVariantIndex].imageURL);
    }
    if (currentProduct.images && currentProduct.images.length > 0) {
        images = [...images, ...currentProduct.images];
    } else if (currentProduct.imageURL) {
        images.push(currentProduct.imageURL);
    }
    return [...new Set(images)];
}

// ========== OPEN PRODUCT MODAL ==========
function openProductModal(product) {
    currentProduct = product;
    quantity = 1;
    selectedVariantIndex = 0;
    renderModalContent();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ========== RENDER MODAL CONTENT ==========
function renderModalContent() {
    const totals = calculateTotal();
    const displayImage = getCurrentDisplayImage();
    const galleryImages = getAllGalleryImages();
    const hasProductVariants = hasVariants();
    
    modalBody.innerHTML = `
        <div class="modal-image">
            <div class="product-gallery">
                <div class="main-image" onclick="openFullscreenImage('${displayImage}')">
                    <img src="${displayImage}" alt="${currentProduct.name}" id="modalProductImage">
                </div>
                ${galleryImages.length > 1 ? `
                <div class="thumbnail-list" id="thumbnailList">
                    ${galleryImages.map((img, idx) => `
                        <div class="thumbnail ${idx === 0 ? 'active' : ''}" data-img="${img}">
                            <img src="${img}" alt="Thumbnail ${idx + 1}">
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        </div>
        <div class="modal-info">
            <h2>${currentProduct.name}</h2>
            <span class="modal-category">${currentProduct.category}</span>
            <p style="color: #94a3b8; margin: 0.5rem 0; line-height: 1.6;">${currentProduct.description || 'Premium quality product with excellent finish and durability. Perfect for your printing needs.'}</p>
            
            ${hasProductVariants ? `
            <div class="variant-selector">
                <h3>🎨 Select Variant</h3>
                <div class="variant-buttons" id="variantButtons">
                    ${currentProduct.variants.map((variant, idx) => `
                        <button class="variant-btn ${idx === selectedVariantIndex ? 'active' : ''}" data-variant-index="${idx}">
                            ${variant.color}
                        </button>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="price-breakdown">
                <h3>💰 Price Breakdown</h3>
                <div class="price-row">
                    <span>Product Price (${quantity} pc${quantity > 1 ? 's' : ''})</span>
                    <span>₹${totals.productPrice.toFixed(2)}</span>
                </div>
                <div class="price-row">
                    <span>Printing Cost</span>
                    <span>₹${totals.printingCost.toFixed(2)}</span>
                </div>
                <div class="price-row">
                    <span>Packaging Cost</span>
                    <span>₹${totals.packagingCost.toFixed(2)}</span>
                </div>
                <div class="price-row">
                    <span>Subtotal</span>
                    <span>₹${totals.subtotal.toFixed(2)}</span>
                </div>
                <div class="price-row">
                    <span>GST (${currentProduct.gst || 18}%)</span>
                    <span>₹${totals.gstAmount.toFixed(2)}</span>
                </div>
                <div class="price-row total">
                    <span>Total Amount</span>
                    <span>₹${totals.total.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="quantity-selector">
                <label>📦 Quantity:</label>
                <div class="quantity-control">
                    <button class="qty-btn" id="qtyMinus">-</button>
                    <input type="number" class="qty-input" id="qtyInput" value="${quantity}" min="1" max="1000">
                    <button class="qty-btn" id="qtyPlus">+</button>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn-enquire" id="enquireBtn">
                    <i class="fas fa-envelope"></i> Send Enquiry
                </button>
                <button class="btn-whatsapp" id="whatsappBtn">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
            </div>
        </div>
    `;
    
    // Thumbnail click handlers
    if (galleryImages.length > 1) {
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                const imgUrl = thumb.dataset.img;
                document.getElementById('modalProductImage').src = imgUrl;
            });
        });
    }
    
    // Variant click handlers
    if (hasProductVariants) {
        document.querySelectorAll('.variant-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedVariantIndex = parseInt(btn.dataset.variantIndex);
                const variant = currentProduct.variants[selectedVariantIndex];
                if (variant.price) currentProduct.price = variant.price;
                renderModalContent();
            });
        });
    }
    
    // Quantity handlers
    const qtyInput = document.getElementById('qtyInput');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    
    if (qtyMinus) {
        qtyMinus.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                qtyInput.value = quantity;
                renderModalContent();
            }
        });
    }
    
    if (qtyPlus) {
        qtyPlus.addEventListener('click', () => {
            if (quantity < 1000) {
                quantity++;
                qtyInput.value = quantity;
                renderModalContent();
            }
        });
    }
    
    if (qtyInput) {
        qtyInput.addEventListener('change', (e) => {
            let val = parseInt(e.target.value);
            if (isNaN(val) || val < 1) val = 1;
            if (val > 1000) val = 1000;
            quantity = val;
            qtyInput.value = quantity;
            renderModalContent();
        });
    }
    
    // Enquiry button
    document.getElementById('enquireBtn')?.addEventListener('click', () => {
        const totals = calculateTotal();
        const variantText = hasProductVariants ? `\nColor: ${currentProduct.variants[selectedVariantIndex].color}` : '';
        const message = `Hello Minerva Printers,%0A%0AI'm interested in:%0AProduct: ${currentProduct.name}${variantText}%0AQuantity: ${quantity} pc(s)%0ATotal Price: ₹${totals.total.toFixed(2)}%0A%0APlease share more details and availability.`;
        window.location.href = `mailto:minervaprinters2000@gmail.com?subject=Enquiry for ${currentProduct.name}&body=${encodeURIComponent(message)}`;
    });
    
    // WhatsApp button
    document.getElementById('whatsappBtn')?.addEventListener('click', () => {
        const totals = calculateTotal();
        const variantText = hasProductVariants ? `%0A🎨 Color: ${currentProduct.variants[selectedVariantIndex].color}` : '';
        const currentDomain = window.location.origin;
        const productImagePath = getCurrentDisplayImage();
        let cleanImagePath = productImagePath;
        if (cleanImagePath.startsWith('./')) cleanImagePath = cleanImagePath.substring(2);
        if (cleanImagePath.startsWith('../')) cleanImagePath = cleanImagePath.replace(/\.\.\//g, '');
        const fullImageURL = `${currentDomain}/${cleanImagePath}`;
        
        const message = `Hii Minerva Printers!%0A%0A📸 *Product Image:*%0A${fullImageURL}%0A%0A📋 *Product Details:*%0A━━━━━━━━━━━━━━━━%0A• Product Name: ${currentProduct.name}${variantText}%0A• Quantity: ${quantity} piece(s)%0A• Unit Price: ₹${currentProduct.price} per piece%0A━━━━━━━━━━━━━━━━%0A💰 *Total Amount: ₹${totals.total.toFixed(2)}*%0A━━━━━━━━━━━━━━━━%0A%0APlease confirm availability and delivery timeline. Thank you!`;
        
        window.open(`https://wa.me/919937311044?text=${message}`, '_blank');
    });
}

// ========== FULLSCREEN IMAGE VIEWER ==========
function openFullscreenImage(imageUrl) {
    const viewer = document.createElement('div');
    viewer.className = 'image-viewer';
    viewer.innerHTML = `
        <div class="image-viewer-close">&times;</div>
        <img src="${imageUrl}" alt="Fullscreen view">
    `;
    document.body.appendChild(viewer);
    viewer.classList.add('active');
    
    viewer.addEventListener('click', () => {
        viewer.remove();
    });
}

// ========== CLOSE MODAL ==========
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ========== EVENT LISTENERS ==========
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

globalSearch.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    filterAndDisplayProducts();
});

sortOrderSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    filterAndDisplayProducts();
});

// ========== INITIALIZE ==========
function init() {
    renderCategoryButtons();
    filterAndDisplayProducts();
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Start loading products
loadProducts();
