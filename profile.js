import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
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

let userDocRef = null;
let currentRole = "";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const q = query(
      collection(db, "users"),
      where("uid", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Profile not found");
      return;
    }

    querySnapshot.forEach((docSnap) => {

      userDocRef = docSnap.ref;

      const data = docSnap.data();

      currentRole = data.role || "";

      document.getElementById("name").value =
        data.name || "";

      document.getElementById("mobile").value =
        data.mobile || "";

      document.getElementById("whatsapp").value =
        data.whatsapp || "";

      document.getElementById("city").value =
        data.city || "";

      document.getElementById("skill").value =
        data.skill || "";

      document.getElementById("wage").value =
        data.wage || "";

      document.getElementById("experience").value =
        data.experience || "";

      document.getElementById("availability").value =
        data.availability || "Available";

      // Customer Fields Hide
      if(currentRole !== "worker"){

        document.getElementById("skill").style.display = "none";

        document.getElementById("wage").style.display = "none";

        document.getElementById("experience").style.display = "none";

        document.getElementById("availability").style.display = "none";

      }

    });

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

});

document.getElementById("saveBtn")
.addEventListener("click", async () => {

  try {

    if (!userDocRef) {

      alert("User profile not found");
      return;

    }

    const updateData = {

      name:
        document.getElementById("name").value.trim(),

      mobile:
        document.getElementById("mobile").value.trim(),

      whatsapp:
        document.getElementById("whatsapp").value.trim(),

      city:
        document.getElementById("city").value.trim()

    };

    if(currentRole === "worker"){

      updateData.skill =
        document.getElementById("skill").value.trim();

      updateData.wage =
        document.getElementById("wage").value.trim();

      updateData.experience =
        document.getElementById("experience").value.trim();

      updateData.availability =
        document.getElementById("availability").value;

    }

    await updateDoc(userDocRef, updateData);

    alert("✅ Profile Updated Successfully");

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

});

document.getElementById("logoutBtn")
.addEventListener("click", async () => {

  try {

    await signOut(auth);

    window.location.href = "login.html";

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

});