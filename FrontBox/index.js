const form = document.getElementById("loginForm");

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";

  passwordInput.type = isHidden ? "text" : "password";

  togglePassword.classList.toggle("fa-eye");
  togglePassword.classList.toggle("fa-eye-slash");
});

// Notification
const notify = document.getElementById("notifyBox");

function showNotify(message, type = "success") {
  notify.textContent = message;
  notify.style.borderLeft =
    type === "success" ? "4px solid #4CAF50" : "4px solid #ff4444";

  notify.classList.remove("hidden");
  setTimeout(() => notify.classList.add("show"), 10);

  setTimeout(() => {
    notify.classList.remove("show");
    setTimeout(() => notify.classList.add("hidden"), 300);
  }, 2500);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch("http://localhost:8080/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    showNotify(data.message, "error");
    return;
  }

  showNotify("Login successful!", "success");

  // ================================
  // 🔥 Chat üçün user məlumatını saxla
  // ================================
  const user = data.user;

  localStorage.setItem("userId", user._id);
  localStorage.setItem("userName", `${user.firstname} ${user.lastname}`);
  localStorage.setItem("loggedEmail", user.email);

  // 2 saniyə sonra yönləndir
  setTimeout(() => {
    window.location.href = "./Home.html";
  }, 1200);
});
