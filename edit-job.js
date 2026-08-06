import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
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
  appId: "1:260861416467:web:0e5ba645c9301a53b79be6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const params = new URLSearchParams(window.location.search);
const jobId = params.get("id");

if (!jobId) {
  alert("Job ID Missing");
  window.location.href = "my-jobs.html";
}

// HTML element IDs ko standard HTML file ke mutabiq sahi kiya:
const categorySelect = document.getElementById("jobCategory"); // 'category' se change kar ke 'jobCategory' kiya
const customCategory = document.getElementById("customCategory");
const updateBtn = document.getElementById("updateJobBtn"); // 'updateBtn' se change kar ke 'updateJobBtn' kiya

// Edit Form ko show karne ke liye (taake page loading ke waqt smooth dikhe)
const editForm = document.getElementById("editForm");
const loadingText = document.getElementById("loadingText");

// Dropdown Change event setup
if (categorySelect) {
  categorySelect.addEventListener("change", () => {
    if (categorySelect.value === "Other") {
      customCategory.style.display = "block";
    } else {
      customCategory.style.display = "none";
      customCategory.value = "";
    }
  });
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  loadJob();
});

async function loadJob() {
  try {
    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      alert("Job Not Found");
      window.location.href = "my-jobs.html";
      return;
    }

    const job = jobSnap.data();

    // Elements fill-up
    document.getElementById("jobTitle").value = job.title || "";
    document.getElementById("city").value = job.city || "";
    document.getElementById("budget").value = job.budget || "";
    document.getElementById("description").value = job.description || "";
    
    // Check if form has a mobile field (My-jobs aur database me save kiya hua mobile fetch karne ke liye)
    const mobileField = document.getElementById("mobile");
    if (mobileField) {
      mobileField.value = job.mobile || "";
    }

    const categories = [
      "Electrician",
      "Plumber",
      "Mason",
      "Painter",
      "Carpenter",
      "Welder",
      "AC Technician",
      "Solar Technician"
    ];

    if (categories.includes(job.category)) {
      categorySelect.value = job.category;
    } else {
      categorySelect.value = "Other";
      customCategory.style.display = "block";
      customCategory.value = job.category || "";
    }

    // Loader ko hide kar ke form ko show karein
    if (loadingText) loadingText.style.display = "none";
    if (editForm) editForm.style.display = "block";

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

// Form Submit Event
if (updateBtn) {
  updateBtn.addEventListener("click", async () => {
    try {
      const title = document.getElementById("jobTitle").value.trim();
      let category = categorySelect.value;

      if (category === "Other") {
        category = customCategory.value.trim();
        if (!category) {
          alert("Please Enter Custom Category");
          return;
        }
      }

      const city = document.getElementById("city").value.trim();
      const budget = document.getElementById("budget").value.trim();
      const description = document.getElementById("description").value.trim();
      
      const mobileField = document.getElementById("mobile");
      const mobile = mobileField ? mobileField.value.trim() : "";

      if (!title || !category || !city || !budget || !description) {
        alert("Please Fill All Fields");
        return;
      }

      // Safe update button display state
      updateBtn.disabled = true;
      updateBtn.innerText = "Saving Changes...";

      // Firestore update structure
      const updateData = {
        title,
        category,
        city,
        budget,
        description
      };

      // Agar form me mobile number update karne ki ijazat ho
      if (mobile) {
        updateData.mobile = mobile;
      }

      await updateDoc(doc(db, "jobs", jobId), updateData);

      alert("Job Updated Successfully ✅");
      window.location.href = "my-jobs.html";

    } catch (error) {
      console.error(error);
      alert(error.message);
      
      updateBtn.disabled = false;
      updateBtn.innerText = "💾 Save Changes";
    }
  });
}