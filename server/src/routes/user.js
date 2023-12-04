import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();
import { UserModel } from "../models/Users.js";

router.post("/register", async (req, res) => {
  const { username, nickname, password } = req.body;
  //TODO: make sure that username and nickname are unique
  const user = await UserModel.findOne({ username });
  if (user) {
    return res.status(400).json({ message: "Username or Nickname already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  //TODO: add input validation here
  const newUser = new UserModel({ username, nickname, password: hashedPassword });
  await newUser.save();
  res.json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }
  if (user.isDisabled) {
    return res.status(400).json({ message: "Account is deactivated, please contact Admin" });
  }
  //Token payload
  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, "secret");
  res.json({ token, userID: user._id });
});

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, "secret", (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      // Attach user ID to the request
      req.userID = decoded.id; // Assuming 'id' is the user ID field in the token payload
      req.isAdmin = decoded.isAdmin;
      next();
    });
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

router.get('/checkAdmin', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userID);
    const isAdmin = user?.isAdmin || false;
    res.json({ isAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export { router as userRouter };

