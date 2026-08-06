import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

/* Firebase Config */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "rozgarconnect-69054.firebaseapp.com",
  projectId: "rozgarconnect-69054",
  storageBucket: "rozgarconnect-69054.firebasestorage.app",
  messagingSenderId: "260861416467",
  appId: "1:260861416467:web:0e5ba645c9301a53b79be6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;

/* Current User */
onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

const jobsContainer = document.getElementById("jobsContainer");

/* Load Jobs */
async function loadJobs() {

  try {

    const querySnapshot =
      await getDocs(collection(db, "jobs"));

    jobsContainer.innerHTML = "";

    if (querySnapshot.empty) {

      jobsContainer.innerHTML = `
      <div class="job-card">
        <h3>No Jobs Found</h3>
      </div>
      `;

      return;
    }

    querySnapshot.forEach((docSnap) => {

      const job = docSnap.data();
      const jobId = docSnap.id;

      const whatsappText =
        encodeURIComponent(
          "Assalam o Alaikum, I am interested in your job."
        );

      jobsContainer.innerHTML += `

      <div class="job-card">

        <h3>${job.title || "No Title"}</h3>

        <p><b>📂 Category:</b> ${job.category || "-"}</p>

        <p><b>📍 City:</b> ${job.city || "-"}</p>

        <p><b>💰 Budget:</b> Rs. ${job.budget || "0"}</p>

        <p><b>📝 Description:</b> ${job.description || "-"}</p>

        <p><b>🟢 Status:</b>
          <span class="status">
            ${job.status || "Open"}
          </span>
        </p>

        <div style="display:flex;gap:8px;margin-top:15px;flex-wrap:wrap;">

          <a
            href="tel:${job.mobile || ''}"
            style="
            flex:1;
            background:#2563EB;
            color:white;
            padding:10px;
            text-align:center;
            border-radius:10px;
            text-decoration:none;
            font-weight:bold;
            ">
            📞 Call
          </a>

          <a
            href="https://wa.me/${job.mobile || ''}?text=${whatsappText}"
            target="_blank"
            style="
            flex:1;
            background:#22C55E;
            color:white;
            padding:10px;
            text-align:center;
            border-radius:10px;
            text-decoration:none;
            font-weight:bold;
            ">
            🟢 WhatsApp
          </a>

          <button
            onclick="applyJob('${jobId}','${job.uid}')"
            style="
            flex:1;
            background:#F59E0B;
            color:white;
            padding:10px;
            border:none;
            border-radius:10px;
            font-weight:bold;
            cursor:pointer;
            ">
            🚀 Apply
          </button>

        </div>

      </div>
      `;
    });

    setupSearch();

  } catch (error) {

    console.error(error);

    jobsContainer.innerHTML = `
    <div class="job-card">
      <h3>Error Loading Jobs</h3>
    </div>
    `;
  }
}

/* Search */
function setupSearch() {

  const searchCategory =
    document.getElementById("searchCategory");

  const searchCity =
    document.getElementById("searchCity");

  if (!searchCategory || !searchCity) return;

  function filterJobs() {

    const category =
      searchCategory.value.toLowerCase();

    const city =
      searchCity.value.toLowerCase();

    const cards =
      document.querySelectorAll(".job-card");

    cards.forEach(card => {

      const text =
        card.innerText.toLowerCase();

      card.style.display =
        text.includes(category) &&
        text.includes(city)
          ? "block"
          : "none";
    });
  }

  searchCategory.addEventListener(
    "input",
    filterJobs
  );

  searchCity.addEventListener(
    "input",
    filterJobs
  );
}

/* Apply Job */
window.applyJob = async function (jobId, ownerUid) {

  if (!currentUser) {

    alert("Please Login First");
    return;
  }

  try {

    await addDoc(
      collection(db, "applications"),
      {
        jobId: jobId,
        ownerUid: ownerUid,
        workerUid: currentUser.uid,
        status: "Pending",
        createdAt: serverTimestamp()
      }
    );

    alert("Application Submitted Successfully ✅");

  } catch (error) {

    console.error(error);
    alert(error.message);
  }
};

/* Start Loading Jobs */
loadJobs();