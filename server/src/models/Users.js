import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedHeroLists: [{ type: mongoose.Schema.Types.ObjectId, ref: "HeroList" }],
  nickname: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

export const UserModel = mongoose.model("users", UserSchema);
