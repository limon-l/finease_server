import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ message: "Failed to create transaction" });
  }
});

router.get("/category-total", async (req, res) => {
  try {
    const { category, email } = req.query;
    if (!category || !email) {
      return res
        .status(400)
        .json({ message: "Category and email are required" });
    }

    const transactions = await Transaction.find({ category, email });
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    res.json({ category, total });
  } catch (err) {
    console.error("Error calculating category total:", err);
    res.status(500).json({ message: "Failed to calculate category total" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { email, sort } = req.query;
    const sortOption = sort === "amount" ? { amount: -1 } : { date: -1 };
    const transactions = await Transaction.find({ email }).sort(sortOption);
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(transaction);
  } catch (err) {
    console.error("Error fetching transaction:", err);
    res.status(500).json({ message: "Failed to fetch transaction" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updated);
  } catch (err) {
    console.error("Error updating transaction:", err);
    res.status(500).json({ message: "Failed to update transaction" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
});

export default router;
