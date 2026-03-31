import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "vaultapp-53de4.firebaseapp.com",
  projectId: "vaultapp-53de4",
  storageBucket: "vaultapp-53de4.appspot.com",
  messagingSenderId: "451287362895",
  appId: "1:451287362895:web:a40a17e915745599ce293a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM
const form = document.getElementById("vaultForm");
const lista = document.getElementById("vaultList");

// GUARDAR
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;
  const nota = document.getElementById("nota").value;

  await addDoc(collection(db, "vault"), {
    titulo,
    usuario,
    contraseña: password,
    nota,
    fecha: new Date()
  });

  form.reset();
});

// TIEMPO REAL
onSnapshot(collection(db, "vault"), (snapshot) => {
  lista.innerHTML = "";

  snapshot.forEach((docItem) => {
    const item = docItem.data();
    const id = docItem.id;

    const li = document.createElement("li");
    const hiddenPassword = "•".repeat(item.contraseña.length);

    li.innerHTML = `
      <strong>${item.titulo}</strong><br>
      Usuario: ${item.usuario}<br>
      Contraseña: ${hiddenPassword}<br>
      Nota: ${item.nota || "-"}<br>
      Fecha: ${item.fecha?.toDate().toLocaleString() || ""}<br>

      <button onclick="navigator.clipboard.writeText('${item.usuario}')">Copiar Usuario</button>
      <button onclick="navigator.clipboard.writeText('${item.contraseña}')">Copiar Clave</button>
      <button onclick="eliminar('${id}')">Eliminar</button>
    `;

    lista.appendChild(li);
  });
});

// ELIMINAR
window.eliminar = async (id) => {
  if (confirm("¿Eliminar?")) {
    await deleteDoc(doc(db, "vault", id));
  }
};

// BUSCADOR
document.getElementById("searchInput").addEventListener("input", (e) => {
  const filtro = e.target.value.toLowerCase();

  document.querySelectorAll("#vaultList li").forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(filtro)
      ? "block"
      : "none";
  });
});

// GENERADOR
function generarPassword(base, length = 25) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?";
  let password = base.charAt(0).toUpperCase() + base.slice(1);

  while (password.length < length) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  return password;
}

document.getElementById("genAction").addEventListener("click", () => {
  const base = document.getElementById("passBase").value.trim();
  if (!base) return alert("Escribe algo");

  const results = document.getElementById("passResults");
  results.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const pass = generarPassword(base, 25);

    const div = document.createElement("div");
    div.innerHTML = `
      ${pass}
      <button onclick="navigator.clipboard.writeText('${pass}')">Copiar</button>
    `;
    results.appendChild(div);
  }
});

// LOCK
document.getElementById("unlockBtn").addEventListener("click", () => {
  const key = document.getElementById("accessKey").value;

  if (key === "212325") {
    document.getElementById("lockScreen").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
  } else {
    document.getElementById("errorMsg").style.display = "block";
  }
});







