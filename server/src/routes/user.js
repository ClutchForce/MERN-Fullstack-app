import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const router = express.Router();
import { UserModel } from "../models/Users.js";
import { body, validationResult } from "express-validator";

// open routes


router.post("/register", [
  body("username").notEmpty().withMessage("Username is required"),
  body("nickname").notEmpty().withMessage("Nickname is required"),
  body("password").notEmpty().withMessage("Password is required"),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, nickname, password } = req.body;

  const user = await UserModel.findOne({ username });
  if (user) {
    return res.status(400).json({ message: "Username/Email already exists" });
  }
  const userN = await UserModel.findOne({ nickname });
  if (userN) {
    return res.status(400).json({ message: "Nickname already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const emailToken = crypto.randomBytes(16).toString('hex');
  const newUser = new UserModel({ username, nickname, password: hashedPassword, emailToken });
  await newUser.save();
  res.json({ message: "User registered successfully", emailToken });
});

router.get("/verify-email/:token", async (req, res) => {
  console.log('Verifying email');
  const { token } = req.params;
  const user = await UserModel.findOne({ emailToken: token });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired email verification token" });
  }

  user.emailVerified = true;
  user.emailToken = null;
  await user.save();

  res.json({ message: "Email verified successfully" });
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
    return res.status(400).json({ message: "Account is deactivated, please contact Admin (contact is in about section)" });
  }
  if (!user.emailVerified) {
    return res.status(400).json({ message: "Email is not verified, please check your email for the validation link" });
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

export const verifyAdmin = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
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

// Disable a user account
router.put("/disable/:userId", verifyToken, verifyAdmin, async (req, res) => {
  // Implementation to disable user
  try {
    // Find user by ID and update isDisabled field to true
    const user = await UserModel.findByIdAndUpdate(
      req.params.userId,
      { $set: { isDisabled: true } },
      { new: true }
    );
    res.status(200).json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error disabling user', error: err });
  }
});

// Enable a user account
router.put("/enable/:userId", verifyToken, verifyAdmin, async (req, res) => {
  // Implementation to enable user
  try {
    // Find user by ID and update isDisabled field to false
    const user = await UserModel.findByIdAndUpdate(
      req.params.userId,
      { $set: { isDisabled: false } },
      { new: true }
    );
    res.status(200).json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error enabling user', error: err });
  }
});

// Give a user admin privileges
router.put("/upgrade/:userId", verifyToken, verifyAdmin, async (req, res) => {
  // Implementation to upgrade user
  console.log("upgrade user", req.params.userId);
  try {
    // Find user by ID and update isAdmin field to true
    const user = await UserModel.findByIdAndUpdate(
      req.params.userId,
      { $set: { isAdmin: true } },
      { new: true }
    );
    res.status(200).json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error upgrading user to admin', error: err });
  }
});

// Get all users
router.get("/getUsers", verifyToken, verifyAdmin, async (req, res) => {
  // Implementation to get all users

  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Server error' });
  }

});

//Get nickname by userID
router.get("/getNickname/:userId", verifyToken, verifyAdmin, async (req, res) => {
  // Implementation to get nickname
  try {
    const user = await UserModel.findById(req.params.userId);
    res.json(user.nickname);
  } catch (error) {
    console.error('Error getting nickname:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


export { router as userRouter };

