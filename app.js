import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

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
const auth = getAuth(app);

// Sign Up Functionality
let sbtn = document.getElementById("sbtn");
if (sbtn) {
  sbtn.addEventListener("click", () => {
    let email = document.getElementById("semail").value.trim();
    let password = document.getElementById("spassword").value.trim();

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all fields!",
        timer:2000,
      });
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Account created successfully!",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.href = "login.html";
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        let friendlyMessage = "An error occurred. Please try again.";
        if (errorCode === "auth/email-already-in-use") {
          friendlyMessage = "This email is already in use.";
        } else if (errorCode === "auth/weak-password") {
          friendlyMessage = "Password should be at least 6 characters.";
        } else if (errorCode === "auth/invalid-email") {
          friendlyMessage = "Please enter a valid email address.";
        }

        Swal.fire({
          icon: "error",
          title: "Sign Up Failed",
          text: friendlyMessage,
        });
      });
  });
}

// Login Functionality
let lbtn = document.getElementById("lbtn");
if (lbtn) {
  lbtn.addEventListener("click", () => {
    let email = document.getElementById("lemail").value.trim();
    let password = document.getElementById("lpassword").value.trim();

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all fields!",
      });
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Swal.fire({
          icon: "success",
          title: "Welcome Back User!",
          text: "You have successfully logged in.",
          showConfirmButton: false,
          timer: 1500,
          color: "black",
        }).then(() => {
          if (
            (email === "admin1@gmail.com" && password === "123456") ||
            (email === "admin@gmail.com" && password === "042111")
          ) {
            window.location.href = "dashboard.html";
          } else {
            window.location.href = "userdashboard.html";
          }
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        // const errorMessage = error.message;

        let messages = "Invalid email or password. Please try again.";
        if (errorCode === "auth/user-not-found") {
          messages = "No account found with this email.";
        } else if (errorCode === "auth/wrong-password") {
          messages = "Incorrect password. Please try again.";
        }

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: messages,
        });
      });
  });
}
