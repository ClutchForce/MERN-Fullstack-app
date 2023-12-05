import express from "express";
import { Superhero, SuperheroPower } from "../models/HeroInfo.js"; // Adjust imports as necessary
import { body, query, validationResult } from 'express-validator';
import stringSimilarity from 'string-similarity';

const router = express.Router();

// open routes


router.get('/search', [
  query('name').optional().isString(),
  query('gender').optional().isString(),
  query('race').optional().isString(),
  query('publisher').optional().isString(),
  query('powers').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, gender, race, publisher, powers } = req.query;
  // Your existing code here...


//   console.log('Received query:', req.query);

try {
  let superheroes = await Superhero.find(); // Fetch all superheroes

  //soft-matched search
  if (name) {
    superheroes = superheroes.filter(hero =>
      stringSimilarity.compareTwoStrings(hero.name.toLowerCase(), name.toLowerCase()) >= 0.7
    );
  }
  if (gender) {
    superheroes = superheroes.filter(hero =>
      stringSimilarity.compareTwoStrings(hero.Gender.toLowerCase(), gender.toLowerCase()) >= 0.7
    );
  }
  if (race) {
    superheroes = superheroes.filter(hero =>
      stringSimilarity.compareTwoStrings(hero.Race.toLowerCase(), race.toLowerCase()) >= 0.7
    );
  }
  if (publisher) {
    superheroes = superheroes.filter(hero =>
      stringSimilarity.compareTwoStrings(hero.Publisher.toLowerCase(), publisher.toLowerCase()) >= 0.7
    );
  }

  if (powers) {
    // Assume SuperheroPower is a model that contains powers related to superheroes
    const powerResults = await SuperheroPower.find({ 
      power: new RegExp(powers, 'i') // Use RegExp for case-insensitive match
    });

    const heroIdsWithPower = powerResults.map(power => power.heroId);
    superheroes = superheroes.filter(hero => heroIdsWithPower.includes(hero.id));
  }

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
  


// ...other routes...

export { router as heroinfoRouter };
