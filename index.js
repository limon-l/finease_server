import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import transactionsRoutes from "./routes/transactions.js";
import Transaction from "./models/Transaction.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const allowedOrigins = [
  "https://dreamy-raindrop-4eae32.netlify.app",
  "http://localhost:5173",
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      if (!allowedOrigins.includes(cleanOrigin)) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/transactions", transactionsRoutes);

app.get("/transactions", async (req, res) => {
  try {
    const { email } = req.query;
    const transactions = await Transaction.find({ email });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

app.get("/transactions/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid transaction ID" });
  }

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    res.status(200).json(transaction);
  } catch (err) {
    console.error("Error fetching transaction:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching transaction" });
  }
});

app.get("/transactions/category-total", async (req, res) => {
  try {
    const { email, category } = req.query;
    if (!email || !category)
      return res.status(400).json({ message: "Missing parameters" });

    const result = await Transaction.aggregate([
      { $match: { email: email, category: category } },
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    const total = result[0] ? result[0].total : 0;
    res.json({ total });
  } catch (err) {
    console.error("Error in category-total:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

app.get("/", (req, res) => res.send("FinEase Backend running successfully!"));

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
