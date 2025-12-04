const API = "http://localhost:8080/api/admin";

const tableBody = document.getElementById("userTableBody");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const saveUserBtn = document.getElementById("saveUserBtn");
const notifyBox = document.getElementById("notifyBox");

let editUserId = null;
let deleteTargetId = null;

// NOTIFY
function showNotify(message, type = "success") {
  notifyBox.textContent = message;
  notifyBox.className = `notify show ${type}`;

  setTimeout(() => notifyBox.classList.remove("show"), 2500);
}

// LOAD EMAIL
document.getElementById("userEmail").textContent =
  localStorage.getItem("loggedEmail");

// OPEN ADD MODAL
document.getElementById("openAddModal").addEventListener("click", () => {
  modalTitle.textContent = "Add User";
  editUserId = null;
  modal.classList.remove("hidden");
});

// CLOSE MODAL
document.getElementById("closeModal").addEventListener("click", () => {
  modal.classList.add("hidden");
});

// LOAD USERS
async function loadUsers() {
  const res = await fetch(API);
  const users = await res.json();

  tableBody.innerHTML = "";

  users.forEach((u) => {
    tableBody.innerHTML += `
      <tr>
        <td>${u._id}</td>
        <td>${u.firstname}</td>
        <td>${u.lastname}</td>
        <td>${u.email}</td>
        <td>${u.password}</td>
        <td>
          <i class="fa-solid fa-pen action-btn" onclick="editUser('${u._id}')"></i>
          <i class="fa-solid fa-trash action-btn" onclick="openDeleteModal('${u._id}')"></i>
        </td>
      </tr>
    `;
  });
}

loadUsers();

// EDIT USER
window.editUser = async function (id) {
  const res = await fetch(`${API}/${id}`);
  const user = await res.json();

  editUserId = id;

  modalTitle.textContent = "Edit User";
  document.getElementById("modFirstname").value = user.firstname;
  document.getElementById("modLastname").value = user.lastname;
  document.getElementById("modEmail").value = user.email;
  document.getElementById("modPassword").value = "";

  modal.classList.remove("hidden");
};

// SAVE USER
saveUserBtn.addEventListener("click", async () => {
  const firstname = document.getElementById("modFirstname").value.trim();
  const lastname = document.getElementById("modLastname").value.trim();
  const email = document.getElementById("modEmail").value.trim();
  const password = document.getElementById("modPassword").value.trim();

  if (!firstname || !lastname || !email) {
    showNotify("All fields except password are required", "error");
    return;
  }

  const body = { firstname, lastname, email };
  if (password) body.password = password;

  if (editUserId) {
    await fetch(`${API}/${editUserId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    showNotify("User updated!", "success");
  } else {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    showNotify("User added!", "success");
  }

  modal.classList.add("hidden");
  loadUsers();
});

// DELETE USER
window.openDeleteModal = function (id) {
  deleteTargetId = id;
  deleteModal.classList.remove("hidden");
};

cancelDelete.addEventListener("click", () => {
  deleteModal.classList.add("hidden");
});

confirmDelete.addEventListener("click", async () => {
  await fetch(`${API}/${deleteTargetId}`, { method: "DELETE" });
  deleteModal.classList.add("hidden");
  showNotify("User deleted!", "delete");
  loadUsers();
});

// LOGOUT
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});
