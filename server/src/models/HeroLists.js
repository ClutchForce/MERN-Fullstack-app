import mongoose from "mongoose";
import { reviewSchema } from "./Review.js"; 

const herolistSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  heronamelist: [
    {
      type: String,
      required: true,
    },
  ],
  isPublic: {
    type: Boolean,
    required: true,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  reviews: [reviewSchema],
  nickname: {
    type: String,
    required: true,
    // This will be populated from User model on retrieval
  },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const HeroListsModel = mongoose.model("HeroLists", herolistSchema);
