const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/search", require("./routes/searchRoutes"));

app.get("/", (req, res) => {
  res.send("Search API running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));