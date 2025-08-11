import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
let goback = document.getElementById("goback");
goback.addEventListener("click", () => {
  window.location.href = "userdashboard.html";
});
const button = document.querySelector("button");
button.addEventListener("mouseenter", function () {
  this.querySelector("span").style.left = "100%";
});
button.addEventListener("mouseleave", function () {
  this.querySelector("span").style.left = "-100%";
});
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let cartItem = document.getElementById("loadcart");

async function showdata() {
  const querySnapshot = await getDocs(collection(db, "addtocart"));
  querySnapshot.forEach((doc, index) => {
    let data = doc.data();

    cartItem.innerHTML += `
              <div class="cart-item" style="animation-delay: ${index * 0.1}s">
                <div class="image-container">
                  <img src="${data.image}" alt="${data.name}" />
                </div>
                <div class="cart-item-content">
                  <h5>${data.name}</h5>
                  <p>${data.description}</p>
                  <div class="price">$${data.price}</div>
                  <div class="cart-actions">
                    <button class="remove-btn" onclick="removeItem('${
                      doc.id
                    }')">Remove</button>
                    
                  </div>
                </div>
              </div>
            `;
  });
}

showdata();

async function removeItem(id) {
  cartItem.innerHTML = "";

  await deleteDoc(doc(db, "addtocart", id));
  showdata();
}

window.removeItem = removeItem; // Expose function globally
