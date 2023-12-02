import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  herolistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HeroLists",
    required: true,
  },
  comment: String,
  rating: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
});

export const ReviewModel = mongoose.model("Review", reviewSchema);
