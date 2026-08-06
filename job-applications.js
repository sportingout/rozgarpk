import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc 
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

const container = document.getElementById("applicationsContainer");
let currentUser = null;

// Auth Check & Session Handle
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loadApplications();
  } else {
    window.location.href = "login.html";
  }
});

// Applications fetch karne ka function
async function loadApplications() {
  try {
    container.innerHTML = "Loading applications...";

    // 1. Pehle user ki post ki hui saari jobs ke IDs nikalen
    const jobsQuery = query(
      collection(db, "jobs"),
      where("uid", "==", currentUser.uid)
    );
    const jobsSnap = await getDocs(jobsQuery);
    
    const myJobIds = [];
    jobsSnap.forEach((docRef) => {
      myJobIds.push(docRef.id);
    });

    // Agar user ne koi job hi post nahi ki
    if (myJobIds.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 30px; color: #64748B;">
          <h3>No jobs posted yet.</h3>
          <p>Post a job first to receive applications.</p>
        </div>`;
      return;
    }

    // 2. Un jobs par aayi hui applications ko query karein
    // Firestore in-operator ke zariye dynamic filter lagayenge
    const appsQuery = query(
      collection(db, "applications"),
      where("jobId", "in", myJobIds)
    );
    
    const appsSnap = await getDocs(appsQuery);
    container.innerHTML = ""; // Loader clear karein

    let hasApplications = false;

    appsSnap.forEach((docRef) => {
      hasApplications = true;
      const appData = docRef.data();
      const appId = docRef.id;

      // Status badge styling logic
      let statusColor = "#64748B"; // Default Pending
      if (appData.status === "Accepted") statusColor = "#22C55E";
      if (appData.status === "Rejected") statusColor = "#EF4444";

      const statusBadge = `
        <span style="background: ${statusColor}15; color: ${statusColor}; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; float: right;">
          ${appData.status || "Pending"}
        </span>`;

      // Card Render Structure
      container.innerHTML += `
        <div class="card" id="app-${appId}">
          ${statusBadge}
          <h3 style="color: #1E3A5F; margin-bottom: 8px;">${appData.workerName || "Worker"}</h3>
          <p style="margin: 4px 0; font-size: 14px; color: #475569;"><b>💼 Applied For:</b> ${appData.jobTitle || "Job Post"}</p>
          <p style="margin: 4px 0; font-size: 14px; color: #475569;"><b>📞 Contact:</b> <a href="tel:${appData.workerMobile}">${appData.workerMobile || "N/A"}</a></p>
          <p style="margin: 4px 0; font-size: 14px; color: #475569;"><b>📝 Message:</b> ${appData.message || "No message provided."}</p>
          
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button class="btn accept" style="flex: 1;" onclick="updateStatus('${appId}', 'Accepted')">✅ Accept</button>
            <button class="btn reject" style="flex: 1;" onclick="updateStatus('${appId}', 'Rejected')">❌ Reject</button>
          </div>
        </div>
      `;
    });

    if (!hasApplications) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #64748B;">
          <h3>No applications received yet.</h3>
        </div>`;
    }

  } catch (error) {
    console.error("Error loading applications:", error);
    container.innerHTML = "<p style='color: red; text-align: center;'>Error loading applications. Please try again.</p>";
  }
}

// 🟢 Status change (Accept / Reject) handle karne ka function
window.updateStatus = async function(appId, newStatus) {
  try {
    const appRef = doc(db, "applications", appId);
    
    await updateDoc(appRef, {
      status: newStatus
    });

    alert(`Application has been ${newStatus}! 🎉`);
    loadApplications(); // Refresh list to update UI

  } catch (error) {
    console.error("Status update failed:", error);
    alert("Network sync failed. Please try again.");
  }
};