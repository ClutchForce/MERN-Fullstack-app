import mongoose from "mongoose";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Superhero, SuperheroPower } from './models/HeroInfo.js'; // Adjust the path if necessary

mongoose.connect('mongodb://localhost:27017/se3316Lab4', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const superheroData = JSON.parse(fs.readFileSync(path.join(__dirname, './heroData/superhero_info.json'), 'utf8'));
const superheroPowerData = JSON.parse(fs.readFileSync(path.join(__dirname, './heroData/superhero_powers.json'), 'utf8'));

async function populateDatabase() {
  // Convert string "True"/"False" to boolean true/false
  superheroPowerData.forEach(power => {
    Object.keys(power).forEach(key => {
      if (power[key] === 'True') {
        power[key] = true;
      } else if (power[key] === 'False') {
        power[key] = false;
      }
    });
  });
  //await Superhero.insertMany(superheroData);
  await SuperheroPower.insertMany(superheroPowerData);
  console.log('Database populated!');
}

populateDatabase().then(() => {
  mongoose.connection.close();
});

// run node src/popdb.js in server directory to populate database