import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (request, response) => {
  try {
    const username = request.body.username?.trim();
    const password = request.body.password;

    if (!username || !password || password.length < 4) {
      return response.status(400).json({ message: "Username and 4+ character password are required." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return response.status(409).json({ message: "Username is already taken." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash });

    return response.status(201).json({
      user: {
        _id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    return response.status(500).json({ message: "Unable to register user." });
  }
});

router.post("/login", async (request, response) => {
  try {
    const username = request.body.username?.trim();
    const password = request.body.password;

    const user = await User.findOne({ username });
    if (!user) {
      return response.status(404).json({ message: "Account not found. Please sign up." });
    }

    const matches = await bcrypt.compare(password || "", user.passwordHash);
    if (!matches) {
      return response.status(401).json({ message: "Incorrect password. Please try again." });
    }

    return response.json({
      user: {
        _id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    return response.status(500).json({ message: "Unable to log in." });
  }
});

export default router;
