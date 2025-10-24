import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBokbTtDucp5tO_5jjTaSNIi-4zk-OqrWg",
  authDomain: "authentication-dashboard-e2039.firebaseapp.com",
  projectId: "authentication-dashboard-e2039",
  storageBucket: "authentication-dashboard-e2039.firebasestorage.app",
  messagingSenderId: "1000959311145",
  appId: "1:1000959311145:web:059f9b0de50a095a45cb38",
  measurementId: "G-2CX47QTV51",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

let currentUid = null;
let cartItems = new Set(); // product IDs in cart
const cartCountEl = document.querySelector(".cart-count");

// Run when user is logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  currentUid = user.uid;
  updateCartCount();
  watchCartItems();
});

// Logout Button
let logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been logged out successfully!",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.href = "login.html"; 
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Logout Failed",
          text: error.message,
        });
      });
  });
}

// Track cart items count
function updateCartCount() {
  const q = query(
    collection(db, "addtocart"),
    where("uid", "==", currentUid)
  );

  onSnapshot(q, (snapshot) => {
    cartCountEl.textContent = snapshot.size;

    if (snapshot.size > 0) {
      cartCountEl.style.transform = "scale(1.2)";
      setTimeout(() => {
        cartCountEl.style.transform = "scale(1)";
      }, 300);
    }
  });
}

// Watch cart for enabling/disabling buttons
function watchCartItems() {
  const q = query(collection(db, "addtocart"), where("uid", "==", currentUid));
  onSnapshot(q, (snapshot) => {
    cartItems.clear();
    snapshot.forEach((doc) => {
      cartItems.add(doc.data().productId);
    });
    updateProductButtons();
  });
}

// Update product buttons based on cart items
function updateProductButtons() {
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    const productId = btn.getAttribute("data-id");
    if (cartItems.has(productId)) {
      btn.disabled = true;
      btn.textContent = "In Cart";
    } else {
      btn.disabled = false;
      btn.innerHTML = `<i class="fas fa-cart-plus"></i> Add to Cart`;
    }
  });
}

// Fetch and display products
async function showdata() {
  const querySnapshot = await getDocs(collection(db, "products"));
  let productcard = document.getElementById("fetchproduct");

  querySnapshot.forEach((docSnap, index) => {
    let data = docSnap.data();
    productcard.innerHTML += `
      <div class="product-card" style="animation-delay: ${index * 0.1}s">
        <div class="product-image">
          <img src="${data.image}" alt="${data.name}">
          <span class="product-badge">New</span>
        </div>
        <div class="product-content">
          <h3 class="product-title">${data.name}</h3>
          <div class="product-price">$${data.price}</div>
          <p class="product-description">${data.description}</p>
          <button data-id="${docSnap.id}" onclick='addtocart("${docSnap.id}", "${data.name}", ${data.price}, "${data.description}", "${data.image}")' class="add-to-cart-btn">
            <i class="fas fa-cart-plus"></i>
            Add to Cart
          </button>
        </div>
      </div>
    `;
  });

  updateProductButtons(); // update after products loaded
}
showdata();

// Go to cart page
let cartitem = document.getElementById("addrocart");
if (cartitem) {
  cartitem.addEventListener("click", () => {
    cartitem.style.transform = "scale(0.95)";
 Swal.fire({
          icon: "success",
          title: "product success",
          text: "Your have been successfully!",
          showConfirmButton: false,
          timer: 1000,
        })

    setTimeout(() => {
      cartitem.style.transform = "scale(1)";
      window.location.href = "Addtocart.html";
    }, 1500);
  });
}

// Add to cart
async function addtocart(id, name, price, description, image) {
  try {
    const user = auth.currentUser;
    // console.log(user)
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in to add items to your cart.",
      });
      return;
    }

    await addDoc(collection(db, "addtocart"), {
      uid: user.uid,
      productId: id,
      name: name,
      price: price,
      description: description,
      image: image,
      timestamp: new Date(),
    });

    showNotification(`${name} added to cart!`);

  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// Notification function
function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #4BB543;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    transform: translateX(200%);
    transition: transform 0.3s ease;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  notification.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 10);

  setTimeout(() => {
    notification.style.transform = "translateX(200%)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

window.addtocart = addtocart;
