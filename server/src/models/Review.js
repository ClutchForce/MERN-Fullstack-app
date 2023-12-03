import mongoose from "mongoose";

export const reviewSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: String,
  rating: {
    type: Number,
    required: true,
  },
  nickname: String, // Add nickname here
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
