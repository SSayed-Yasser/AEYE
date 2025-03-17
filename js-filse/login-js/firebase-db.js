// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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

// Check if user details are already remembered
window.onload = function() {
  if (localStorage.getItem('rememberedEmail') && localStorage.getItem('rememberedPassword')) {
  document.getElementById('loginemail').value = localStorage.getItem('rememberedEmail');
  document.getElementById('loginpass').value = localStorage.getItem('rememberedPassword');
  document.getElementById('remember-me').checked = true;
  }
  };

// Sign-Up Section
const signUpButton = document.getElementById('createAcc');
signUpButton.addEventListener('click', async (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  // Get input values
  const name = localStorage.getItem('nameSignup');
  const email = localStorage.getItem('emailSignup');
  const password = localStorage.getItem('passSignup');
  const phone = localStorage.getItem('phoneSignup');
  const address = localStorage.getItem('addressSignup');
  const fodSp = localStorage.getItem('odSp');
  const fodCy = localStorage.getItem('odCy');
  const fodAx = localStorage.getItem('odAx');
  const fosSp = localStorage.getItem('osSp');
  const fosCy = localStorage.getItem('osCy');
  const fosAx = localStorage.getItem('osAx');

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data to Firestore
    const userData = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      address: address,
      fodSp: fodSp,
      fodCy: fodCy,
      fodAx: fodAx,
      fosSp: fosSp,
      fosCy: fosCy,
      fosAx: fosAx
    };

    await setDoc(doc(db, "users", user.uid), userData);

    alert('User account created successfully!');
    console.log('User data saved successfully!');
    document.getElementById('createheader').style.color = '#000';
    document.getElementById('createmain').style.display = 'none';

    document.getElementById('loginheader').style.color = '#790000';
    document.getElementById('loginmain').style.display = 'block';

    document.getElementById('forgetheader').style.color = '#000';
    document.getElementById('forgetmain').style.display = 'none';
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      alert('The email address is already registered. Please use a different email.');
      document.getElementById('createheader').style.color = '#000';
      document.getElementById('createmain').style.display = 'none';

      document.getElementById('loginheader').style.color = '#790000';
      document.getElementById('loginmain').style.display = 'block';

      document.getElementById('forgetheader').style.color = '#000';
      document.getElementById('forgetmain').style.display = 'none';
    } else {
      console.error('Error creating user:', error);
      alert('Error creating user account. Please try again.');
    }
  }
});

// Login Section
const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', async () => {
  const email = document.getElementById('loginemail').value;
  const password = document.getElementById('loginpass').value;
  const rememberMe = document.getElementById('remember-me').checked;

  try {
    // Authenticate the user using Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Retrieve user data from Firestore
    const docRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(docRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();

      // التحقق من حالة الحساب (isActive)
      if (userData.isActive === false) {
        alert("الحساب موقوف. يرجى الاتصال بالدعم.");
        await auth.signOut(); // تسجيل الخروج إذا كان الحساب موقوفًا
        return;
      }

      // Save user data to localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('loginmethod', '555');

      // If "Remember Me" is checked, store email and password
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }

      // Redirect to account page
      window.location.href = './account.html';
      alert('Login successful!');
    } else {
      alert('No user data found in Firestore.');
    }
  } catch (error) {
    console.error('Error logging in:', error);

    // Handle specific errors
    if (error.code === 'auth/user-not-found') {
      alert('No user found with this email.');
    } else if (error.code === 'auth/wrong-password') {
      alert('Incorrect password.');
    } else {
      alert('Error logging in. Please try again.');
    }

    // Clear stored email and password if "Remember Me" is not checked
    if (!rememberMe) {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
    }
  }
});

// Display Stored Data
function displayStoredData() {
  const storedData = localStorage.getItem('userData');
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    displayData.innerHTML = `
      <p><strong>Email:</strong> ${parsedData.email}</p>
      <p><strong>Password:</strong> ${parsedData.password}</p>
      <p><strong>Name:</strong> ${parsedData.name}</p>
      <p><strong>Phone Number:</strong> ${parsedData.phone}</p>
      <p><strong>Address:</strong> ${parsedData.address}</p>
      <p><strong>Eyesight Measurement:</strong> ${parsedData.eyesight}</p>
    `;
  } else {
    displayData.innerHTML = '<p>No data found.</p>';
  }
}

// Display data on page load
displayStoredData();


// Reference to the Reset Password Button
const resetPasswordButton = document.getElementById('forgetButton');

resetPasswordButton.addEventListener('click', () => {
  // Get the email entered by the user
  const email = document.getElementById('forgetemail').value;

  // Validate the input
  if (!email) {
    alert('Please enter your email address.');
    return;
  }

  // Send password reset email using Firebase Authentication
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert('Password reset email sent! Check your inbox.');
    })
    .catch((error) => {
      // Handle errors
      if (error.code === 'auth/user-not-found') {
        alert('No user found with this email.');
      } else {
        console.error('Error sending password reset email:', error);
        alert('Error: ' + error.message);
      }
    });
});









