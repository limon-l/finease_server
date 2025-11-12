import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create transaction" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { email, sort } = req.query;
    const sortOption = sort === "amount" ? { amount: -1 } : { date: -1 };
    const transactions = await Transaction.find({ email }).sort(sortOption);
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

export default router;
