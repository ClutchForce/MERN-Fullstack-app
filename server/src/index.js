import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/user.js";
import { herolistsRouter } from "./routes/herolists.js";
import { heroinfoRouter } from "./routes/heroinfo.js"; // Import the superhero info router


const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/api/open/herolists", herolistsRouter);
app.use("/api/open/superheroes", heroinfoRouter); // Use the superhero info router


mongoose.connect(
  "mongodb://localhost:27017/se3316Lab4",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.listen(3001, () => console.log("Server started"));
