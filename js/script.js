// Product Data - In a real app, this would come from a database
const products = [
    { id: 1, name: 'Painkiller Tablets', category: 'pain-relief', price: 450.00, image: 'https://via.placeholder.com/280x280?text=Painkiller' },
    { id: 2, name: 'Vitamin C 1000mg', category: 'vitamins', price: 1750.00, image: 'https://via.placeholder.com/280x280?text=Vitamin+C' },
    { id: 3, name: 'Moisturizing Lotion', category: 'skincare', price: 1500.00, image: 'https://via.placeholder.com/280x280?text=Lotion' },
    { id: 4, name: 'First Aid Kit', category: 'first-aid', price: 3200.00, image: 'https://via.placeholder.com/280x280?text=First+Aid' },
    { id: 5, name: 'Hand Sanitizer', category: 'first-aid', price: 250.00, image: 'https://via.placeholder.com/280x280?text=Sanitizer' },
    { id: 6, name: 'Baby Diapers', category: 'baby-care', price: 1500.00, image: 'https://via.placeholder.com/280x280?text=Diapers' },
];

let cart = [];

// Get references to HTML elements
const productsList = document.getElementById('products-list');
const cartItemsList = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const searchBar = document.getElementById('search-bar');
const sortBySelect = document.getElementById('sort-by');

// Function to render products on the page
function renderProducts(filteredProducts = products) {
    productsList.innerHTML = ''; // Clear previous products
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">KES ${product.price.toFixed(2)}</p>
            <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        `;
        productsList.appendChild(productCard);
    });
}

// Function to render cart items and total
function renderCart() {
    cartItemsList.innerHTML = ''; // Clear previous cart items
    let total = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} x${item.quantity} - KES ${(item.price * item.quantity).toFixed(2)}`;
        cartItemsList.appendChild(li);
        total += item.price * item.quantity;
    });
    cartTotalSpan.textContent = total.toFixed(2);
}

// Function to add a product to the cart
function addToCart(productId) {
    const product = products.find(p => p.id === parseInt(productId));
    const cartItem = cart.find(item => item.id === parseInt(productId));

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    renderCart();

    // Show the notification
    const notification = document.getElementById('add-to-cart-notification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000); // Hides the notification after 2 seconds
}

// Event listener for "Add to Cart" buttons
productsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const productId = e.target.dataset.id;
        addToCart(productId);
    }
});

// Event listener for search bar
searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm));
    renderProducts(filtered);
});

// Event listener for sort by dropdown
sortBySelect.addEventListener('change', (e) => {
    const sortValue = e.target.value;
    let sortedProducts = [...products]; // Create a copy to avoid sorting the original array
    
    if (sortValue === 'price-asc') {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
        sortedProducts.sort((a, b) => b.price - a.price);
    }
    renderProducts(sortedProducts);
});


// Initial rendering of products when the page loads
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});


// Get references for the new modal elements
const checkoutBtn = document.getElementById('checkout-btn');
const modalOverlay = document.getElementById('checkout-modal-overlay');
const closeModalBtn = document.querySelector('.close-btn');
const modalCartList = document.getElementById('modal-cart-list');
const modalTotalAmount = document.getElementById('modal-total-amount');
const discountCodeInput = document.getElementById('discount-code');
const applyDiscountBtn = document.getElementById('apply-discount');
const discountMessage = document.getElementById('discount-message');
const mpesaBtn = document.getElementById('mpesa-btn');
const airtelBtn = document.getElementById('airtel-btn');
const paypalBtn = document.getElementById('paypal-btn');

// Show the checkout modal
function showCheckoutModal() {
    modalOverlay.classList.add('show-modal');
    modalCartList.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} x${item.quantity} - KES ${(item.price * item.quantity).toFixed(2)}`;
        modalCartList.appendChild(li);
        total += item.price * item.quantity;
    });
    modalTotalAmount.textContent = `KES ${total.toFixed(2)}`;
    // Store the original total on a data attribute for discount calculation
    modalTotalAmount.dataset.originalTotal = total.toFixed(2);
    discountCodeInput.value = '';
    discountMessage.textContent = '';
}

// Hide the checkout modal
function hideCheckoutModal() {
    modalOverlay.classList.remove('show-modal');
}

// Apply discount logic
applyDiscountBtn.addEventListener('click', () => {
    const code = discountCodeInput.value.trim().toUpperCase();
    let originalTotal = parseFloat(modalTotalAmount.dataset.originalTotal);
    
    if (code === 'MAPLE10' && cart.length > 0) {
        const discountedTotal = originalTotal * 0.90;
        modalTotalAmount.textContent = `KES ${discountedTotal.toFixed(2)}`;
        discountMessage.textContent = 'Discount applied!';
        discountMessage.style.color = 'green';
    } else {
        modalTotalAmount.textContent = `KES ${originalTotal.toFixed(2)}`;
        discountMessage.textContent = 'Invalid or expired code.';
        discountMessage.style.color = 'red';
    }
});

// Event listeners for the modal buttons
checkoutBtn.addEventListener('click', showCheckoutModal);
closeModalBtn.addEventListener('click', hideCheckoutModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        hideCheckoutModal();
    }
});

// Payment method alerts (in a real project, this would be a payment gateway)
mpesaBtn.addEventListener('click', () => {
    alert('Redirecting to M-Pesa payment portal...');
});

airtelBtn.addEventListener('click', () => {
    alert('Redirecting to Airtel Money payment portal...');
});

paypalBtn.addEventListener('click', () => {
    alert('Redirecting to PayPal payment portal...');
});