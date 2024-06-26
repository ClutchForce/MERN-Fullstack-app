import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter, verifyToken, verifyAdmin } from "./routes/user.js";
import { herolistsRouter } from "./routes/herolists.js";
import { heroinfoRouter } from "./routes/heroinfo.js"; // Import the superhero info router
import { policiesRouter } from "./routes/policies.js";
import path from "path";
import { fileURLToPath } from 'url'; // Import the required method


// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../../client/build')));

app.use("/auth", userRouter);
app.use("/api/open/herolists", herolistsRouter);
app.use("/api/open/superheroes", heroinfoRouter); // Use the superhero info router

// Middleware to verify token for secure routes
app.use("/api/secure", verifyToken);

// Routes after this will require authentication
app.use("/api/secure/herolists", herolistsRouter);
app.use("/api/secure/users", userRouter);
app.use("/api/secure/policies", policiesRouter);
// Additional secure routes...

// Admin-specific routes
app.use('/api/admin', verifyToken, verifyAdmin);

app.use('/api/admin/users', userRouter);
app.use('/api/admin/herolists', herolistsRouter);
app.use('/api/admin/policies', policiesRouter);

mongoose.connect(
  "mongodb://localhost:27017/se3316Lab4",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

app.listen(PORT, () => console.log("Server started"));

