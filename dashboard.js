import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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

const workersContainer =
document.getElementById("workersContainer");

async function loadWorkers() {

  workersContainer.innerHTML =
  "<h3>Loading Workers...</h3>";

  try {

    const querySnapshot =
    await getDocs(collection(db, "users"));

    workersContainer.innerHTML = "";

    let count = 0;

    querySnapshot.forEach((doc) => {

      const worker = doc.data();

      if (worker.role === "worker") {

        count++;

        workersContainer.innerHTML += `

        <div class="worker-card">

          <h3>${worker.name || ""}</h3>

          <p><b>Skill:</b> ${worker.skill || ""}</p>

          <p><b>City:</b> ${worker.city || "Not Added"}</p>

          <p><b>Daily Wage:</b> Rs. ${worker.wage || ""}</p>

          <p><b>Experience:</b> ${worker.experience || ""}</p>

          <a
          class="hire-btn"
          href="https://wa.me/${worker.whatsapp || ""}?text=Assalam%20o%20Alaikum,%20mujhe%20aap%20ki%20service%20chahiye."
          target="_blank">
          Hire Worker
          </a>

        </div>

        `;

      }

    });

    if (count === 0) {

      workersContainer.innerHTML =
      "<h3>No Workers Found</h3>";

    }

    setupSearch();

  } catch (error) {

    console.error(error);

    workersContainer.innerHTML =
    "<h3>Error Loading Workers</h3>";

  }

}

function setupSearch() {

  const skillInput =
  document.getElementById("searchSkill");

  const cityInput =
  document.getElementById("searchCity");

  function filterWorkers() {

    const skill =
    skillInput.value.toLowerCase();

    const city =
    cityInput.value.toLowerCase();

    const cards =
    document.querySelectorAll(".worker-card");

    cards.forEach(card => {

      const text =
      card.innerText.toLowerCase();

      if (
        text.includes(skill) &&
        text.includes(city)
      ) {

        card.style.display = "block";

      } else {

        card.style.display = "none";

      }

    });

  }

  skillInput.addEventListener(
    "input",
    filterWorkers
  );

  cityInput.addEventListener(
    "input",
    filterWorkers
  );

}

loadWorkers();