import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
getFirestore,
collection,
query,
where,
getDocs
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
getAuth,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

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

const container =
document.getElementById("applicationsContainer");

onAuthStateChanged(auth, async(user)=>{

if(!user){
window.location.href="login.html";
return;
}

try{

const q = query(
collection(db,"applications"),
where("workerUid","==",user.uid)
);

const snap = await getDocs(q);

container.innerHTML="";

if(snap.empty){

container.innerHTML=`
<div class="card">
No Applications Found
</div>
`;

return;
}

snap.forEach(doc=>{

const appData = doc.data();

container.innerHTML += `
<div class="card">

<p><b>Job ID:</b>
${appData.jobId}
</p>

<p>
<b>Status:</b>

<span class="status">
${appData.status}
</span>

</p>

</div>
`;

});

}catch(error){

console.error(error);

container.innerHTML=`
<div class="card">
Error Loading Data
</div>
`;

}

});