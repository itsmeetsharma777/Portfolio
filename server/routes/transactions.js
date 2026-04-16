import express from "express";
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

const router = express.Router();

function getUserId(request, response) {
  const userId = request.header("x-user-id");

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    response.status(401).json({ message: "Valid user id is required." });
    return null;
  }

  return userId;
}

router.get("/", async (request, response) => {
  const userId = getUserId(request, response);
  if (!userId) {
    return;
  }

  const transactions = await Transaction.find({ userId }).sort({ date: -1, createdAt: -1 });
  response.json({ transactions });
});

router.post("/", async (request, response) => {
  const userId = getUserId(request, response);
  if (!userId) {
    return;
  }

  const transaction = await Transaction.create({
    userId,
    type: request.body.type,
    amount: request.body.amount,
    desc: request.body.desc,
    cat: request.body.cat,
    date: request.body.date,
    account: request.body.account
  });

  response.status(201).json({ transaction });
});

router.put("/:id", async (request, response) => {
  const userId = getUserId(request, response);
  if (!userId) {
    return;
  }

  const transaction = await Transaction.findOneAndUpdate(
    { _id: request.params.id, userId },
    {
      type: request.body.type,
      amount: request.body.amount,
      desc: request.body.desc,
      cat: request.body.cat,
      date: request.body.date,
      account: request.body.account
    },
    { new: true, runValidators: true }
  );

  if (!transaction) {
    response.status(404).json({ message: "Transaction not found." });
    return;
  }

  response.json({ transaction });
});

router.delete("/:id", async (request, response) => {
  const userId = getUserId(request, response);
  if (!userId) {
    return;
  }

  const transaction = await Transaction.findOneAndDelete({ _id: request.params.id, userId });
  if (!transaction) {
    response.status(404).json({ message: "Transaction not found." });
    return;
  }

  response.json({ ok: true });
});

export default router;
