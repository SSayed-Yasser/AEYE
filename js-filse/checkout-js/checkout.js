window.updateDeliveryOption = updateDeliveryOption;
// Import the necessary functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2Yl1VfdSjLfa3WGEszCOs4uA9vLAJVN0",
  authDomain: "aeye-52e5c.firebaseapp.com",
  projectId: "aeye-52e5c",
  storageBucket: "aeye-52e5c.firebasestorage.app",
  messagingSenderId: "721877823117",
  appId: "1:721877823117:web:5e789ac89e2baf9abffcc4",
  measurementId: "G-4NGC51320Q"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Update cart count
function updateCartCount() {
  const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
  const cartCount = selectedProducts.reduce((total, product) => total + product.quantity, 0);
  document.querySelector('#cart-count').textContent = cartCount;
  document.querySelector('#cart-count1').textContent = "Items " + "(" + cartCount + ")";
}
updateCartCount();

function showToast() {
  Toastify({
    text: "Login to buy",
    duration: 3000
  }).showToast();
}

function updateTotalPrice() {
  const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
  let totalPrice = selectedProducts.reduce((total, product) => total + (parseInt(product.price) * product.quantity), 0);

  // Calculate shipping cost based on delivery options
  let deliveryCost = selectedProducts.reduce((total, product, index) => {
    const savedDeliveryOption = localStorage.getItem(`delivery-${index}`) || '0';
    return total + parseInt(savedDeliveryOption, 10);
  }, 0);

  let tax = Math.round(totalPrice * 0.14);
  let finalPrice = totalPrice + tax + deliveryCost;

  document.querySelector('#items-price').textContent = totalPrice + " EG";
  document.querySelector('#shipping-price').textContent = deliveryCost + " EG";
  document.querySelector('#total-before-tax').textContent = (totalPrice + deliveryCost) + " EG";
  document.querySelector('#tax').textContent = tax + " EG";
  document.querySelector('#final-price').textContent = finalPrice + " EG";
}

function loadCheckoutProducts() {
  const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
  const checkoutProductsDiv = document.getElementById('checkout-products');

  checkoutProductsDiv.innerHTML = '';
  selectedProducts.forEach((product, index) => {
    const savedDeliveryOption = localStorage.getItem(`delivery-${index}`) || '0';
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = `
      <div class="broduct-con">
        <div class="img-con">
          <img src="${product.img}" alt="" class="img-edit">
        </div>
        <div class="product-con2">
          <div class="part1"></div>
          <div class="part2">
            <h4 class="proudct-name">${product.name}</h4>
            <p class="disc">${product.discr}</p>
            <div class="qoun" style="display: flex;">
              <p>Price: ${product.price}</p>
            </div>
            <div class="qoun" style="display: flex;">
              <p>Quantity: ${product.quantity}</p>
            </div>
            <button class="button-ss remove-button" data-index="${index}">Remove</button>
          </div>
          <div class="part3">
            <div class="free">
              <input type="radio" name="delivery-${index}" value="0" ${savedDeliveryOption === '0' ? 'checked' : ''} onchange="updateDeliveryOption(${index}, 0)">
              <h5>One week (Free)</h5>
            </div>
            <div class="free">
              <input type="radio" name="delivery-${index}" value="50" ${savedDeliveryOption === '50' ? 'checked' : ''} onchange="updateDeliveryOption(${index}, 50)">
              <h5>Two days (50 EG)</h5>
            </div>
            <div class="free">
              <input type="radio" name="delivery-${index}" value="100" ${savedDeliveryOption === '100' ? 'checked' : ''} onchange="updateDeliveryOption(${index}, 100)">
              <h5>Same day (100 EG)</h5>
            </div>
          </div>
        </div>
      </div>
    `;
    checkoutProductsDiv.appendChild(productDiv);
  });

  // Add event listeners to remove buttons
  const removeButtons = document.querySelectorAll('.remove-button');
  removeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const index = event.target.getAttribute('data-index');
      removeProduct(index);
    });
  });

  updateTotalPrice();
}

// Export the function so it can be used in the DOM
export function updateDeliveryOption(index, cost) {
  localStorage.setItem(`delivery-${index}`, cost.toString());
  updateTotalPrice();
}

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
  loadCheckoutProducts();
});

function removeProduct(index) {
  let selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
  selectedProducts.splice(index, 1);
  localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));

  // Remove delivery option for the deleted product
  localStorage.removeItem(`delivery-${index}`);
  loadCheckoutProducts();
}


// get button
const confirmOrderButton = document.getElementById('confirmOrder');
confirmOrderButton.onclick = function () {
  confirmOrder();
};

function confirmOrder() {
  if (localStorage.getItem('loginmethod') === '555') {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];

    let totalPrice = selectedProducts.reduce((total, product) => total + (parseInt(product.price) * product.quantity), 0);
    let deliveryCost = selectedProducts.reduce((total, product, index) => {
      const savedDeliveryOption = localStorage.getItem(`delivery-${index}`) || '0';
      return total + parseInt(savedDeliveryOption, 10);
    }, 0);
    let tax = Math.round(totalPrice * 0.14);
    let finalPrice = totalPrice + tax + deliveryCost;

    const orderData = {
      user: {
        name: userData.name,
        email: userData.email, // تأكد من أن البريد يتم حفظه
        phone: userData.phone,
        address: userData.address
      },
      products: selectedProducts,
      totalPrice: finalPrice,
      deliveryOption: "2 days", // مثال
      trackingStatus: 1, // التصنيع كأول مرحلة
      timestamp: new Date().toISOString()
    };

    setDoc(doc(collection(db, "orders")), orderData)
      .then(() => {
        alert('Order confirmed and saved!');
        localStorage.removeItem('selectedProducts');
        selectedProducts.forEach((product, index) => {
          localStorage.removeItem(`delivery-${index}`);
        });
        window.location.href = 'index.html';
      })
      .catch((error) => {
        console.error("Error saving order: ", error);
        alert('Failed to save the order. Please try again.');
      });
  } else {
    showToast();
    window.location.href = 'login.html';
  }
}


// Link the confirm order function to the button
document.addEventListener('DOMContentLoaded', () => {
  const confirmOrderButton = document.getElementById('confirmOrder');
  confirmOrderButton.onclick = confirmOrder;
});



loadCheckoutProducts();


function itemes() {
  const selectedProducts2 = JSON.parse(localStorage.getItem('selectedProducts')) || [];
  const checkoutProductsDiv2 = document.getElementById('sayed-products');

  checkoutProductsDiv2.innerHTML = '';
  selectedProducts2.forEach((product, index) => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = `
    <div class="price-line">
      <div class="line-1">
          <h4 style="display: flex; margin: 0; color: cadetblue;" class="text-1" id="items">${product.quantity} ${product.name}</h4>
      </div>
      <div class="line-2">
          <h4 style="margin: 0; color: cadetblue;" id="item-price">${product.price}</h4>
      </div>
    </div>
    `;
    checkoutProductsDiv2.appendChild(productDiv);
  });
}

itemes();