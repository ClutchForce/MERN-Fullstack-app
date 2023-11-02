const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');

function readSuperheroInfo() {
  const data = fs.readFileSync(path.join(__dirname,'../superhero_info.json'), 'utf-8');
  return JSON.parse(data);
}

function readSuperheroPowers() {
    const data = fs.readFileSync(path.join(__dirname,'../superhero_powers.json'), 'utf-8');
    return JSON.parse(data);
  }
  

app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/api/superheroes/:id', (req, res) => {
    const superheroes = readSuperheroInfo();
    const superhero = superheroes.find(hero => hero.id === parseInt(req.params.id));
    
    if (!superhero) {
      return res.status(404).send('Superhero not found');
    }
  
    res.json(superhero);
});

app.get('/api/superheroes/:id/powers', (req, res) => {
    const superheroPowers = readSuperheroPowers();
    const powers = superheroPowers[req.params.id];
    
    if (!powers) {
      return res.status(404).send('Powers not found for the given superhero ID');
    }
  
    res.json(powers);
  });
  