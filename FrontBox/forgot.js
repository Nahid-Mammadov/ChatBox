const form = document.getElementById("forgotForm");
const notifyBox = document.getElementById("notifyBox");

// Notification funksiyası
function showNotify(message, type = "success") {
  notifyBox.textContent = message;
  notifyBox.className = `notify show ${type}`;

  setTimeout(() => {
    notifyBox.classList.remove("show");
  }, 3000);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  // 🔥 Validation — boş email
  if (!email) {
    showNotify("Please enter your email!", "error");
    return;
  }

  // 🔥 Email format yoxlaması
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showNotify("Invalid email format!", "error");
    return;
  }

  // 📌 Email-i yadda saxla (verify-code üçün lazımdır)
  localStorage.setItem("resetEmail", email);

  try {
    const res = await fetch("http://localhost:8080/api/admin/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      showNotify(data.message, "error");
      return;
    }

    // Uğurlu mesaj
    showNotify("Verification code sent to your email!", "success");

    // 1.5 saniyəyə verify-code səhifəsinə keçid
    setTimeout(() => {
      window.location.href = "verify-code.html";
    }, 1500);
  } catch (err) {
    console.log(err);
    showNotify("Server error", "error");
  }
});
