import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter, verifyToken } from "./routes/user.js";
import { herolistsRouter } from "./routes/herolists.js";
import { heroinfoRouter } from "./routes/heroinfo.js"; // Import the superhero info router

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/api/open/herolists", herolistsRouter);
app.use("/api/open/superheroes", heroinfoRouter); // Use the superhero info router

// Middleware to verify token for secure routes
app.use("/api/secure", verifyToken);

// Routes after this will require authentication
app.use("/api/secure/herolists", herolistsRouter);
app.use("/api/secure/users", userRouter);
// Additional secure routes...

// Admin-specific routes
app.use('/api/admin', verifyToken, verifyAdmin);

function verifyAdmin(req, res, next) {
  if (!req.isAdmin) {
    return res.status(403).json({ message: 'Access denied' });
  }
  // console.log('Admin verified');
  next();
}

app.use('/api/admin/users', userRouter);
app.use('/api/admin/herolists', herolistsRouter);

mongoose.connect(
  "mongodb://localhost:27017/se3316Lab4",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.listen(PORT, () => console.log("Server started"));
