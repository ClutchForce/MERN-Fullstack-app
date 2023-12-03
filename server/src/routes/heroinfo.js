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

// Get hero info by name getHeroDetails/{heroname}
router.get("/getHeroDetails/:name", async (req, res) => {
    try {
      const heroName = req.params.name;
      
      // Fetch hero information
      const heroInfo = await Superhero.findOne({ name: new RegExp(heroName, 'i') });
      if (!heroInfo) {
        return res.status(404).json({ message: 'Hero not found' });
      }
  
      // Fetch hero powers
      const powerInfo = await SuperheroPower.findOne({ hero_names: heroName });
      let heroPowers = [];
      if (powerInfo) {
        // Iterate through all keys in the powerInfo document
        for (let key in powerInfo.toObject()) {
          if (powerInfo[key] === true) {
            heroPowers.push(key); // Add the power name to the array if its value is true
          }
        }
      }
  
      // Construct response object
      const heroDetails = {
        name: heroInfo.name,
        Gender: heroInfo.Gender,
        'Eye color': heroInfo['Eye color'],
        Race: heroInfo.Race,
        'Hair color': heroInfo['Hair color'],
        Height: heroInfo.Height,
        Publisher: heroInfo.Publisher,
        'Skin color': heroInfo['Skin color'],
        Alignment: heroInfo.Alignment,
        Weight: heroInfo.Weight,
        Powers: heroPowers // Add powers array
      };
  
      res.status(200).json(heroDetails);
    } catch (err) {
      console.error('Error fetching hero details:', err);
      res.status(500).json({ message: 'Error fetching hero details' });
    }
  });
  

//Weapons Master

// ...other routes...

export { router as heroinfoRouter };
