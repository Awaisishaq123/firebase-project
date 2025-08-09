import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
        import {
          getFirestore,
          collection,
          addDoc,
          getDocs,
          doc,
          getDoc,
          onSnapshot
        } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

        // Firebase Config
   const firebaseConfig = {
    apiKey: "AIzaSyBokbTtDucp5tO_5jjTaSNIi-4zk-OqrWg",
    authDomain: "authentication-dashboard-e2039.firebaseapp.com",
    projectId: "authentication-dashboard-e2039",
    storageBucket: "authentication-dashboard-e2039.firebasestorage.app",
    messagingSenderId: "1000959311145",
    appId: "1:1000959311145:web:059f9b0de50a095a45cb38",
    measurementId: "G-2CX47QTV51"
  };;
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Cart icon
        let cartitem = document.getElementById("addrocart");
        let cartCount = document.querySelector(".cart-count");

        // Track cart items count
        function updateCartCount() {
            onSnapshot(collection(db, "addtocart"), (snapshot) => {
                cartCount.textContent = snapshot.size;
                
                
                if (snapshot.size > 0) {
                    cartCount.style.transform = "scale(1.2)";
                    setTimeout(() => {
                        cartCount.style.transform = "scale(1)";
                    }, 300);
                }
            });
        }

        updateCartCount();

    
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
                        <button onclick='addtocart("${docSnap.id}", "${data.name}", ${data.price}, "${data.description}", "${data.image}")' class="add-to-cart-btn">
                            <i class="fas fa-cart-plus"></i>
                            Add to Cart
                        </button>
                    </div>
                </div>
                `;
            });
        }
        showdata();

    
        cartitem.addEventListener("click", () => {
            
            cartitem.style.transform = "scale(0.95)";
            setTimeout(() => {
                cartitem.style.transform = "scale(1)";
                window.location.href = "Addtocart.html";
            }, 150);
        });

        
        async function addtocart(id, name, price, description, image) {
            try {
                const docRef = await addDoc(collection(db, "addtocart"), {
                    productId: id,
                    name: name,
                    price: price,
                    description: description,
                    image: image,
                    timestamp: new Date()
                });
                
                // Create and show notification
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
                notification.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <span>${name} added to cart!</span>
                `;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.transform = "translateX(0)";
                }, 10);
                
                setTimeout(() => {
                    notification.style.transform = "translateX(200%)";
                    setTimeout(() => notification.remove(), 300);
                }, 3000);
                
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }

        // Make addtocart available globally for onclick
        window.addtocart = addtocart;