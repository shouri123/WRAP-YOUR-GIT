import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());

app.get("/api/github/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );
    res.json(response.data);
  } catch {
    res.status(500).json({ error: "GitHub fetch failed" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
