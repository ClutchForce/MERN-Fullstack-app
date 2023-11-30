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
  const herolist = new HeroListsModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    cookingTime: req.body.cookingTime,
    userOwner: req.body.userOwner,
  });
  console.log(herolist);

  try {
    const result = await herolist.save();
    res.status(201).json({
      createdHeroList: {
        name: result.name,
        image: result.image,
        ingredients: result.ingredients,
        instructions: result.instructions,
        _id: result._id,
      },
    });
  } catch (err) {
    // console.log(err);
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

    console.log(savedHeroLists);
    res.status(201).json({ savedHeroLists });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as herolistsRouter };
