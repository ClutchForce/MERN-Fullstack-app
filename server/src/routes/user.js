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
    return res.status(400).json({ message: "Account is deactivated, please contact Admin (contact is in about section)" });
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

// Disable a user account
router.put("/disable/:userId", async (req, res) => {
  // Implementation to disable user
  console.log("disable user", req.params.userId);
  try {
    // Find user by ID and update isDisabled field to true
    const user = await UserModel.findByIdAndUpdate(
      req.params.userId,
      { $set: { isDisabled: true } },
      { new: true }
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error disabling user', error: err });
  }
});

// Enable a user account
router.put("/enable/:userId", async (req, res) => {
  // Implementation to enable user
  console.log("enable user", req.params.userId);
  try {
    // Find user by ID and update isDisabled field to false
    const user = await UserModel.findByIdAndUpdate(
      req.params.userId,
      { $set: { isDisabled: false } },
      { new: true }
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error enabling user', error: err });
  }
});

// Give a user admin privileges
router.put("/upgrade/:userId", async (req, res) => {
  // Implementation to upgrade user
  console.log("upgrade user", req.params.userId);
  try {
    // Find user by ID and update isAdmin field to true
    const user = await UserModel.findByIdAndUpdate(
      req.params.userId,
      { $set: { isAdmin: true } },
      { new: true }
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error upgrading user to admin', error: err });
  }
});

// Get all users
router.get("/getUsers", async (req, res) => {
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
router.get("/getNickname/:userId", async (req, res) => {
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

