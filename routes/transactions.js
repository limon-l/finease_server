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

router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch transaction" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update transaction" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
});

export default router;
