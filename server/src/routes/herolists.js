import express from "express";
import mongoose from "mongoose";
import { HeroListsModel } from "../models/HeroLists.js";
import { ReviewModel } from "../models/Review.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";
import { verifyAdmin } from "./user.js";
import { validationResult } from "express-validator";

const router = express.Router();

// open routes

router.get("/", async (req, res) => {
  try {
    const result = await HeroListsModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});


// Get the first 10 public herolists by date modified
router.get("/public", async (req, res) => {
  try {
    const result = await HeroListsModel.find({ isPublic: true })
      .sort({ lastModified: -1 })
      .limit(10);
    //Debug log with apis name and result
    //console.log("herolists/public", result);
    res.status(200).json(result);
  } catch (err) {
    console.log("herolists/public ERROR",err);
    res.status(500).json(err);
  }
});

//Secure routes


// Create a new herolist
router.post("/", verifyToken, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await UserModel.findById(req.body.userOwner);
  const herolist = new HeroListsModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    heronamelist: req.body.heronamelist,
    isPublic: req.body.isPublic,
    lastModified: req.body.lastModified,
    averageRating: req.body.averageRating,
    comments: req.body.comments,
    ratings: req.body.ratings,
    nickname: user.nickname,
    userOwner: req.body.userOwner,
  });

  try {
    const result = await herolist.save();
    res.status(201).json({
      createdHeroList: {
        name: result.name,
        description: result.description,
        heronamelist: result.heronamelist,
        isPublic: result.isPublic,
        lastModified: result.lastModified,
        averageRating: result.averageRating,
        comments: result.comments,
        ratings: result.ratings,
        nickname: result.nickname,
        _id: result._id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get the private herolists of a given user by user id
router.get("/savedHeroLists/:userId", verifyToken, async (req, res) => {
  try {
    const result = await HeroListsModel.find({ userOwner: req.params.userId })
      .sort({ lastModified: -1 })
      .limit(20);
    //console.log("/savedHeroLists/:userId",result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/deleteSavedList/:herolistId", verifyToken, async (req, res) => {
  try {
    const herolistId = req.params.herolistId;

    // Delete the hero list
    const result = await HeroListsModel.findByIdAndDelete(herolistId);

    // Delete associated reviews
    await ReviewModel.deleteMany({ herolistId: herolistId });

    res.status(200).json(result);
  } catch (err) {
    console.log("deleteSavedList/:herolistId ERROR", err);
    res.status(500).json(err);
  }
});


router.post("/review", verifyToken, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userID, herolistId, comment, ratingNumber } = req.body;
    const user = await UserModel.findById(userID);
    const herolist = await HeroListsModel.findById(herolistId);

    // Create a new review for embedding
    const embeddedReview = {
      userId: userID,
      comment: comment,
      rating: ratingNumber,
      nickname: user.nickname,
      createdAt: new Date()
    };

    // Save the review in the separate Review collection
    const newReview = new ReviewModel({
      userId: userID,
      herolistId,
      comment,
      rating: ratingNumber,
      createdAt: new Date(),
      hidden: false // Default to not hidden
    });
    await newReview.save();

    // Add the embedded review to the hero list
    herolist.reviews.push(embeddedReview);

    // Update average rating, excluding hidden reviews
    const visibleReviews = await ReviewModel.find({ 
      herolistId: herolistId, 
      hidden: false 
    });
    const totalRating = visibleReviews.reduce((acc, curr) => acc + curr.rating, 0);
    herolist.averageRating = totalRating / visibleReviews.length;

    await herolist.save();

    res.status(201).json(newReview);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding review" });
  }
});


// Update a herolist by ID
router.put("/updateList/:herolistId", verifyToken, async (req, res) => {
  try {
    const herolistId = req.params.herolistId;
    const { name, description, heronamelist, isPublic } = req.body;

    //Before updating, checks if list exists and if the user making the request is the owner of the list.
    //prevents users from editing lists that they do not own.
    const existingList = await HeroListsModel.findById(herolistId);
    if (!existingList) {
      return res.status(404).json({ message: 'List not found' });
    }

    if (existingList.userOwner.toString() !== req.userID.toString()) {
      return res.status(403).json({ message: 'Unauthorized to edit this list' });
    }

    // Inside the updateList route
    const updatedList = await HeroListsModel.findByIdAndUpdate(
      herolistId,
      {
        $set: {
          name, 
          description, 
          heronamelist, 
          isPublic, 
          lastModified: new Date()
        }
      },
      { new: true }
    );

    res.status(200).json(updatedList);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error updating list', error: err });
  }
});

//Admin routes

// Hide a review
router.put("/hideReview/:reviewId", verifyToken, verifyAdmin, async (req, res) => {
  // Implementation to hide review
  try{
    const review = await ReviewModel.findByIdAndUpdate(
      req.params.reviewId,
      { $set: { hidden: true } },
      { new: true }
    );
    res.status(200).json(review);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error hiding review', error: err });
  }
});

// Unhide a review
router.put("/unhideReview/:reviewId", verifyToken, verifyAdmin, async (req, res) => {
  // Implementation to unhide review
  try{
    const review = await ReviewModel.findByIdAndUpdate(
      req.params.reviewId,
      { $set: { hidden: false } },
      { new: true }
    );
    res.status(200).json(review);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error unhiding review', error: err });
  }
});

// Get all reviews
router.get("/getReviews", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reviews = await ReviewModel.find().lean(); // Use lean() for better performance

    // Enhance each review with the user's nickname
    for (const review of reviews) {
      const user = await UserModel.findById(review.userId); // Assuming 'userId' is the field in ReviewModel
      if (user) {
        review.nickname = user.nickname; // Add the nickname to the review
      } else {
        review.nickname = 'Unknown'; // In case user is not found
      }
    }
    res.json(reviews);
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



export { router as herolistsRouter };

