import express from "express";
import { Superhero, SuperheroPower } from "../models/HeroInfo.js"; // Adjust imports as necessary

const router = express.Router();

router.get('/search', async (req, res) => {
  const { name, gender, race, publisher, powers } = req.query;

  console.log('Received query:', req.query);

  try {
      let query = [];
      if (name) {
          query.push({ name: new RegExp(name, 'i') });
      }
      if (gender) {
          query.push({ Gender: gender });
      }
      if (race) {
          query.push({ Race: race });
      }
      if (publisher) {
          query.push({ Publisher: publisher });
      }

      if (powers) {
          const powerResults = await SuperheroPower.find({ [powers]: true });
          const heroNamesWithPower = powerResults.map(power => power.hero_names);
          console.log('Hero names with power:', heroNamesWithPower);

          if (heroNamesWithPower.length > 0) {
              query.push({ name: { $in: heroNamesWithPower } });
          }
      }

      let finalQuery = query.length > 0 ? { $and: query } : {};

      const superheroes = await Superhero.find(finalQuery);
      console.log('Superheroes found:', superheroes.length);

      res.json(superheroes);
  } catch (err) {
      console.error('Error fetching superheroes:', err);
      res.status(500).send('Server error');
  }
});


//Weapons Master

// ...other routes...

export { router as heroinfoRouter };
