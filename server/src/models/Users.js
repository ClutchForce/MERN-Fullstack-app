import mongoose from "mongoose";
import emailValidator from "email-validator"; // Correct import

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true ,
    validate: {
      validator: (value) => emailValidator.validate(value),
      message: 'Please fill a valid email address'
    }
  },
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
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailToken: {
    type: String,
    default: null,
  },
});

export const UserModel = mongoose.model("users", UserSchema);
