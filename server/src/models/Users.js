import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedHeroLists: [{ type: mongoose.Schema.Types.ObjectId, ref: "HeroList" }],
});

export const UserModel = mongoose.model("users", UserSchema);
