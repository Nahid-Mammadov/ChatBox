const form = document.getElementById("resetForm");
const notify = document.getElementById("notifyBox");

// FontAwesome eye toggle
const toggleResetPassword = document.getElementById("toggleResetPassword");
const newPasswordInput = document.getElementById("newPassword");

toggleResetPassword.addEventListener("click", () => {
  const isPassword = newPasswordInput.type === "password";
  newPasswordInput.type = isPassword ? "text" : "password";

  toggleResetPassword.classList.toggle("fa-eye");
  toggleResetPassword.classList.toggle("fa-eye-slash");
});

// Notification
function showNotify(message, type = "success") {
  notify.textContent = message;
  notify.style.borderLeft =
    type === "success" ? "4px solid #4CAF50" : "4px solid #e74c3c";

  notify.classList.remove("hidden");
  setTimeout(() => notify.classList.add("show"), 10);

  setTimeout(() => {
    notify.classList.remove("show");
    setTimeout(() => notify.classList.add("hidden"), 300);
  }, 2500);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value.trim();
  const userId = localStorage.getItem("resetUserId");

  // Validation
  if (!newPassword) {
    showNotify("Password cannot be empty!", "error");
    return;
  }

  if (newPassword.length < 6) {
    showNotify("Password must be at least 6 characters!", "error");
    return;
  }

  if (!userId) {
    showNotify("Missing user ID!", "error");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:8080/api/admin/reset-password/${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      showNotify(data.message, "error");
      return;
    }

    showNotify("Password successfully changed! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } catch (err) {
    console.log(err);
    showNotify("Server error!", "error");
  }
});
