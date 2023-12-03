import express from "express";
import mongoose from "mongoose";
import { HeroListsModel } from "../models/HeroLists.js";
import { ReviewModel } from "../models/Review.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await HeroListsModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new herolist
router.post("/", verifyToken, async (req, res) => {
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
router.get("/savedHeroLists/:userId", async (req, res) => {
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

// Delete a herolist by ID of list 
router.delete("/deleteSavedList/:herolistId", async (req, res) => {
  try {
    console.log("deleteSavedList/:herolistId", req.params.herolistId);
    const result = await HeroListsModel.findByIdAndDelete(req.params.herolistId);
    res.status(200).json(result);
  } catch (err) {
    console.log("deleteSavedList/:herolistId ERROR", err);
    res.status(500).json(err);
  }
});

router.post("/review", async (req, res) => {
  try {
    const {userID, herolistId, comment, ratingNumber } = req.body;
    // verifyToken middleware does not add userId to req  we need to manually get the logged in user


    const date = new Date();
    //rating is manadatory 

    //console.log("/api/secure/herolists/review userId, herolistId, comment, rating, createdAt: ",userID, herolistId, comment, ratingNumber, date);

    const newReview = new ReviewModel({
      userId: userID,
      herolistId,
      comment,
      rating: ratingNumber,
      createdAt: date,
    });

    await newReview.save();

    // add this review to the herolist's comments array
    const herolist = await HeroListsModel.findById(herolistId);
    herolist.comments.push(newReview._id);

    const ratings = await ReviewModel.find({ _id: { $in: herolist.comments } });

    const totalRating = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    // console.log("totalRating",totalRating);
    const newavgrating = totalRating / (ratings.length);
    // console.log("ratings.length",ratings.length);
    // console.log("newavgrating",newavgrating);
    herolist.averageRating = newavgrating;
    // console.log("herolist.averageRating",herolist.averageRating);

    await herolist.save();

    //console.log("newReview saved");

    res.status(201).json(newReview);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding review" });
  }
});

// Update a herolist by ID
router.put("/updateList/:herolistId", async (req, res) => {
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

    const updatedList = await HeroListsModel.findByIdAndUpdate(
      herolistId,
      {
        name, 
        description, 
        heronamelist, 
        isPublic, 
        lastModified: new Date() // Update the lastModified date
      },
      { new: true }
    );
    res.status(200).json(updatedList);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error updating list', error: err });
  }
});





export { router as herolistsRouter };

