import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";

const app = express();
const PORT = 5000;
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("FinEase Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
