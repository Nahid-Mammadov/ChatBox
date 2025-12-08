const stars = document.querySelectorAll("#starContainer i");
const submitBtn = document.getElementById("submitBtn");
const reviewList = document.getElementById("reviewsList");
let rating = 0;

// ⭐ Ulduz seçimi
stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    rating = index + 1;
    stars.forEach((s, i) => s.classList.toggle("active", i < rating));
  });
});

// 🌀 Rəyləri API-dən yüklə
async function loadReviews() {
  const res = await fetch("http://localhost:8080/api/reviews/all");
  const data = await res.json();

  reviewList.innerHTML = "";

  if (!data.length) {
    reviewList.innerHTML = `<div class="swiper-slide"><p>Hələlik rəy yoxdur.</p></div>`;
  } else {
    // Avatar mənbələri – müxtəlif stillər (cartoon, AI, initials, gradient)
    const avatarSources = [
      "https://api.dicebear.com/7.x/adventurer/svg?seed=",
      "https://api.dicebear.com/7.x/identicon/svg?seed=",
      "https://api.dicebear.com/7.x/fun-emoji/svg?seed=",
      "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=",
      "https://api.dicebear.com/7.x/lorelei/svg?seed=",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=",
      "https://api.dicebear.com/7.x/personas/svg?seed=",
      "https://api.dicebear.com/7.x/thumbs/svg?seed=",
    ];

    data.forEach((r, index) => {
      const avatarType =
        avatarSources[Math.floor(Math.random() * avatarSources.length)];
      const avatarUrl = `${avatarType}${encodeURIComponent(
        r.name || "User" + index
      )}`;

      const slide = document.createElement("div");
      slide.classList.add("swiper-slide", "review-card");
      slide.innerHTML = `
        <img src="${avatarUrl}" alt="avatar" />
        <div class="card-content">
          <h4>${r.name}</h4>
          <p>“${r.text}”</p>
          <div class="stars">
            ${'<i class="fa-solid fa-star" style="color:#ffcc00"></i>'.repeat(
              r.rating
            )}
          </div>
        </div>`;
      reviewList.appendChild(slide);
    });
  }

  new Swiper(".reviews-swiper", {
    slidesPerView: 2.5,
    spaceBetween: 30,
    loop: true,
    autoplay: { delay: 2500, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1200: { slidesPerView: 2.5 },
    },
  });
}

// 💬 Yeni rəy göndər
// 💬 Yeni rəy göndər
submitBtn.addEventListener("click", async () => {
  const name = document.getElementById("nameInput").value.trim();
  const text = document.getElementById("reviewInput").value.trim();

  // Məsələn, localStorage-də login olunmuş user məlumatı saxlanır:
const user = JSON.parse(localStorage.getItem("user"));
const email =
  user?.email ||
  user?.user?.email ||
  localStorage.getItem("loggedEmail") ||
  "guest@example.com";


  // Emailə görə stabil avatar yaradırıq:
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;

  if (!name || !text || rating === 0) {
    alert("Zəhmət olmasa ad, rəy və ulduz daxil edin!");
    return;
  }

  const res = await fetch("http://localhost:8080/api/reviews/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, text, rating, avatar }),
  });

  if (res.ok) {
    await loadReviews();
    document.getElementById("nameInput").value = "";
    document.getElementById("reviewInput").value = "";
    stars.forEach((s) => s.classList.remove("active"));
    rating = 0;
  } else {
    alert("Xəta baş verdi!");
  }
});


// 📊 Say göstəriciləri animasiyası
const counters = document.querySelectorAll(".counter");
let started = false;

function animateCounters() {
  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    const speed = 30;
    const update = () => {
      const value = +counter.innerText;
      const inc = Math.ceil(target / 80);
      if (value < target) {
        counter.innerText = value + inc;
        setTimeout(update, speed);
      } else {
        counter.innerText = target + "+";
      }
    };
    update();
  });
}

window.addEventListener("scroll", () => {
  const rect = document.querySelector(".about-section").getBoundingClientRect();
  if (!started && rect.top < window.innerHeight - 100) {
    animateCounters();
    started = true;
  }
});

window.addEventListener("load", () => {
  loadReviews();
  const rect = document.querySelector(".about-section").getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    animateCounters();
    started = true;
  }
});
