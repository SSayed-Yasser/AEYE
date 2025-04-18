// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signOut, deleteUser, updateProfile } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";


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
const auth = getAuth();
const db = getFirestore(app);

// Initialize cart count on page load
function updateCartCount() {
  const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
  const cartCount = selectedProducts.reduce((total, product) => total + product.quantity, 0);
  document.querySelector('#cart-count').textContent = cartCount;
}
updateCartCount();

function displayUserData() {
  const storedData = localStorage.getItem('userData');
  if (storedData) {
      const userData = JSON.parse(storedData);

      // Fill read-only fields
      document.getElementById('email').textContent = userData.email;
      document.getElementById('password').textContent = userData.password;
      document.getElementById('phone').textContent = userData.phone;

      // Fill editable fields
      document.getElementById('name').value = userData.name;
      document.getElementById('address').value = userData.address;

      // Fill the table
      document.getElementById('odSp').innerText = userData.fodSp;
      document.getElementById('odCy').innerText = userData.fodCy;
      document.getElementById('odAx').innerText = userData.fodAx;
      document.getElementById('osSp').innerText = userData.fosSp;
      document.getElementById('osCy').innerText = userData.fosCy;
      document.getElementById('osAx').innerText = userData.fosAx;
  }
}

displayUserData();

// حفظ التعديلات
document.getElementById('saveChangesButton').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;

  const user = auth.currentUser;
  const docRef = doc(db, "users", user.uid);

  try {
      await updateDoc(docRef, {
          name: name,
          address: address
      });

      const storedData = JSON.parse(localStorage.getItem('userData'));
      storedData.name = name;
      storedData.address = address;
      localStorage.setItem('userData', JSON.stringify(storedData));

      alert('Changes saved successfully!');
  } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
  }
});

// تسجيل الخروج
document.getElementById('logoutButton').addEventListener('click', async () => {
  try {
      await signOut(auth);
      localStorage.clear();
      alert('You have been logged out.');
      window.location.href = './login.html';
  } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to logout. Please try again.');
  }
});

// حذف الحساب
document.getElementById('deleteAccountButton').addEventListener('click', async () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
          const user = auth.currentUser;
          const userDocRef = doc(db, "users", user.uid);

          await deleteDoc(userDocRef);
          await deleteUser(user);

          localStorage.clear();
          alert('Your account has been deleted.');
          window.location.href = './login.html';
      } catch (error) {
          console.error('Error deleting account:', error);
          alert('Failed to delete account. Please try again.');
      }
  }
});