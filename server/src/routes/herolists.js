import express from "express";
import mongoose from "mongoose";
import { HeroListsModel } from "../models/HeroLists.js";
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
  console.log(herolist);

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

// Get the first 10 public herolists by date modified
router.get("/public", async (req, res) => {
  console.log("herolists/public");
  try {
    const result = await HeroListsModel.find({ isPublic: true })
      .sort({ lastModified: -1 })
      .limit(10);
    //Debug log with apis name and result
    console.log("herolists/public", result);
    res.status(200).json(result);
  } catch (err) {
    console.log("herolists/public ERROR",err);
    res.status(500).json(err);
  }
});

// Get a herolist by ID
router.get("/:herolistId", async (req, res) => {
  try {
    const result = await HeroListsModel.findById(req.params.herolistId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Save a HeroList
router.put("/", async (req, res) => {
  const herolist = await HeroListsModel.findById(req.body.herolistID);
  const user = await UserModel.findById(req.body.userID);
  try {
    user.savedHeroLists.push(herolist);
    await user.save();
    res.status(201).json({ savedHeroLists: user.savedHeroLists });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get id of saved herolists
router.get("/savedHeroLists/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(201).json({ savedHeroLists: user?.savedHeroLists });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get saved herolists
router.get("/savedHeroLists/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedHeroLists = await HeroListsModel.find({
      _id: { $in: user.savedHeroLists },
    });

    console.log("hihi",savedHeroLists);
    res.status(201).json({ savedHeroLists });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});




export { router as herolistsRouter };

