import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword
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
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {

  const role = document.getElementById("role");
  const workerFields = document.getElementById("workerFields");
  const registerBtn = document.getElementById("registerBtn");

  if(role){

    role.addEventListener("change", () => {

      if(role.value === "worker"){
        workerFields.style.display = "block";
      }else{
        workerFields.style.display = "none";
      }

    });

  }

  registerBtn.addEventListener("click", async () => {

    try{

      const name =
        document.getElementById("name").value.trim();

      const email =
        document.getElementById("email").value.trim();

      const mobile =
        document.getElementById("mobile").value.trim();

      const whatsapp =
        document.getElementById("whatsapp").value.trim();

      const password =
        document.getElementById("password").value;

      const roleValue =
        document.getElementById("role").value;

      const city =
        document.getElementById("city").value.trim();

      const skill =
        document.getElementById("skill")?.value.trim() || "";

      const wage =
        document.getElementById("wage")?.value.trim() || "";

      const experience =
        document.getElementById("experience")?.value.trim() || "";

      if(
        !name ||
        !email ||
        !mobile ||
        !password ||
        !roleValue
      ){
        alert("Please fill all required fields");
        return;
      }

      registerBtn.disabled = true;
      registerBtn.innerText = "Creating Account...";

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await addDoc(
        collection(db, "users"),
        {
          uid: userCredential.user.uid,

          name: name,
          email: email,
          mobile: mobile,
          whatsapp: whatsapp,

          role: roleValue,

          city: city,

          skill: skill,
          wage: wage,
          experience: experience,

          availability: "Available",

          createdAt: new Date()
        }
      );

      alert("Registration Successful");

      window.location.href = "login.html";

    }catch(error){

      console.error(error);
      alert(error.message);

    }finally{

      registerBtn.disabled = false;
      registerBtn.innerText = "Create Account";

    }

  });

});
import {
  getAuth,
  signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const auth = getAuth();

document.getElementById("logoutBtn")
.addEventListener("click", async () => {

  await signOut(auth);

  window.location.href = "login.html";

});