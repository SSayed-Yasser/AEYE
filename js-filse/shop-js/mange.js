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
    displayProducts();
    displaySunglassesProducts();
    displayAccessoriesProducts();
    displayBrandProducts();
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// Function to display eyeglasses products
function displayProducts() {
  const filteredProducts = products.filter(product => product.quantity > 0 && product.mod === "EyeGlasses");
  let productsHTML = '';

  filteredProducts.forEach((product) => {
    productsHTML += `
      <div class="contant-containar-all">
        <div class="sale-containar">
          <div class="sale-div">
            <h6 class="sale-h6">Sale</h6>
            <h6 class="sale-h6">${product.sale}%</h6>
            <h6 class="sale-h7" style="display: none;">${product.id}</h6>
          </div>
        </div>
        <img src="${product.img}" alt="${product.name}" class="img-all-cont">
        <div class="lens-type-dive">
          <h5>• Lens Type:&nbsp;</h5>
          <h5 id="lenstype-con">${product.lens}</h5>
        </div>
        <button class="quick-add-button-css quick-add-button-css11 btn liquid">QUICK ADD</button>
        <p class="name-all">${product.name}</p>
        <div class="price-div">
          <p class="prive-without-sele">${product.price} EG</p>
          <p class="prive-with-sele">${product.price - (product.price * product.sale / 100)} EG</p>
        </div>
      </div>
    `;
  });

  document.querySelector('.men-containar').innerHTML = productsHTML;
  attachEventListeners(); // Reattach event listeners for buttons
}

// Function to display sunglasses products
function displaySunglassesProducts() {
  const sunProducts = products.filter(product => product.mod === "SunGlasses");
  let productsHTML = '';

  sunProducts.forEach((product) => {
    productsHTML += `
      <div class="contant-containar-all">
        <div class="sale-containar">
          <div class="sale-div">
            <h6 class="sale-h6">Sale</h6>
            <h6 class="sale-h6">${product.sale}%</h6>
            <h6 class="sale-h7" style="display: none;">${product.id}</h6>
          </div>
        </div>
        <img src="${product.img}" alt="${product.name}" class="img-all-cont">
        <div class="lens-type-dive">
          <h5>• Lens Type:&nbsp;</h5>
          <h5 id="lenstype-con">${product.lens}</h5>
        </div>
        <button class="quick-add-button-css quick-add-button-css22 btn liquid">QUICK ADD</button>
        <p class="name-all">${product.name}</p>
        <div class="price-div">
          <p class="prive-without-sele">${product.price} EG</p>
          <p class="prive-with-sele">${product.price - (product.price * product.sale / 100)} EG</p>
        </div>
      </div>
    `;
  });

  document.querySelector('.sun-containar').innerHTML = productsHTML;
  attachEventListeners2(); // Reattach event listeners for buttons
}

// Function to display accessories (Accssoris) products
function displayAccessoriesProducts() {
  const accProducts = products.filter(product => product.mod === "Accssoris" && product.quantity > 0);
  let productsHTML = '';

  accProducts.forEach((product) => {
    productsHTML += `
      	<div class="div-accs" style="background-image: url(${product.img});">
          <div class="back-filter">
            <h3 class="accs-h4">${product.name}</h3>
              <p class="discription">${product.productDesc}<p class="discription1">one year warranty</p></p>
              <div class="sale-div12">
                <h6 class="sale-h6">Sale</h6>
                <h6 class="sale-h6">${product.sale}%</h6>
              </div>
              <button class="button-acc button-acc11 button-animation2">Buy Now</button>
              <div class="price-div12">
                <p class="prive-without-sele2">${product.price} EG</p>
                <p class="prive-with-sele2">${product.price - (product.price * product.sale / 100)} EG</p>
                <h6 class="sale-h7" style="display: none;">${product.id}</h6>
              </div>
          </div>
        </div>
    `;
  });

  document.querySelector('.all-glasses-containar2233').innerHTML = productsHTML;
  attachBuyNowEventListeners(); // Attach event listeners for "Buy Now" buttons
}

// Function to display brand (Brand) products
function displayBrandProducts() {
  const brandProducts = products.filter(product => product.mod === "Brand" && product.quantity > 0);
  let productsHTML = '';

  brandProducts.slice(0, 10).forEach((product) => {
    productsHTML += `
      	<div class="div-accs" style="background-image: url(${product.img});">
          <div class="back-filter">
            <h3 class="accs-h4">${product.name}</h3>
              <p class="discription">${product.discr}<p class="discription1">one year warranty</p></p>
              <div class="sale-div12">
                <h6 class="sale-h6">Sale</h6>
                <h6 class="sale-h6">${product.sale}%</h6>
              </div>
              <button class="button-acc button-acc22 button-animation2">Buy Now</button>
              <div class="price-div12">
                <p class="prive-without-sele2">${product.price} EG</p>
                <p class="prive-with-sele2">${product.price - (product.price * product.sale / 100)} EG</p>
                <h6 class="sale-h7" style="display: none;">${product.id}</h6>
              </div>
          </div>
        </div>
    `;
  });

  document.querySelector('.all-glasses-containar223344').innerHTML = productsHTML;
  attachBuyNowEventListeners2(); // Attach event listeners for "Buy Now" buttons
}

// Function to attach event listeners to "QUICK ADD" buttons
function attachEventListeners() {
  document.querySelectorAll('.quick-add-button-css11').forEach(button => {
    button.addEventListener('click', function() {
      console.log('QUICK ADD button clicked'); // Debugging
      addToCart(this);
    });
  });
}
// Function to attach event listeners to "QUICK ADD" buttons
function attachEventListeners2() {
  document.querySelectorAll('.quick-add-button-css22').forEach(button => {
    button.addEventListener('click', function() {
      console.log('QUICK ADD button clicked'); // Debugging
      addToCart(this);
    });
  });
}

// Function to attach event listeners to "Buy Now" buttons
function attachBuyNowEventListeners() {
  document.querySelectorAll('.button-acc11').forEach(button => {
    button.addEventListener('click', function() {
      console.log('Buy Now button clicked'); // Debugging
      addToCartFromAccsOrBrand(this);
    });
  });
}
// Function to attach event listeners to "Buy Now" buttons
function attachBuyNowEventListeners2() {
  document.querySelectorAll('.button-acc22').forEach(button => {
    button.addEventListener('click', function() {
      console.log('Buy Now button clicked'); // Debugging
      addToCartFromAccsOrBrand(this);
    });
  });
}

// Function to add product to cart from eyeglasses or sunglasses sections
function addToCart(button) {
  const productDiv = button.closest('.contant-containar-all');
  const productId = productDiv.querySelector('.sale-h7').textContent;

  const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];

  // Check if the product already exists in the cart
  const existingProductIndex = selectedProducts.findIndex(product => product.id === productId);
  if (existingProductIndex > -1) {
    // If the product exists, increase the quantity by 1
    selectedProducts[existingProductIndex].quantity += 1;
  } else {
    // If the product does not exist, add it with quantity 1
    const productName = productDiv.querySelector('.name-all').textContent;
    const productImg = productDiv.querySelector('img').src;
    const productDescription = productDiv.querySelector('.lens-type-dive').textContent;
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

// Function to add product to cart from accessories or brand sections
function addToCartFromAccsOrBrand(button) {
  const productDiv = button.closest('.div-accs');
  const productId = productDiv.querySelector('.sale-h7').textContent;

  const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];

  // Check if the product already exists in the cart
  const existingProductIndex = selectedProducts.findIndex(product => product.id === productId);
  if (existingProductIndex > -1) {
    // If the product exists, increase the quantity by 1
    selectedProducts[existingProductIndex].quantity += 1;
  } else {
    // If the product does not exist, add it with quantity 1
    const productName = productDiv.querySelector('.accs-h4').textContent;
    const productImg = productDiv.style.backgroundImage.slice(5, -2); // Extract image URL from background-image
    const productDescription = productDiv.querySelector('.discription').textContent.split("one year warranty")[0];
    const productSale = productDiv.querySelectorAll('.sale-h6')[1].textContent.replace('%', '');
    const productPrice = productDiv.querySelector('.prive-with-sele2').textContent.replace(' EG', '');

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

// Fetch products from Firebase and display all products
fetchProductsFromFirebase();