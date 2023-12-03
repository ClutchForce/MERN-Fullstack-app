import mongoose from "mongoose";
import { reviewSchema } from "./Review.js"; 

//List needs to inclue 
//-----------------------
//name of list REQUIRED
//nickname of user [auto generated]
//discription NON-REQUIRED
//list of superheroes (accepts id string OR name) REQUIRED
//Last modification date [auto generated]
//isPublic Required [auto set to private]
//number of heroes in list [auto generated]
//average rating [auto generated]
//list of comments [empty untill filled]
//list of ratings [empty untill filled]

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
