// ================= SOCKET.IO =================
const socket = io("http://localhost:8080");

// ================= USER INFO =================
const userId = localStorage.getItem("userId");
const userName = localStorage.getItem("userName");

// MƏCBURİ YOXLAMALAR — ƏGƏR YOXDURSA LOGINƏ QAYTAR
if (!userId || !userName) {
  alert("User info missing! Please login again.");
  window.location.href = "home.html";
}

// ================= ELEMENTS =================
const messageInput = document.getElementById("messageInput");
const messagesContainer = document.getElementById("messagesContainer");
const sendMessageBtn = document.getElementById("sendMessageBtn");
const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");
const logoutBtn = document.getElementById("logoutBtn");
const userList = document.getElementById("userList");
const searchUser = document.getElementById("searchUser");

let currentReceiver = null;

// ================= USER CONNECT =================
socket.emit("user_connected", {
  userId: userId,
  userName: userName,
});

// ================= LOAD USERS =================
async function loadUsers() {
  const res = await fetch("http://localhost:8080/api/admin");
  const users = await res.json();

  renderUserList(users);

  searchUser.addEventListener("input", () => {
    const filtered = users.filter((u) =>
      (u.firstname + " " + u.lastname)
        .toLowerCase()
        .includes(searchUser.value.toLowerCase())
    );
    renderUserList(filtered);
  });
}

function renderUserList(list) {
  userList.innerHTML = "";

  list.forEach((u) => {
    if (u._id === userId) return;

    userList.innerHTML += `
      <div class="user" onclick="openChat('${u._id}', '${u.firstname} ${u.lastname}')">
        <img src="https://i.pravatar.cc/150?u=${u._id}" />
        <div><h4>${u.firstname} ${u.lastname}</h4></div>
        <span class="status online"></span>
      </div>
    `;
  });
}

loadUsers();

// ================= OPEN CHAT =================
window.openChat = async function (receiverId, receiverName) {
  currentReceiver = receiverId;

  document.getElementById("chatUserName").innerText = receiverName;

  messagesContainer.innerHTML = "";

  const res = await fetch(
    `http://localhost:8080/api/chat/messages?user1=${userId}&user2=${receiverId}`
  );

  const data = await res.json();
  data.forEach(addMessageToUI);
};

// ================= SEND MESSAGE =================
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || !currentReceiver) return;

  socket.emit("send_message", {
    senderId: userId,
    senderName: userName,
    receiverId: currentReceiver,
    message: text,
  });

  messageInput.value = "";
}

sendMessageBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// ================= RECEIVE MESSAGE =================
socket.on("receive_message", (msg) => {
  if (
    (msg.senderId === currentReceiver && msg.receiverId === userId) ||
    (msg.senderId === userId && msg.receiverId === currentReceiver)
  ) {
    addMessageToUI(msg);
  }
});

// ================= ADD MESSAGE TO UI =================
function addMessageToUI(msg) {
  const isMine = msg.senderId === userId;

  const time = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const div = document.createElement("div");
  div.classList.add("message", isMine ? "outgoing" : "incoming");

  div.innerHTML = `
    ${
      !isMine ? `<img src="https://i.pravatar.cc/150?u=${msg.senderId}" />` : ""
    }
    <div>
      <p>${msg.message}</p>
      <span class="msg-time">${time}</span>
    </div>
  `;

  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ================= EMOJI PICKER =================
emojiBtn.addEventListener("click", () => {
  emojiPicker.classList.toggle("hidden");
});

emojiPicker.addEventListener("click", (e) => {
  if (e.target.tagName === "SPAN") {
    messageInput.value += e.target.innerText;
  }
});

// ================= LOGOUT =================
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "home.html";
});
