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

    // ========== PRODUCTS DATABASE ==========
    // Each product appears individually in showcase
    // Add variants ONLY for products that have them (leave empty array for others)
    const products = [
        // Wedding Cards - Each product individual
        { 
            imageURL: "image/Wedding/A.png", 
            name: "Elegant Wedding Invitation - Gold", 
            category: "Wedding Card", 
            price: 20,
            printingCost: 8,
            packagingCost: 2,
            gst: 18,
            description: "Premium quality wedding invitation with elegant floral design and gold foil accents.",
            variants: []  // Empty = no color variants
        },
        { 
            imageURL: "image/Wedding/B.png", 
            name: "Elegant Wedding Invitation - Rose Gold", 
            category: "Wedding Card", 
            price: 22,
            printingCost: 8,
            packagingCost: 2,
            gst: 18,
            description: "Premium quality wedding invitation with elegant floral design and rose gold foil accents.",
            variants: []
        },
        { 
            imageURL: "image/Wedding/C.png", 
            name: "Royal Wedding Invitation - Red & Gold", 
            category: "Wedding Card", 
            price: 25,
            printingCost: 10,
            packagingCost: 3,
            gst: 18,
            description: "Royal themed wedding invitation with intricate patterns and premium paper.",
            variants: []
        },
        { 
            imageURL: "image/Wedding/D.png", 
            name: "Royal Wedding Invitation - Maroon & Gold", 
            category: "Wedding Card", 
            price: 28,
            printingCost: 10,
            packagingCost: 3,
            gst: 18,
            description: "Royal themed wedding invitation with intricate patterns and premium paper.",
            variants: []
        },
        { 
            imageURL: "image/Wedding/E.png", 
            name: "Classic Wedding Card - Cream", 
            category: "Wedding Card", 
            price: 20,
            printingCost: 7,
            packagingCost: 2,
            gst: 18,
            description: "Timeless classic wedding card design.",
            variants: []
        },
        
        // Business Cards - Each color appears as separate product
        { 
            imageURL: "image/visiting/1.jpg", 
            name: "Premium Business Card - White", 
            category: "Business Cards", 
            price: 1,
            printingCost: 0.5,
            packagingCost: 0.2,
            gst: 18,
            description: "High-quality business card with premium matte finish.",
            variants: []
        },
        { 
            imageURL: "image/visiting/2.jpg", 
            name: "Premium Business Card - Black", 
            category: "Business Cards", 
            price: 1.2,
            printingCost: 0.5,
            packagingCost: 0.2,
            gst: 18,
            description: "High-quality business card with premium matte finish.",
            variants: []
        },
        { 
            imageURL: "image/visiting/3.jpg", 
            name: "Premium Business Card - Blue", 
            category: "Business Cards", 
            price: 1.1,
            printingCost: 0.5,
            packagingCost: 0.2,
            gst: 18,
            description: "High-quality business card with premium matte finish.",
            variants: []
        },
        { 
            imageURL: "image/visiting/4.jpg", 
            name: "Standard Business Card - White", 
            category: "Business Cards", 
            price: 0.8,
            printingCost: 0.4,
            packagingCost: 0.15,
            gst: 18,
            description: "Standard business card for everyday professional use.",
            variants: []
        },
        { 
            imageURL: "image/visiting/5.jpg", 
            name: "Standard Business Card - Cream", 
            category: "Business Cards", 
            price: 0.9,
            printingCost: 0.4,
            packagingCost: 0.15,
            gst: 18,
            description: "Standard business card for everyday professional use.",
            variants: []
        },
        
        // Example: Product WITH color variants (rare case)
        // { 
        //     imageURL: "image/sample.jpg", 
        //     name: "Product With Variants", 
        //     category: "Others", 
        //     price: 50,
        //     printingCost: 10,
        //     packagingCost: 5,
        //     gst: 18,
        //     description: "This product has multiple color options.",
        //     variants: [
        //         { color: "Red", colorCode: "#FF0000", imageURL: "image/red.jpg" },
        //         { color: "Blue", colorCode: "#0000FF", imageURL: "image/blue.jpg" }
        //     ]
        // },
    ];

    // Helper function to check if product has variants
    function hasVariants(product) {
        return product.variants && product.variants.length > 0;
    }

    // Extract unique categories dynamically
    const categories = ['all', ...new Set(products.map(p => p.category))];

    // DOM Elements
    const productsGrid = document.getElementById('productsGrid');
    const globalSearch = document.getElementById('globalSearch');
    const sortOrderSelect = document.getElementById('sortOrder');
    const categoryList = document.getElementById('categoryList');
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');

    let currentCategory = 'all';
    let currentSearch = '';
    let currentSort = '';
    let currentProduct = null;
    let selectedVariant = null;
    let quantity = 1;

    // Render category buttons dynamically
    function renderCategoryButtons() {
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

    // GLOBAL SEARCH - searches ALL products
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

    // Render products to grid
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
            <div class="product-card" data-product-id="${index}">
                <div class="product-image">
                    <img src="${product.imageURL}" alt="${product.name}" onerror="this.src='https://placehold.co/400x400/1a0b2e/8b5cf6?text=No+Image'">
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3>${product.name}</h3>
                    <div class="product-price">₹${product.price}/pc</div>
                </div>
            </div>
        `).join('');

        // Add click event listeners to product cards
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const productId = parseInt(card.dataset.productId);
                openProductModal(products[productId]);
            });
        });
    }

    // Calculate total price
    function calculateTotal() {
        const productPrice = currentProduct.price * quantity;
        const printingCost = (currentProduct.printingCost || 0) * quantity;
        const packagingCost = (currentProduct.packagingCost || 0) * quantity;
        const subtotal = productPrice + printingCost + packagingCost;
        const gstAmount = (subtotal * (currentProduct.gst || 18)) / 100;
        const total = subtotal + gstAmount;
        
        return { productPrice, printingCost, packagingCost, subtotal, gstAmount, total };
    }

    // Open Product Modal
    function openProductModal(product) {
        currentProduct = product;
        quantity = 1;
        
        // If product has variants, select first variant
        if (hasVariants(product)) {
            selectedVariant = product.variants[0];
        } else {
            selectedVariant = null;
        }
        
        renderModalContent();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Render Modal Content
    function renderModalContent() {
        const hasProductVariants = hasVariants(currentProduct);
        const totals = calculateTotal();
        const displayImage = hasProductVariants ? selectedVariant.imageURL : currentProduct.imageURL;
        
        modalBody.innerHTML = `
            <div class="modal-image">
                <img src="${displayImage}" alt="${currentProduct.name}" id="modalProductImage">
            </div>
            <div class="modal-info">
                <h2>${currentProduct.name}</h2>
                <span class="modal-category">${currentProduct.category}</span>
                <p style="color: #94a3b8; margin: 1rem 0; line-height: 1.6;">${currentProduct.description || 'Premium quality product with excellent finish and durability. Perfect for your printing needs.'}</p>
                
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
                
                ${hasProductVariants ? `
                <div class="color-variants">
                    <h3>🎨 Available Colors</h3>
                    <div class="color-options" id="colorOptions">
                        ${currentProduct.variants.map((variant, idx) => `
                            <div class="color-option ${idx === 0 ? 'selected' : ''}" 
                                 style="background: ${variant.colorCode};" 
                                 data-variant-index="${idx}"
                                 data-variant-image="${variant.imageURL}">
                                <span class="color-tooltip">${variant.color}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
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
        
        // Add color variant event listeners if variants exist
        if (hasProductVariants) {
            document.querySelectorAll('.color-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    const variantIndex = parseInt(option.dataset.variantIndex);
                    selectedVariant = currentProduct.variants[variantIndex];
                    document.getElementById('modalProductImage').src = selectedVariant.imageURL;
                    
                    // Update price if variant has different price
                    if (selectedVariant.price) {
                        currentProduct.price = selectedVariant.price;
                        const newTotals = calculateTotal();
                        const totalRow = document.querySelector('.price-row.total span:last-child');
                        if (totalRow) totalRow.innerHTML = `₹${newTotals.total.toFixed(2)}`;
                    }
                });
            });
        }
        
        // Quantity event listeners
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
            const variantText = hasProductVariants ? `\nColor: ${selectedVariant.color}` : '';
            const message = `Hello Minerva Printers,%0A%0AI'm interested in:%0AProduct: ${currentProduct.name}${variantText}%0AQuantity: ${quantity} pc(s)%0ATotal Price: ₹${totals.total.toFixed(2)}%0A%0APlease share more details and availability.`;
            window.location.href = `mailto:minervaprinters2000@gmail.com?subject=Enquiry for ${currentProduct.name}&body=${encodeURIComponent(message)}`;
        });
        
        // WhatsApp button with product image link
document.getElementById('whatsappBtn')?.addEventListener('click', () => {
    const totals = calculateTotal();
    const hasProductVariants = hasVariants(currentProduct);
    const variantText = hasProductVariants ? `%0A🎨 Color: ${selectedVariant.color}` : '';
    
    // Get current domain for image URL (works on any domain - localhost or live)
    const currentDomain = window.location.origin;
    const productImagePath = hasProductVariants ? selectedVariant.imageURL : currentProduct.imageURL;
    
    // Remove any leading dots or slashes and create clean URL
    let cleanImagePath = productImagePath;
    if (cleanImagePath.startsWith('./')) cleanImagePath = cleanImagePath.substring(2);
    if (cleanImagePath.startsWith('../')) cleanImagePath = cleanImagePath.replace(/\.\.\//g, '');
    if (cleanImagePath.startsWith('image/')) cleanImagePath = cleanImagePath;
    
    const fullImageURL = `${currentDomain}/${cleanImagePath}`;
    
    // Professional message format
    const message = `Hii Minerva Printers!%0A%0A *Product Image:*%0A${fullImageURL}%0A%0A *Product Details:*%0A━━━━━━━━━━━━━━━━%0A• Product Name: ${currentProduct.name}${variantText}%0A• Quantity: ${quantity} piece(s)%0A• Unit Price: ₹${currentProduct.price} per piece%0A━━━━━━━━━━━━━━━━%0A *Total Amount: ₹${totals.total.toFixed(2)}*%0A━━━━━━━━━━━━━━━━%0A%0APlease confirm availability and delivery timeline. Thank you!`;
    
    window.open(`https://wa.me/919937311044?text=${message}`, '_blank');
});
    }

    // Close Modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Event Listeners
    globalSearch.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        filterAndDisplayProducts();
    });

    sortOrderSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterAndDisplayProducts();
    });

    // Initialize
    function init() {
        renderCategoryButtons();
        filterAndDisplayProducts();
    }

    init();

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }