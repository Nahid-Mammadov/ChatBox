const form = document.getElementById("verifyForm");
const notifyBox = document.getElementById("notifyBox");

// Modern notification
function showNotify(message, type = "success") {
  notifyBox.textContent = message;
  notifyBox.className = `notify show ${type}`;

  setTimeout(() => {
    notifyBox.classList.remove("show");
  }, 3000);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = localStorage.getItem("resetEmail");
  const code = document.getElementById("code").value.trim();

  // 🔥 Validation — boş kod
  if (!code) {
    showNotify("Please enter the verification code!", "error");
    return;
  }

  // 🔥 6 rəqəm kontrol
  if (!/^\d{6}$/.test(code)) {
    showNotify("Code must be 6 digits!", "error");
    return;
  }

  try {
    const res = await fetch("http://localhost:8080/api/admin/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      showNotify(data.message, "error");
      return;
    }

    // 🔥 Uğurlu kod doğrulaması
    showNotify("Code verified! Redirecting...", "success");

    // user ID saxla
    localStorage.setItem("resetUserId", data.userId);

    // Reset səhifəsinə keçid
    setTimeout(() => {
      window.location.href = "reset.html";
    }, 1500);
  } catch (err) {
    console.log(err);
    showNotify("Server error", "error");
  }
});
