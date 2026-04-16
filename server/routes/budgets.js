import express from "express";
import mongoose from "mongoose";
import Budget from "../models/Budget.js";

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

  const docs = await Budget.find({ userId }).sort({ category: 1 });
  const budgets = docs.reduce((accumulator, item) => {
    accumulator[item.category] = item.limit;
    return accumulator;
  }, {});

  response.json({ budgets });
});

router.put("/:category", async (request, response) => {
  const userId = getUserId(request, response);
  if (!userId) {
    return;
  }

  const category = decodeURIComponent(request.params.category);
  const limit = Number(request.body.limit);

  if (!limit || limit <= 0) {
    response.status(400).json({ message: "A valid limit is required." });
    return;
  }

  await Budget.findOneAndUpdate(
    { userId, category },
    { userId, category, limit },
    { upsert: true, new: true, runValidators: true }
  );

  const docs = await Budget.find({ userId }).sort({ category: 1 });
  const budgets = docs.reduce((accumulator, item) => {
    accumulator[item.category] = item.limit;
    return accumulator;
  }, {});

  response.json({ budgets });
});

router.delete("/:category", async (request, response) => {
  const userId = getUserId(request, response);
  if (!userId) {
    return;
  }

  const category = decodeURIComponent(request.params.category);
  await Budget.findOneAndDelete({ userId, category });

  const docs = await Budget.find({ userId }).sort({ category: 1 });
  const budgets = docs.reduce((accumulator, item) => {
    accumulator[item.category] = item.limit;
    return accumulator;
  }, {});

  response.json({ budgets });
});

export default router;
