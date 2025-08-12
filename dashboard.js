import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Initialize Bootstrap tooltips

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

// ADD PRODUCT
document.getElementById("addBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").value;

  if (name && price && description && image) {
    try {
      await addDoc(collection(db, "products"), {
        name,
        price,
        description,
        image,
        createdAt: new Date(),
      });

      showToast("Product added successfully!", "success");
      resetForm();
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("productModal")
      );
      modal.hide();
    } catch (error) {
      showToast("Error adding product: " + error.message, "danger");
    }
  } else {
    showToast("Please fill all fields!", "warning");
  }
});

// FETCH PRODUCTS IN REAL-TIME
function fetchProducts() {
  const productList = document.getElementById("productList");
  const emptyState = document.getElementById("emptyState");

  onSnapshot(collection(db, "products"), (querySnapshot) => {
    productList.innerHTML = "";

    if (querySnapshot.empty) {
      emptyState.classList.remove("d-none");
      productList.classList.add("d-none");
    } else {
      emptyState.classList.add("d-none");
      productList.classList.remove("d-none");

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const productCard = document.createElement("div");
        productCard.className = "col-md-4 animate__animated animate__fadeInUp";
        productCard.innerHTML = `
              <div class="card h-100">
                <img src="${
                  data.image ||
                  "https://via.placeholder.com/300x200?text=No+Image"
                }" class="card-img-top" height="200">
                <div class="card-body">
                  <h5 class="card-title">${data.name}</h5>
                  <p class="product-price">Rs. ${data.price}</p>
                  <p class="card-text text-muted">${data.description}</p>
                </div>
                <div class="card-footer bg-transparent border-0">
                  <button class="btn btn-sm btn-outline-warning me-2" 
                          onclick="editProduct('${docSnap.id}', '${
          data.name
        }', '${data.price}', '${data.description}', '${data.image}')"
                          data-bs-toggle="tooltip" data-bs-placement="top" title="Edit">
                    
                    Edit
                  </button>
                  <button class="btn btn-sm btn-outline-danger" 
                          onclick="deleteProduct('${docSnap.id}')"
                          data-bs-toggle="tooltip" data-bs-placement="top" title="Delete">
                    Delete
                        
                  </button>
                </div>
              </div>
            `;
        productList.appendChild(productCard);
      });
    }
  });
}

// DELETE PRODUCT
window.deleteProduct = async function (id) {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      await deleteDoc(doc(db, "products", id));
      showToast("Product deleted successfully!", "success");
    } catch (error) {
      showToast("Error deleting product: " + error.message, "danger");
    }
  }
};

// EDIT PRODUCT
window.editProduct = function (id, name, price, description, image) {
  document.getElementById("productId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("price").value = price;
  document.getElementById("description").value = description;
  document.getElementById("image").value = image;

  document.getElementById("modalTitle").textContent = "Edit Product";
  document.getElementById("addBtn").classList.add("d-none");
  document.getElementById("updateBtn").classList.remove("d-none");

  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
};

// UPDATE PRODUCT
document.getElementById("updateBtn").addEventListener("click", async () => {
  const id = document.getElementById("productId").value;
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").value;

  if (id && name && price && description && image) {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        name,
        price,
        description,
        image,
        updatedAt: new Date(),
      });

      showToast("Product updated successfully!", "success");
      resetForm();
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("productModal")
      );
      modal.hide();
    } catch (error) {
      showToast("Error updating product: " + error.message, "danger");
    }
  } else {
    showToast("Please fill all fields!", "warning");
  }
});

// Reset form
function resetForm() {
  document.getElementById("productId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("description").value = "";
  document.getElementById("image").value = "";

  document.getElementById("modalTitle").textContent = "Add Product";
  document.getElementById("addBtn").classList.remove("d-none");
  document.getElementById("updateBtn").classList.add("d-none");
}

// Show toast notification
function showToast(message, type) {
  const toastContainer = document.createElement("div");
  toastContainer.className = `toast align-items-center text-white bg-${type} border-0 position-fixed bottom-0 end-0 m-3`;
  toastContainer.setAttribute("role", "alert");
  toastContainer.setAttribute("aria-live", "assertive");
  toastContainer.setAttribute("aria-atomic", "true");
  toastContainer.style.zIndex = "1100";

  toastContainer.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      `;

  document.body.appendChild(toastContainer);
  const toast = new bootstrap.Toast(toastContainer);
  toast.show();

  // Remove toast after it's hidden
  toastContainer.addEventListener("hidden.bs.toast", function () {
    document.body.removeChild(toastContainer);
  });
}

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  fetchProducts();

  // Reset form when modal is hidden
  document
    .getElementById("productModal")
    .addEventListener("hidden.bs.modal", resetForm);
});
