const express = require("express");
const path = require("path");
const app = express();
const PORT = 3030;

// Frontend fayllarını serve et
app.use(express.static(path.join(__dirname, "/")));

app.listen(PORT, () => {
  console.log(`Frontend running at http://localhost:${PORT}`);
});
