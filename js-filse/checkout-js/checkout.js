// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, updateDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2Yl1VfdSjLfa3WGEszCOs4uA9vLAJVN0",
  authDomain: "aeye-52e5c.firebaseapp.com",
  projectId: "aeye-52e5c",
  storageBucket: "aeye-52e5c.appspot.com",
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

// Show toast notification
function showToast(message, backgroundColor = 'red') {
  Toastify({
    text: message,
    duration: 3000,
    backgroundColor: backgroundColor,
    close: true,
    gravity: 'top',
    position: 'center',
    stopOnFocus: true,
  }).showToast();
}

// Update total price, tax, and final price
function updateTotalPrice() {
  const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
  let totalPrice = selectedProducts.reduce((total, product) => total + (parseInt(product.price) * product.quantity), 0);

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

// Load checkout products
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

// Update delivery option
window.updateDeliveryOption = function (index, cost) {
  localStorage.setItem(`delivery-${index}`, cost.toString());
  updateTotalPrice();
};

// Remove product from cart
function removeProduct(index) {
  let selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
  selectedProducts.splice(index, 1);
  localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));

  // Remove delivery option for the deleted product
  localStorage.removeItem(`delivery-${index}`);
  loadCheckoutProducts();
}

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
  loadCheckoutProducts();
  itemes();
});

// Payment Modal Logic
const modal = document.getElementById('paymentModal');
const closeModal = document.querySelector('.close');
const confirmOrderButton = document.getElementById('confirmOrder');
const cashPaymentButton = document.getElementById('cashPayment');
const mobileWalletButton = document.getElementById('mobileWallet');
const cardPaymentButton = document.getElementById('cardPayment');
const instaPayButton = document.getElementById('instaPay');
const stripePaymentForm = document.getElementById('stripePaymentForm');
const mobileWalletForm = document.getElementById('mobileWalletForm');
const instaPayForm = document.getElementById('instaPayForm');

// Open modal when "Place your order" is clicked
confirmOrderButton.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Close modal when clicking on the close button
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  hideAllForms();
});

// Close modal when clicking outside the modal
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    hideAllForms();
  }
});

// Hide all payment forms
function hideAllForms() {
  stripePaymentForm.style.display = 'none';
  mobileWalletForm.style.display = 'none';
  instaPayForm.style.display = 'none';
}

// Handle Cash Payment
cashPaymentButton.addEventListener('click', async () => {
  hideAllForms();
  await confirmOrder('Cash');
  modal.style.display = 'none';
});

// Handle Mobile Wallet Payment
mobileWalletButton.addEventListener('click', () => {
  hideAllForms();
  mobileWalletForm.style.display = 'block';
});

// Handle InstaPay Payment
instaPayButton.addEventListener('click', () => {
  hideAllForms();
  instaPayForm.style.display = 'block';
});

// Handle Mobile Wallet Form Submission
document.getElementById('mobileWalletSubmit').addEventListener('click', async () => {
  const walletNumber = document.getElementById('walletNumber').value;
  const walletProvider = document.getElementById('walletProvider').value;

  if (walletNumber && validateMobileWallet(walletNumber)) {
    await confirmOrder('Mobile Wallet', { number: walletNumber, provider: walletProvider });
    modal.style.display = 'none';
  } else {
    showToast('Invalid mobile wallet number. Please try again.', 'darkred');
  }
});

// Handle InstaPay Form Submission
document.getElementById('instaPaySubmit').addEventListener('click', async () => {
  const instaPayNumber = document.getElementById('instaPayNumber').value;

  if (instaPayNumber && validateMobileWallet(instaPayNumber)) {
    await confirmOrder('InstaPay', { number: instaPayNumber });
    modal.style.display = 'none';
  } else {
    showToast('Invalid InstaPay number. Please try again.', 'darkred');
  }
});

// Validate Mobile Wallet Number
function validateMobileWallet(walletNumber) {
  const regex = /^01[0125][0-9]{8}$/; // Egyptian mobile number format
  return regex.test(walletNumber);
}

// Handle Card Payment
cardPaymentButton.addEventListener('click', () => {
  hideAllForms();
  stripePaymentForm.style.display = 'block';
  initializeStripe();
});

// Initialize Stripe Elements
function initializeStripe() {
  const elements = stripe.elements();
  const cardElement = elements.create('card');
  cardElement.mount('#card-element');

  const form = document.getElementById('payment-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      document.getElementById('card-errors').textContent = error.message;
    } else {
      await confirmOrder('Credit/Debit Card', paymentMethod.id);
      modal.style.display = 'none';
    }
  });
}

// Function to send email using Web3Forms
async function sendEmail(orderData) {
  return new Promise((resolve, reject) => {
    // Prepare the form data
    const formData = new FormData();
    formData.append('access_key', 'c6816f67-eba0-4681-80a1-01a32c35bdf7');
    formData.append('subject', `Order Confirmation #${new Date().getTime()}`);
    formData.append('name', orderData.user.name);
    formData.append('email', orderData.user.email);
    formData.append('phone', orderData.user.phone);
    formData.append('address', orderData.user.address);
    formData.append('delivery_cost', orderData.deliveryOption);
    formData.append('tax_amount', Math.round(orderData.totalPrice * 0.14));
    formData.append('total_amount', orderData.totalPrice);
    formData.append('payment_method', orderData.paymentMethod);
    formData.append('from_name', 'A-EYE');
    formData.append('reply_to', 'https://ssayed-yasser.github.io/AEYE/');
    
    // Send the request to Web3Forms
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(async (response) => {
      const json = await response.json();
      if (response.status === 200 && json.success) {
        console.log('Email sent successfully via Web3Forms');
        resolve();
      } else {
        console.error('Web3Forms error:', json.message);
        reject(new Error(json.message || 'Failed to send email via Web3Forms'));
      }
    })
    .catch((error) => {
      console.error('Fetch error:', error);
      reject(new Error('Failed to connect to Web3Forms API'));
    });
  });
}

async function confirmOrder(paymentMethod, paymentDetails = '') {
  if (localStorage.getItem('loginmethod') === '555') {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];

    // Calculate prices
    let totalPrice = selectedProducts.reduce((total, product) => total + (parseInt(product.price) * product.quantity), 0);
    let deliveryCost = selectedProducts.reduce((total, product, index) => {
      const savedDeliveryOption = localStorage.getItem(`delivery-${index}`) || '0';
      return total + parseInt(savedDeliveryOption, 10);
    }, 0);
    let tax = Math.round(totalPrice * 0.14);
    let finalPrice = totalPrice + tax + deliveryCost;

    // Prepare order data
    const orderData = {
      user: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address
      },
      products: selectedProducts,
      totalPrice: finalPrice,
      paymentMethod: paymentMethod,
      paymentDetails: paymentDetails,
      paymentStatus: paymentMethod === 'Cash' ? 'Pending' : 'Paid',
      deliveryOption: deliveryCost,
      trackingStatus: 1,
      timestamp: new Date().toISOString()
    };

    try {
      // First try to send the email
      await sendEmail(orderData);
      
      // If email sent successfully, save to Firestore
      await setDoc(doc(collection(db, "orders")), orderData);

      // Update product quantities
      for (const product of selectedProducts) {
        const productRef = doc(db, "products", product.id);
        const productDoc = await getDoc(productRef);

        if (productDoc.exists()) {
          const currentQuantity = productDoc.data().quantity || 0;
          const newQuantity = currentQuantity - product.quantity;

          if (newQuantity >= 0) {
            await updateDoc(productRef, { quantity: newQuantity });
          } else {
            console.error(`Not enough stock for product ${product.id}`);
            showToast(`Not enough stock for ${product.name}`, 'darkred');
          }
        }
      }

      // Clear local storage
      localStorage.removeItem('selectedProducts');
      selectedProducts.forEach((product, index) => {
        localStorage.removeItem(`delivery-${index}`);
      });

      showToast('Order confirmed! Check your email for confirmation.', 'green');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);
    } catch (error) {
      console.error("Error in order confirmation:", error);
      showToast(`Order failed: ${error.message}`, 'darkred');
    }
  } else {
    showToast('Please login to complete your purchase', 'darkred');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 3000);
  }
}

// Display items in the order summary
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