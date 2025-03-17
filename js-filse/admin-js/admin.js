// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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

// Admin credentials
const adminEmail = "sayedyassersy1@gmail.com";

function checkAdminAccess() {
  const userData = JSON.parse(localStorage.getItem('userData'));

  if (!userData || !userData.email) {
    showErrorMessage("No user is logged in. Please log in first.");
    return;
  }

  if (userData.email === adminEmail) {
    document.getElementById("error-message").classList.add("hidden");
    document.getElementById("error-message1").classList.add("hidden");
    document.getElementById("admin-container").classList.remove("hidden");
    document.getElementById("admin-container1").classList.remove("hidden");
    loadOrders(); 
    loadUsers(); // Load users when admin access is granted
  } else {
    showErrorMessage("You are not an admin.");
  }
}

function showErrorMessage(message) {
  const errorContainer = document.getElementById("error-message");
  const errorContainer1 = document.getElementById("error-message1");
  errorContainer.classList.remove("hidden");
  errorContainer.querySelector("h1").textContent = message;
  errorContainer1.classList.remove("hidden");
  errorContainer1.querySelector("h1").textContent = message;
}

async function loadOrders() {
  const ordersList = document.getElementById("orders-list");
  ordersList.innerHTML = '<p>Loading orders...</p>';

  try {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc")); // ترتيب الطلبات حسب الوقت
    const querySnapshot = await getDocs(q);
    ordersList.innerHTML = '';

    querySnapshot.forEach((docSnap) => {
      const order = docSnap.data();

      const productsHTML = order.products.map(product => `
        <div class="product-item">
          <span class="product-name">${product.name}</span>
          <span>Qty: ${product.quantity} | Price: ${product.price} EG</span>
        </div>
      `).join('');

      const trackingHTML = `
        <div class="tracking-container">
          <p class="section-title">Order Tracking</p>
          <button class="tracking-step ${order.trackingStatus === 1 ? 'current' : ''}" onclick="updateDeliveryOption('${docSnap.id}', 1)">Manufacturing</button>
          <button class="tracking-step ${order.trackingStatus === 2 ? 'current' : ''}" onclick="updateDeliveryOption('${docSnap.id}', 2)">Packing</button>
          <button class="tracking-step ${order.trackingStatus === 3 ? 'current' : ''}" onclick="updateDeliveryOption('${docSnap.id}', 3)">Shipping</button>
        </div>
      `;

      const orderHTML = `
        <div class="order-card">
          <h3>Order from ${order.user.name}</h3>
          <p><strong>Order ID:</strong> ${docSnap.id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
          <p><strong>Total Items:</strong> ${order.products.length}</p>
          <p><strong>Total Price:</strong> ${order.totalPrice} EG</p>
          <div class="product-list">${productsHTML}</div>
          <p class="section-title">Customer Details</p>
          <p><strong>Name:</strong> ${order.user.name}</p>
          <p><strong>Email:</strong> ${order.user.email}</p>
          <p><strong>Phone:</strong> ${order.user.phone}</p>
          <p><strong>Address:</strong> ${order.user.address}</p>
          ${trackingHTML}
        </div>
      `;

      ordersList.insertAdjacentHTML('beforeend', orderHTML);
    });
  } catch (error) {
    console.error("Error loading orders:", error);
    ordersList.innerHTML = '<p>Failed to load orders.</p>';
  }
}

async function loadUsers() {
  const usersList = document.getElementById("users-list");
  usersList.innerHTML = '<p>Loading users...</p>';

  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    usersList.innerHTML = '';

    querySnapshot.forEach((docSnap) => {
      const user = docSnap.data();

      // إنشاء جدول مقاسات النظارة
      const glassesTableHTML = `
        <h4>Eye details</h4>
        <table class="glasses-table">
          <thead>
            <tr>
              <th>AEYE</th>
              <th>Sphere</th>
              <th>Cylinder</th>
              <th>Axis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Right</td>
              <td><input class="inputs1" type="text" id="fodSp-${docSnap.id}" value="${user.fodSp || ''}"></td>
              <td><input class="inputs1" type="text" id="fodCy-${docSnap.id}" value="${user.fodCy || ''}"></td>
              <td><input class="inputs1" type="text" id="fodAx-${docSnap.id}" value="${user.fodAx || ''}"></td>
            </tr>
            <tr>
              <td>Left</td>
              <td><input class="inputs1" type="text" id="fosSp-${docSnap.id}" value="${user.fosSp || ''}"></td>
              <td><input class="inputs1" type="text" id="fosCy-${docSnap.id}" value="${user.fosCy || ''}"></td>
              <td><input class="inputs1" type="text" id="fosAx-${docSnap.id}" value="${user.fosAx || ''}"></td>
            </tr>
          </tbody>
        </table>
      `;

      // إنشاء عنصر المستخدم
const userHTML = `
<div class="user-card ${user.isActive === false ? "inactive" : ""}" id="user-${docSnap.id}">
  <h3 style="text-align: left;">Email: ${user.email}</h3>
  <button class="toggle-details-btn" onclick="toggleUserDetails('${docSnap.id}')">Show details</button>
  <div class="user-details" id="user-details-${docSnap.id}" style="display: none;">
    <p style="text-align: left;"><strong class="strongs">User ID:</strong> ${docSnap.id}</p>
    <p style="text-align: left;"><strong class="strongs">Name:</strong> <input class="inputs" type="text" id="name-${docSnap.id}" value="${user.name || ""}"></p>
    <p style="text-align: left;"><strong class="strongs">Password:</strong> <input class="inputs"  type="text" id="password-${docSnap.id}" value="${user.password || ""}"></p>
    <p style="text-align: left;"><strong class="strongs">Phone:</strong> <input class="inputs" type="text" id="phone-${docSnap.id}" value="${user.phone || ""}"></p>
    <p style="text-align: left;"><strong class="strongs">Address:</strong> <input class="inputs" type="text" id="address-${docSnap.id}" value="${user.address || ""}"></p>
    ${glassesTableHTML} <!-- عرض جدول مقاسات النظارة -->
    <button class="save-btn" onclick="saveUserChanges('${docSnap.id}')">Save changes</button>
    <button class="toggle-active-btn" onclick="toggleUserActiveStatus('${docSnap.id}', ${user.isActive || false})">
      ${user.isActive === false ? "Activate account" : "Stop account"}
    </button>
    <button class="delete-btn" onclick="deleteUser('${docSnap.id}')">Delete account</button>
  </div>
</div>
`;

      usersList.insertAdjacentHTML('beforeend', userHTML);
    });
  } catch (error) {
    console.error("Error loading users:", error);
    usersList.innerHTML = '<p>Failed to load users.</p>';
  }
}

// وظيفة لإظهار/إخفاء تفاصيل المستخدم
window.toggleUserDetails = function(userId) {
  const userDetails = document.getElementById(`user-details-${userId}`);
  if (userDetails.style.display === "none") {
    userDetails.style.display = "block"; // إظهار التفاصيل
  } else {
    userDetails.style.display = "none"; // إخفاء التفاصيل
  }
};

// وظيفة لحفظ التعديلات
window.saveUserChanges = async function(userId) {
  const updatedData = {
    name: document.getElementById(`name-${userId}`).value,
    password: document.getElementById(`password-${userId}`).value,
    phone: document.getElementById(`phone-${userId}`).value,
    address: document.getElementById(`address-${userId}`).value,
    fodSp: document.getElementById(`fodSp-${userId}`).value,
    fodCy: document.getElementById(`fodCy-${userId}`).value,
    fodAx: document.getElementById(`fodAx-${userId}`).value,
    fosSp: document.getElementById(`fosSp-${userId}`).value,
    fosCy: document.getElementById(`fosCy-${userId}`).value,
    fosAx: document.getElementById(`fosAx-${userId}`).value
  };

  try {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, updatedData);
    alert('تم حفظ التعديلات بنجاح!');
  } catch (error) {
    console.error("Error updating user:", error);
    alert('فشل في حفظ التعديلات.');
  }
};

// وظيفة لإيقاف/تشغيل الحساب
window.toggleUserActiveStatus = async function (userId, isActive) {
  try {
    const userDoc = doc(db, "users", userId);
    const newStatus = !isActive;
    await updateDoc(userDoc, { isActive: newStatus });

    // تحديث نص الزر
    const toggleButton = document.querySelector(`#user-${userId} .toggle-active-btn`);
    if (toggleButton) {
      toggleButton.textContent = newStatus ? "Activate account" : "Stop account";
    }

    // عرض رسالة بناءً على الحالة الجديدة
    alert(`تم ${newStatus ? "تشغيل" : "إيقاف"} الحساب بنجاح!`);

    // إعادة تحميل المستخدمين لتحديث الواجهة
    loadUsers();
  } catch (error) {
    console.error("Error toggling user active status:", error);
    alert("فشل في تغيير حالة الحساب.");
  }
};

// وظيفة لحذف الحساب
window.deleteUser = async function(userId) {
  if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
    try {
      const userDoc = doc(db, "users", userId);
      await deleteDoc(userDoc);
      alert('تم حذف الحساب بنجاح!');
      loadUsers(); // إعادة تحميل المستخدمين لتحديث الواجهة
    } catch (error) {
      console.error("Error deleting user:", error);
      alert('فشل في حذف الحساب.');
    }
  }
};

window.updateDeliveryOption = async function updateTracking(orderId, newStatus) {
  try {
    const orderDoc = doc(db, "orders", orderId);
    await updateDoc(orderDoc, { trackingStatus: newStatus });
    alert('Order tracking updated successfully!');
    loadOrders(); 
  } catch (error) {
    console.error("Error updating tracking status:", error);
    alert('Failed to update tracking status.');
  }
};

// جعل الدالة filterOrders متاحة في النطاق العام
window.filterOrders = async function(filter) {
  const ordersList = document.getElementById("orders-list");
  ordersList.innerHTML = '<p>Loading orders...</p>';

  try {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc")); // ترتيب الطلبات حسب الوقت
    const querySnapshot = await getDocs(q);
    ordersList.innerHTML = '';

    querySnapshot.forEach((docSnap) => {
      const order = docSnap.data();

      if (filter === 'all' || 
          (filter === 'manufacturing' && order.trackingStatus === 1) ||
          (filter === 'packing' && order.trackingStatus === 2) ||
          (filter === 'shipping' && order.trackingStatus === 3)) {

        const productsHTML = order.products.map(product => `
          <div class="product-item">
            <span class="product-name">${product.name}</span>
            <span>Qty: ${product.quantity} | Price: ${product.price} EG</span>
          </div>
        `).join('');

        const trackingHTML = `
          <div class="tracking-container">
            <p class="section-title">Order Tracking</p>
            <button class="tracking-step ${order.trackingStatus === 1 ? 'current' : ''}" onclick="updateDeliveryOption('${docSnap.id}', 1)">Manufacturing</button>
            <button class="tracking-step ${order.trackingStatus === 2 ? 'current' : ''}" onclick="updateDeliveryOption('${docSnap.id}', 2)">Packing</button>
            <button class="tracking-step ${order.trackingStatus === 3 ? 'current' : ''}" onclick="updateDeliveryOption('${docSnap.id}', 3)">Shipping</button>
          </div>
        `;

        const orderHTML = `
          <div class="order-card">
            <h3>Order from ${order.user.name}</h3>
            <p><strong>Order ID:</strong> ${docSnap.id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
            <p><strong>Total Items:</strong> ${order.products.length}</p>
            <p><strong>Total Price:</strong> ${order.totalPrice} EG</p>
            <div class="product-list">${productsHTML}</div>
            <p class="section-title">Customer Details</p>
            <p><strong>Name:</strong> ${order.user.name}</p>
            <p><strong>Email:</strong> ${order.user.email}</p>
            <p><strong>Phone:</strong> ${order.user.phone}</p>
            <p><strong>Address:</strong> ${order.user.address}</p>
            ${trackingHTML}
          </div>
        `;

        ordersList.insertAdjacentHTML('beforeend', orderHTML);
      }
    });
  } catch (error) {
    console.error("Error loading orders:", error);
    ordersList.innerHTML = '<p>Failed to load orders.</p>';
  }
};

document.addEventListener("DOMContentLoaded", checkAdminAccess);