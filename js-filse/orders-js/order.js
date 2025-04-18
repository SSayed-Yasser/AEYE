// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Update cart count
function updateCartCount() {
  const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
  const cartCount = selectedProducts.reduce((total, product) => total + product.quantity, 0);
  document.querySelector('#cart-count').textContent = cartCount;
}
updateCartCount();

// Load and display user orders
async function loadUserOrders() {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const ordersList = document.getElementById('orders-list');

  if (!userData || !userData.email) {
    ordersList.innerHTML = '<p>No user data found. Please log in.</p>';
    return;
  }

  const userEmail = userData.email;
  const ordersQuery = query(collection(db, "orders"), where("user.email", "==", userEmail));

  try {
    const querySnapshot = await getDocs(ordersQuery);
    if (querySnapshot.empty) {
      ordersList.innerHTML = '<p>No orders found for this user.</p>';
      return;
    }

    ordersList.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const order = doc.data();

      // تفاصيل المنتجات
      const productsList = order.products.map(product => `
        <div class="product-item">
          <span class="product-name">${product.name}</span>
          <span>Qty: ${product.quantity}</span>
          <span>Price: ${product.price} EG</span>
        </div>
      `).join('');

      // تفاصيل الطلب
      const orderCard = document.createElement('div');
      orderCard.className = 'order-card';

      // خطوات التتبع
      const trackingSteps = `
        <div class="tracking-container">
          <h4>Order Tracking</h4>
          <div class="tracking-step ${order.trackingStatus === 1 ? 'current' : ''}">Manufacturing</div>
          <div class="tracking-step ${order.trackingStatus === 2 ? 'current' : ''}">Packing</div>
          <div class="tracking-step ${order.trackingStatus === 3 ? 'current' : ''}">Shipping</div>
        </div>
      `;

      // محتوى الطلب
      orderCard.innerHTML = `
        <h3>Order Summary</h3>
        <div class="order-details">
          <p><strong>Customer Name:</strong> ${order.user.name}</p>
          <p><strong>Phone:</strong> ${order.user.phone}</p>
          <p><strong>Address:</strong> ${order.user.address}</p>
          <p><strong>Order Date:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
          <p><strong>Delivery Option:</strong> ${order.deliveryOption}</p>
          <p><strong>Total Price:</strong> ${order.totalPrice} EG</p>
          <p><strong>PaymentMethod:</strong> ${order.paymentMethod}</p>
          <p><strong>Number:</strong> ${order.paymentDetails.number}</p>
          <p><strong>Provider:</strong> ${order.paymentDetails.provider}</p>
          <p><strong>PaymentStatus:</strong> ${order.paymentStatus}</p>
        </div>
        <div class="product-list">
          ${productsList}
        </div>
        ${trackingSteps}
      `;

      ordersList.appendChild(orderCard);
    });
  } catch (error) {
    console.error("Error loading orders:", error);
    ordersList.innerHTML = '<p>Failed to load orders. Please try again later.</p>';
  }
}

// Load orders when the page loads
document.addEventListener('DOMContentLoaded', loadUserOrders);
