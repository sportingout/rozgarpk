import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
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

let currentUser = null;
let ownerName = "Customer"; // Default fallback
let ownerMobile = "";       // Default fallback

const postJobBtn = document.getElementById("postJobBtn");

// Shuru mein button ko disable rakhein jab tak login status check na ho jaye
if (postJobBtn) {
  postJobBtn.disabled = true;
  postJobBtn.innerText = "Loading profile...";
}

/* Auth Check */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  try {
    const q = query(
      collection(db, "users"),
      where("uid", "==", user.uid)
    );

    const snap = await getDocs(q);

    snap.forEach((docSnap) => {
      const data = docSnap.data();
      ownerName = data.name || "Customer";
      ownerMobile = data.mobile || "";
    });

    // Profile data load hone ke baad button active karein
    if (postJobBtn) {
      postJobBtn.disabled = false;
      postJobBtn.innerText = "🚀 Post Job";
    }

  } catch (error) {
    console.error("Error fetching user data:", error);
    // Error ki surat mein bhi button enable kar dein taake user block na ho
    if (postJobBtn) {
      postJobBtn.disabled = false;
      postJobBtn.innerText = "🚀 Post Job";
    }
  }
});

/* Post Job Event */
if (postJobBtn) {
  postJobBtn.addEventListener("click", async () => {
    if (!currentUser) {
      alert("Please wait while we verify your session.");
      return;
    }

    try {
      const title = document.getElementById("jobTitle").value.trim();
      const selectedCategory = document.getElementById("jobCategory").value;
      const customCategory = document.getElementById("customCategory").value.trim();
      const city = document.getElementById("city").value.trim();
      const budget = document.getElementById("budget").value.trim();
      const inputMobile = document.getElementById("mobile").value.trim(); // Form input mobile
      const description = document.getElementById("description").value.trim();

      let finalCategory = selectedCategory;

      if (selectedCategory === "Other") {
        if (!customCategory) {
          alert("Please enter your custom category");
          return;
        }
        finalCategory = customCategory;
      }

      // Validation check
      if (
        !title ||
        !finalCategory ||
        !city ||
        !budget ||
        !inputMobile ||
        !description
      ) {
        alert("Please fill all fields");
        return;
      }

      // Double clicking se bachne ke liye posting phase mein button disable karein
      postJobBtn.disabled = true;
      postJobBtn.innerText = "Posting...";

      await addDoc(
        collection(db, "jobs"),
        {
          uid: currentUser.uid,
          ownerName: ownerName,
          // Agar profile wala mobile update karna chahein to ownerMobile use karein,
          // warna user ka input kiya hua mobile insert karein:
          mobile: inputMobile || ownerMobile, 
          title: title,
          category: finalCategory,
          city: city,
          budget: budget,
          description: description,
          status: "Open",
          createdAt: serverTimestamp()
        }
      );

      alert("Job Posted Successfully ✅");
      window.location.href = "jobs.html";

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      // Kisi bhi error ki soorat mein button wapis working ho jaye
      if (postJobBtn) {
        postJobBtn.disabled = false;
        postJobBtn.innerText = "🚀 Post Job";
      }
    }
  });
}