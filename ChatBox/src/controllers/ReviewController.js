const Review = require("../models/ReviewModel");

// 🔹 Yeni rəy əlavə et
exports.addReview = async (req, res) => {
  try {
    let { name, email, avatar, text, rating, userId } = req.body;

    // Əgər email frontend-dən gəlməyibsə, localStorage-də saxlanılmış dəyəri yoxla
    if (!email && req.user) {
      email = req.user.email;
    }

    if (!name || !text || !rating)
      return res.status(400).json({ msg: "Bütün xanaları doldurun" });

    // Əgər avatar gəlməyibsə, email-ə görə avtomatik avatar təyin et
    if (!avatar && email) {
      avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        email
      )}`;
    }

    const review = new Review({ name, email, avatar, text, rating, userId });
    await review.save();
    res.status(201).json({ msg: "Rəy əlavə olundu", review });
  } catch (err) {
    res.status(500).json({ msg: "Server xətası", error: err.message });
  }
};

// 🔹 Bütün rəyləri gətir
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Xəta baş verdi" });
  }
};
