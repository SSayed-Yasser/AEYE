// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, orderBy, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


document.addEventListener('DOMContentLoaded', () => {
  // Access elements
  const productIdInput = document.getElementById('iderror');
  const productNameInput = document.getElementById('nameerror');
  const productPriceInput = document.getElementById('priceerror');
  const productSaleInput = document.getElementById('saleerror');
  const productLensInput = document.getElementById('lenserror');
  const productDescInput = document.getElementById('deserror');
  const productimgurl = document.getElementById('imgerror');
  const productquantity = document.getElementById('quantityerror'); // New field
  const uploadButton1 = document.getElementById('upload-button');
  const errorMessage = document.querySelector('.error-massage-1');
  const mod = localStorage.getItem('uploadMode');

  // Debugging: Log elements to ensure they are not null
  console.log('productIdInput:', productIdInput);
  console.log('productNameInput:', productNameInput);
  console.log('productPriceInput:', productPriceInput);
  console.log('productSaleInput:', productSaleInput);
  console.log('productLensInput:', productLensInput);
  console.log('productDescInput:', productDescInput);
  console.log('productquantity:', productquantity); // Log the new field
  console.log('uploadButton1:', uploadButton1);
  console.log('errorMessage:', errorMessage);

  // If any element is null, stop execution
  if (
      !productIdInput ||
      !productNameInput ||
      !productPriceInput ||
      !productSaleInput ||
      !productLensInput ||
      !productDescInput ||
      !productquantity || // Check if the new field exists
      !uploadButton1 ||
      !errorMessage
  ) {
      console.error('One or more elements are missing in the DOM.');
      return;
  }

  // Add event listener to the upload button
  uploadButton1.addEventListener('click', async (event) => {
      event.preventDefault();
      const errors = [];

      // Reset field borders and error message
      productIdInput.style.border = '';
      productNameInput.style.border = '';
      productPriceInput.style.border = '';
      productSaleInput.style.border = '';
      productLensInput.style.border = '';
      productDescInput.style.border = '';
      productquantity.style.border = ''; // Reset border for quantity field
      errorMessage.innerText = ''; // Clear previous error messages
      errorMessage.style.color = 'red'; // Set default color for errors

      // Validate Product ID
      const id = productIdInput.value;
      if (!id) {
          errors.push('Product ID is required.');
          productIdInput.style.border = '1px solid red';
      } else if (!/^\d+$/.test(id)) { // Check if productId contains only numbers
          errors.push('Product ID must contain only numbers.');
          productIdInput.style.border = '1px solid red';
      } else if (id.length < 3) { // Check if productId has at least 3 digits
          errors.push('Product ID must be at least 3 digits.');
          productIdInput.style.border = '1px solid red';
      } else {
          const docRef = doc(db, 'products', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
              errors.push('Product ID already exists.');
              productIdInput.style.border = '1px solid red';
          }
      }

      // Validate Product Name
      const name = productNameInput.value;
      if (!name || name.length < 5) {
          errors.push('Product Name must be at least 5 characters.');
          productNameInput.style.border = '1px solid red';
      }

      // Validate Product img url
      const img = productimgurl.value;
      if (!img || img.length < 10) {
          errors.push('Product img must be at least 10 characters.');
          productimgurl.style.border = '1px solid red';
      }

      // Validate Product Price
      const price = productPriceInput.value;
      if (!price || isNaN(price)) {
          errors.push('Product Price must be a number.');
          productPriceInput.style.border = '1px solid red';
      }

      // Validate Product Sale
      const sale = productSaleInput.value;
      if (!sale || isNaN(sale.slice(0, -1))) {
          errors.push('Product Sale must be a percentage between 0% and 100%.');
          productSaleInput.style.border = '1px solid red';
      } else {
          const saleValue = parseFloat(sale.slice(0, -1));
          if (saleValue < 0 || saleValue > 100) {
              errors.push('Product Sale must be between 0% and 100%.');
              productSaleInput.style.border = '1px solid red';
          }
      }

      // Validate Product Lens
      const lens = productLensInput.value;
      if (!lens || lens.length < 4) {
          errors.push('Product Lens must be at least 4 characters.');
          productLensInput.style.border = '1px solid red';
      }

      // Validate Product Description
      const productDesc = productDescInput.value;
      if (!productDesc || productDesc.length < 5) {
          errors.push('Product Description must be at least 5 characters.');
          productDescInput.style.border = '1px solid red';
      }

      // Validate Product Quantity
      const quantity = productquantity.value;
      if (!quantity || isNaN(quantity) || quantity < 0) {
          errors.push('Product Quantity must be a valid number greater than or equal to 0.');
          productquantity.style.border = '1px solid red';
      }

      // If there are errors, display them
      if (errors.length > 0) {
          errorMessage.innerText = errors.join('\n'); // Join errors with line breaks
          console.log('Errors:', errors); // Debugging
          return;
      }

      // If no errors, upload data to Firebase
      try {
          // Save data to Firestore
          await setDoc(doc(db, 'products', id), {
              mod,
              id,
              name,
              price: parseFloat(price),
              sale,
              lens,
              productDesc,
              img,
              quantity: parseInt(quantity, 10) // Save the quantity as an integer
          });

          // Show success message
          errorMessage.innerText = 'Product uploaded successfully!';
          errorMessage.style.color = 'green';

          // Reset form fields
          productIdInput.value = '';
          productNameInput.value = '';
          productPriceInput.value = '';
          productSaleInput.value = '';
          productLensInput.value = '';
          productDescInput.value = '';
          productimgurl.value = '';
          productquantity.value = ''; // Reset quantity field
      } catch (error) {
          console.error('Error uploading product:', error);
          errorMessage.innerText = 'Error uploading product.';
      }
  });
});


// Update cart count
function updateCartCount() {
  const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
  const cartCount = selectedProducts.reduce((total, product) => total + product.quantity, 0);
  document.querySelector('#cart-count').textContent = cartCount;
}
updateCartCount();

// Admin credentials
const adminEmail = "sayedyassersy1@gmail.com";
const adminEmail1 = "rawanahmedd30@gmail.com";

function checkAdminAccess() {
  const userData = JSON.parse(localStorage.getItem('userData'));

  if (!userData || !userData.email) {
    showErrorMessage("No user is logged in. Please log in first.");
    return;
  }

  if (userData.email === adminEmail) {
    document.getElementById("error-message").classList.add("hidden");
    document.getElementById("error-message1").classList.add("hidden");
    document.getElementById("error-message2").classList.add("hidden");
    document.getElementById("error-message3").classList.add("hidden");
    document.getElementById("admin-container").classList.remove("hidden");
    document.getElementById("admin-container1").classList.remove("hidden");
    document.getElementById("product-continar").classList.remove("hidden");
    document.getElementById("items-continar").classList.remove("hidden");
    loadOrders(); 
    loadUsers();
  } else {
    if (userData.email === adminEmail1) {
      document.getElementById("error-message").classList.add("hidden");
      document.getElementById("error-message1").classList.add("hidden");
      document.getElementById("error-message2").classList.add("hidden");
      document.getElementById("error-message3").classList.add("hidden");
      document.getElementById("admin-container").classList.remove("hidden");
      document.getElementById("admin-container1").classList.remove("hidden");
      document.getElementById("product-continar").classList.remove("hidden");
      document.getElementById("items-continar").classList.remove("hidden");
      loadOrders(); 
      loadUsers();
    } else {
      showErrorMessage("You are not an admin.");
    }
  }
}

function showErrorMessage(message) {
  const errorContainer = document.getElementById("error-message");
  const errorContainer1 = document.getElementById("error-message1");
  const errorContainer2 = document.getElementById("error-message2");
  errorContainer.classList.remove("hidden");
  errorContainer.querySelector("h1").textContent = message;
  errorContainer1.classList.remove("hidden");
  errorContainer1.querySelector("h1").textContent = message;
  errorContainer2.classList.remove("hidden");
  errorContainer2.querySelector("h1").textContent = message;
  document.getElementById("product-continar").classList.add("hidden");
  document.getElementById("items-continar").classList.add("hidden");
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
          <p><strong>PaymentMethod:</strong> ${order.paymentMethod}</p>
          <p><strong>Number:</strong> ${order.paymentDetails.number}</p>
          <p><strong>Provider:</strong> ${order.paymentDetails.provider}</p>
          <p><strong>PaymentStatus:</strong> ${order.paymentStatus}</p>
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


window.toggleUserDetails = function(userId) {
  const userDetails = document.getElementById(`user-details-${userId}`);
  if (userDetails.style.display === "none") {
    userDetails.style.display = "block"; 
  } else {
    userDetails.style.display = "none"; 
  }
};


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


window.toggleUserActiveStatus = async function (userId, isActive) {
  try {
    const userDoc = doc(db, "users", userId);
    const newStatus = !isActive;
    await updateDoc(userDoc, { isActive: newStatus });

  
    const toggleButton = document.querySelector(`#user-${userId} .toggle-active-btn`);
    if (toggleButton) {
      toggleButton.textContent = newStatus ? "Activate account" : "Stop account";
    }

    alert(`تم ${newStatus ? "تشغيل" : "إيقاف"} الحساب بنجاح!`);

    loadUsers();
  } catch (error) {
    console.error("Error toggling user active status:", error);
    alert("فشل في تغيير حالة الحساب.");
  }
};


window.deleteUser = async function(userId) {
  if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
    try {
      const userDoc = doc(db, "users", userId);
      await deleteDoc(userDoc);
      alert('تم حذف الحساب بنجاح!');
      loadUsers();
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

document.getElementById('Product-type-h3').innerText = localStorage.getItem('uploadMode');
