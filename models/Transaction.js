import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    email: { type: String, required: true },
    name: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
