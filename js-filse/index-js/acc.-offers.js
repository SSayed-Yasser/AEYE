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

    // Clear the products array before updating it to avoid duplication
    products.length = 0; // This clears the existing array
    products.unshift(...newProducts); // Add new products

    console.log('Products added from Firebase:', newProducts);
    console.log('Updated products:', products);

    // After fetching data, update the UI
    displayAccessoriesProducts();
    displayBrandProducts();
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// Display accessories (Accssoris) products
function displayAccessoriesProducts() {
  const accProducts = products.filter(product => product.mod === "Accssoris" && product.quantity > 0);
  let accsHTML = '';

  accProducts.slice(0, 10).forEach((product) => {
    accsHTML += `
      <div class="div-accs" style="background-image: url(${product.img});">
        <div class="back-filter">
          <h3 class="accs-h4 name-edit-123">${product.name}</h3>
          <p class="discription">${product.discr}<p class="discription1">one year warranty</p></p>
          <div class="sale-div12">
            <h6 class="sale-h6">Sale</h6>
            <h6 class="sale-h6">${product.sale}%</h6>
            <h6 class="sale-h7" style="display: none;">${product.id}</h6>
          </div>
          <button class="button-acc button-acc11 button-animation2">Buy Now</button>
          <div class="price-div12">
            <p class="prive-without-sele2">${product.price} EG</p>
            <p class="prive-with-sele2">${product.price - (product.price * product.sale / 100)} EG</p>
          </div>
        </div>
      </div>
    `;
  });

  // Clear the container before appending new products to avoid duplication
  document.querySelector('.scroll-content2').innerHTML = '';
  document.querySelector('.scroll-content2').innerHTML = accsHTML;
  attachEventListeners(); // Attach event listeners for buttons
}

// Display brand (Brand) products
function displayBrandProducts() {
  const brandProducts = products.filter(product => product.mod === "Brand" && product.quantity > 0);
  let brandHTML = '';

  brandProducts.slice(0, 10).forEach((product) => {
    brandHTML += `
      <div class="div-accs" style="background-image: url(${product.img});">
        <div class="back-filter">
          <h3 class="accs-h4 name-edit-123">${product.name}</h3>
          <p class="discription">${product.discr}<p class="discription1">one year warranty</p></p>
          <div class="sale-div12">
            <h6 class="sale-h6">Sale</h6>
            <h6 class="sale-h6">${product.sale}%</h6>
            <h6 class="sale-h7" style="display: none;">${product.id}</h6>
          </div>
          <button class="button-acc button-acc22 button-animation2">Buy Now</button>
          <div class="price-div12">
            <p class="prive-without-sele2">${product.price} EG</p>
            <p class="prive-with-sele2">${product.price - (product.price * product.sale / 100)} EG</p>
          </div>
        </div>
      </div>
    `;
  });

  // Clear the container before appending new products to avoid duplication
  document.querySelector('.scroll-content23').innerHTML = '';
  document.querySelector('.scroll-content23').innerHTML = brandHTML;
  attachEventListeners2(); // Attach event listeners for buttons
}

// Function to add product to cart
function addToCart05(button) {
  const productDiv = button.closest('.div-accs');
  const productName = productDiv.querySelector('.name-edit-123').textContent;
  const productImg = productDiv.style.backgroundImage.slice(5, -2); // Extract image URL from background-image
  const productDescription = productDiv.querySelector('.discription').textContent;
  const productSale = productDiv.querySelector('.sale-h6').textContent.replace('%', '');
  const productPrice = productDiv.querySelector('.prive-with-sele2').textContent.replace(' EG', '');
  const productId = productDiv.querySelector('.sale-h7').textContent;

  const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];

  // Check if the product already exists in the cart
  const existingProductIndex = selectedProducts.findIndex(product => product.id === productId);
  if (existingProductIndex > -1) {
    // If the product exists, increase the quantity by 1
    selectedProducts[existingProductIndex].quantity += 1;
  } else {
    // If the product does not exist, add it with quantity 1
    selectedProducts.push({
      id: productId,
      name: productName,
      img: productImg,
      discr: productDescription,
      sale: productSale,
      price: productPrice,
      quantity: 1,
    });
  }

  localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
  updateCartCount();
}

// Function to attach event listeners to "Buy Now" buttons
function attachEventListeners2() {
  document.querySelectorAll('.button-acc22').forEach(button => {
    button.addEventListener('click', function() {
      addToCart05(this);
    });
  });
}

function attachEventListeners() {
  document.querySelectorAll('.button-acc11').forEach(button => {
    button.addEventListener('click', function() {
      addToCart05(this);
    });
  });
}

// Fetch products from Firebase and display all products
fetchProductsFromFirebase();
