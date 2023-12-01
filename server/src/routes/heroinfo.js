import express from "express";
import { Superhero, SuperheroPower } from "../models/HeroInfo.js"; // Adjust imports as necessary

const router = express.Router();

// router.get('/search', async (req, res) => {
//     const { field, pattern } = req.query;
  
//     try {
//       if (field === 'powers') {
//         console.log('Searching by powers');
//         // Search in SuperheroPower collection

//         const powerQuery = {};
//         powerQuery[pattern] = true; // Query for the specific power
//         const powers = await SuperheroPower.find(powerQuery);

//         // Extract hero names
//         const heroNames = powers.map(power => power.hero_names);

//         // Find superheroes with these names
//         const superheroes = await Superhero.find({ name: { $in: heroNames } });
//         res.json(superheroes);
//       } else {
//         // Regular search in Superhero collection
//         const query = {};
//         query[field] = new RegExp(pattern, 'i');
//         const superheroes = await Superhero.find(query);
//         res.json(superheroes);
//       }
//     } catch (err) {
//       res.status(500).send('Server error');
//     }
//   });

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
