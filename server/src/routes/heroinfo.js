import express from "express";
import { Superhero, SuperheroPower } from "../models/HeroInfo.js"; // Adjust imports as necessary

const router = express.Router();

router.get('/search', async (req, res) => {
    const { field, pattern } = req.query;
  
    try {
      if (field === 'powers') {
        console.log('Searching by powers');
        // // Search in SuperheroPower collection
        // const powerPattern = new RegExp(pattern, 'i');
        // const powers = await SuperheroPower.find({}).where(Object.keys({ powerPattern })[0]).equals(true);
        // const heroNames = powers.map(power => power.hero_names);
  
        // // Now find superheroes with these names
        // const superheroes = await Superhero.find({ name: { $in: heroNames } });
        // Find powers where the specific power is true
        const powerQuery = {};
        powerQuery[pattern] = true; // Query for the specific power
        const powers = await SuperheroPower.find(powerQuery);

        // Extract hero names
        const heroNames = powers.map(power => power.hero_names);

        // Find superheroes with these names
        const superheroes = await Superhero.find({ name: { $in: heroNames } });
        res.json(superheroes);
      } else {
        // Regular search in Superhero collection
        const query = {};
        query[field] = new RegExp(pattern, 'i');
        const superheroes = await Superhero.find(query);
        res.json(superheroes);
      }
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

// ...other routes...

export { router as heroinfoRouter };
