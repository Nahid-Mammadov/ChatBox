const form = document.getElementById("registerForm");
const notifyBox = document.getElementById("notifyBox");

// Modern notification function
function showNotify(message, type = "success") {
    notifyBox.textContent = message;
    notifyBox.className = `notify show ${type}`;
    
    setTimeout(() => {
        notifyBox.classList.remove("show");
    }, 3000);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstname = document.getElementById("regFirstname").value.trim();
    const lastname = document.getElementById("regLastname").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    // 🔥 VALIDATION — boş input varsa
    if (!firstname || !lastname || !email || !password) {
        showNotify("Please fill in all fields!", "error");
        return;
    }

    // 🔥 E-mail format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showNotify("Invalid email format!", "error");
        return;
    }

    // 🔥 Password min length
    if (password.length < 6) {
        showNotify("Password must be at least 6 characters!", "error");
        return;
    }

    const body = { firstname, lastname, email, password };

    try {
        const res = await fetch("http://localhost:8080/api/admin/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            showNotify(data.message, "error");
            return;
        }

        showNotify("Registration successful!", "success");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } catch (err) {
        console.log(err);
        showNotify("Server error", "error");
    }
});
