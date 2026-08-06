import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { 
  getAuth, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// Firebase Configuration
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

const jobsContainer = document.getElementById("jobsContainer");
let currentUser = null;

// Auth check aur jobs loading
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loadMyJobs();
  } else {
    window.location.href = "login.html"; // Login page redirect
  }
});

// User ki post ki hui jobs load karne ka function
async function loadMyJobs() {
  try {
    jobsContainer.innerHTML = "Loading your jobs...";
    
    // Query: Sirf wahi jobs nikalen jiska uid current user ke uid se match karta ho
    const q = query(
      collection(db, "jobs"), 
      where("uid", "==", currentUser.uid)
    );
    
    const querySnapshot = await getDocs(q);
    jobsContainer.innerHTML = ""; // Clear loader
    
    let hasJobs = false;

    querySnapshot.forEach((docRef) => {
      hasJobs = true;
      const job = docRef.data();
      const jobId = docRef.id;

      // Status badge logic
      const statusColor = job.status === "Open" ? "#22C55E" : "#64748B";
      const statusBadge = `<span style="background: ${statusColor}15; color: ${statusColor}; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold; margin-left: 10px;">${job.status || "Open"}</span>`;

      // Close button logic: Agar job pehle se Closed hai to button disabled hoga
      const closeBtnHTML = job.status !== "Closed" 
        ? `<button class="close-btn" onclick="closeJob('${jobId}')">📴 Close Job</button>`
        : `<button class="close-btn" style="background: #CBD5E1; cursor: not-allowed;" disabled>Already Closed</button>`;

      // Card Render with Edit, Close and Delete buttons
      jobsContainer.innerHTML += `
        <div class="job-card" id="card-${jobId}">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2 style="color: #1E3A5F; font-size: 18px;">${job.title || "Job Title"}</h2>
            ${statusBadge}
          </div>
          <p style="margin-top: 10px; color: #475569;"><b>📂 Category:</b> ${job.category || "Not Added"}</p>
          <p style="margin-top: 5px; color: #475569;"><b>📍 City:</b> ${job.city || "Not Added"}</p>
          <p style="margin-top: 5px; color: #475569;"><b>💰 Budget/Salary:</b> Rs. ${job.budget || "0"}</p>
          <p style="margin-top: 5px; color: #475569;"><b>📝 Description:</b> ${job.description || "No description provided."}</p>
          
          <div class="btns">
            ${closeBtnHTML}
            
            <a class="edit-btn" href="edit-job.html?id=${jobId}" style="flex:1; background:#2563EB; color:white; padding:10px; border-radius:10px; text-decoration:none; text-align:center; font-size:14px; font-weight:bold; display:flex; align-items:center; justify-content:center;">📝 Edit Job</a>
            
            <button class="delete-btn" onclick="deleteJob('${jobId}')">🗑️ Delete Job</button>
          </div>
        </div>
      `;
    });

    if (!hasJobs) {
      jobsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #64748B;">
          <h3>You haven't posted any jobs yet.</h3>
          <a href="post-job.html" style="display: inline-block; margin-top: 15px; background: #22C55E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">Post a Job Now</a>
        </div>
      `;
    }

  } catch (error) {
    console.error("Error loading jobs:", error);
    jobsContainer.innerHTML = "<p style='color: red; text-align: center;'>Failed to load jobs. Please try again.</p>";
  }
}

// 📴 Job Status "Closed" karne ka function
window.closeJob = async function(jobId) {
  if (confirm("Are you sure you want to close this job? Workers will no longer apply.")) {
    try {
      const jobRef = doc(db, "jobs", jobId);
      await updateDoc(jobRef, {
        status: "Closed"
      });
      alert("Job closed successfully.");
      loadMyJobs(); // List refresh
    } catch (error) {
      console.error("Error closing job:", error);
      alert("Failed to close job. Try again.");
    }
  }
};

// 🗑️ Job Delete karne ka function
window.deleteJob = async function(jobId) {
  if (confirm("Are you sure you want to permanently delete this job post?")) {
    try {
      const jobRef = doc(db, "jobs", jobId);
      await deleteDoc(jobRef);
      alert("Job deleted successfully.");
      loadMyJobs(); // List refresh
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job. Try again.");
    }
  }
};