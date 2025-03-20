// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { products } from '../db-js/products.js';

// Initialize cart count on page load
function updateCartCount() {
  const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
  const cartCount = selectedProducts.reduce((total, product) => total + product.quantity, 0);
  document.querySelector('#cart-count').textContent = cartCount;
}
updateCartCount();

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

// Function to fetch products from Firebase
async function fetchProductsFromFirebase() {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const newProducts = [];

    querySnapshot.forEach((doc) => {
      const product = doc.data();
      newProducts.push(product);
    });

    // Add new products to the beginning of the array
    products.unshift(...newProducts);
    console.log('Products added from Firebase:', newProducts);
    console.log('Updated products:', products);

    // After fetching data, update the UI
    displayAllProducts();
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// Function to display all products (EyeGlasses and SunGlasses)
function displayAllProducts() {
  const allProducts = products.filter(product => product.mod === "EyeGlasses" || product.mod === "SunGlasses" && product.quantity > 0);
  let productsHTML = '';

  allProducts.slice(0, 10).forEach((product) => {
    productsHTML += `
      <div class="div-new2">
        <div class="sale-div sale-div1">
          <h6 class="sale-h6">Sale</h6>
          <h6 class="sale-h6">${product.sale}%</h6>
          <h6 class="sale-h7" style="display: none;">${product.id}</h6>
        </div>
        <div class="img-new-hiddeimg">
          <img src="${product.img}" alt="${product.name}" class="img-new-products">
        </div>
        <div class="lens-div">
          <h5 class="left9 left55">Lens Type:</h5>
          <h5 class="left10 left55">${product.lens}</h5>
        </div>
        <button class="quick-add-button-css-1 button-animation">QUICK ADD</button>
        <h4 class="new-name-h4">${product.name}</h4>
        <div class="price-div1">
          <p class="prive-without-sele">${product.price} EG</p>
          <p class="prive-with-sele">${product.price - (product.price * product.sale / 100)} EG</p>
        </div>
      </div>
    `;
  });

  document.querySelector('.scroll-content').innerHTML = productsHTML;
  attachEventListeners(); // Attach event listeners to buttons
}

// Function to attach event listeners to "QUICK ADD" buttons
function attachEventListeners() {
  document.querySelectorAll('.quick-add-button-css-1').forEach(button => {
    button.addEventListener('click', function() {
      console.log('QUICK ADD button clicked'); // Debugging
      addToCart(this);
    });
  });
}

// Function to add product to cart
function addToCart(button) {
  const productDiv = button.closest('.div-new2');
  const productId = productDiv.querySelector('.sale-h7').textContent;

  const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];

  // Check if the product already exists in the cart
  const existingProductIndex = selectedProducts.findIndex(product => product.id === productId);
  if (existingProductIndex > -1) {
    // If the product exists, increase the quantity by 1
    selectedProducts[existingProductIndex].quantity += 1;
  } else {
    // If the product does not exist, add it with quantity 1
    const productName = productDiv.querySelector('.new-name-h4').textContent;
    const productImg = productDiv.querySelector('img').src;
    const productDescription = productDiv.querySelector('.lens-div').textContent;
    const productSale = productDiv.querySelectorAll('.sale-h6')[1].textContent.replace('%', '');
    const productPrice = productDiv.querySelector('.prive-with-sele').textContent.replace(' EG', '');

    selectedProducts.push({
      id: productId,
      name: productName,
      img: productImg,
      discr: productDescription,
      sale: productSale,
      price: productPrice,
      quantity: 1, // Start with quantity 1
    });
  }

  localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
  updateCartCount();
}

// Function to show toast notification
function showToast() {
  Toastify({
    text: "Login to buy",
    duration: 3000
  }).showToast();
}

// Fetch products from Firebase and display all products
fetchProductsFromFirebase();