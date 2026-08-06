import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD13C2N3R6b-lgr7HXipEicQKr7AinbHPA",
  authDomain: "rozgarconnect-69054.firebaseapp.com",
  projectId: "rozgarconnect-69054",
  storageBucket: "rozgarconnect-69054.firebasestorage.app",
  messagingSenderId: "260861416467",
  appId: "1:260861416467:web:0e5ba645c9301a53b79be6",
  measurementId: "G-P9HZ0BM40W"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {

  const savedEmail = localStorage.getItem("savedEmail");

  if (savedEmail) {
    document.getElementById("email").value = savedEmail;

    const remember =
      document.getElementById("rememberMe");

    if (remember) {
      remember.checked = true;
    }
  }

  document.getElementById("loginBtn")
    .addEventListener("click", async () => {

      const email =
        document.getElementById("email").value.trim();

      const password =
        document.getElementById("password").value;

      const rememberMe =
        document.getElementById("rememberMe").checked;

      try {

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        if (rememberMe) {

          localStorage.setItem(
            "savedEmail",
            email
          );

        } else {

          localStorage.removeItem(
            "savedEmail"
          );

        }

        alert("Login Successful");

        window.location.href =
          "dashboard.html";

      } catch (error) {

        console.error(error);

        alert(error.message);

      }

    });

});