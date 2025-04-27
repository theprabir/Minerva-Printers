const products = [
    { imageURL: "images/Wedding/A.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/B.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/C.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/D.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/E.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/F.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/G.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/H.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/I.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/J.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/K.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/L.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/M.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/N.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/O.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/P.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/Q.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/R.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/S.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/T.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/U.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/v.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/X.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/Wedding/Y.png", name: "Wedding Invitation", category: "Wedding Card", price: 20 },
    { imageURL: "images/visiting/1.jpg", name: "", category: "Business Card", price: 1 },
    { imageURL: "images/visiting/2.jpg", name: "", category: "Business Card", price: 1 },
    { imageURL: "images/visiting/3.jpg", name: "", category: "Business Card", price: 1 },
    { imageURL: "images/visiting/4.jpg", name: "", category: "Business Card", price: 1 },
    { imageURL: "images/visiting/5.jpg", name: "", category: "Business Card", price: 1 },
    { imageURL: "images/visiting/6.jpg", name: "", category: "Business Card", price: 1 },
    { imageURL: "images/visiting/7.jpg", name: "", category: "Business Card", price: 1 },
    { imageURL: "images/visiting/8.jpg", name: "", category: "Business Card", price: 1 },
    { imageURL: "images/visiting/9.jpg", name: "", category: "Business Card", price: 1 },
    { imageURL: "images/visiting/10.jpg", name: "", category: "Business Card", price: 1 },
    { imageURL: "images/visiting/11.jpg", name: "", category: "Business Card", price: 1 },
    { imageURL: "images/visiting/12.jpg", name: "", category: "Business Card", price: 1 },
    { imageURL: "images/visiting/13.jpg", name: "", category: "Business Card", price: 1 },
    { imageURL: "images/visiting/14.jpg", name: "", category: "Business Card", price: 1 },
    { imageURL: "images/visiting/15.jpg", name: "", category: "Business Card", price: 1 },
    { imageURL: "images/visiting/16.jpg", name: "", category: "Business Card", price: 1 },
    // { imageURL: "", name: "", category: "", price:  },
];

const productsContainer = document.querySelector('.products');
const searchInput = document.getElementById('searchProduct');
const sortOrderSelect = document.getElementById('sortOrder');
const filterButtons = document.querySelectorAll('.filters button');

function displayProducts(productsArray) {
    productsContainer.innerHTML = "";
    productsArray.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.imageURL}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Category: ${product.category}</p>
            <p>Price: ₹${product.price}/pc</p>
        `;
        productsContainer.appendChild(productElement);
    });
}

function filterProducts(category) {
    let filteredProducts = products;
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }
    filteredProducts = searchProducts(filteredProducts);
    filteredProducts = sortProducts(filteredProducts);
    displayProducts(filteredProducts);
}

function searchProducts(productsArray) {
    const searchText = searchInput.value.toLowerCase();
    return productsArray.filter(product => product.name.toLowerCase().includes(searchText));
}

function sortProducts(productsArray) {
    const sortOrder = sortOrderSelect.value;
    if (sortOrder === 'lowest') {
        return productsArray.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highest') {
        return productsArray.sort((a, b) => b.price - a.price);
    }
    return productsArray;
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterProducts(button.dataset.category);
    });
});

searchInput.addEventListener('input', () => {
    filterProducts(document.querySelector('.filters button.active')?.dataset.category || 'all');
});

sortOrderSelect.addEventListener('change', () => {
    filterProducts(document.querySelector('.filters button.active')?.dataset.category || 'all');
});

displayProducts(products);