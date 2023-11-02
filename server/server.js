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

function getUniquePublishers() {
    const superheroes = readSuperheroInfo();
    const publishers = new Set(superheroes.map(hero => hero.Publisher));
    return Array.from(publishers);
}

function getSuperheroById(id) {
    const superheroes = readSuperheroInfo();
    return superheroes.find(hero => hero.id === parseInt(id));
}
  
  
function searchSuperheroes(field, pattern, n) {
    const superheroes = readSuperheroInfo();
    const filteredHeroes = superheroes
      .filter(hero => new RegExp(pattern, 'i').test(hero[field]))
      .slice(0, n || superheroes.length);
    return filteredHeroes.map(hero => hero.id);
}

app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/api/publishers', (req, res) => {
    const publishers = getUniquePublishers();
    res.json(publishers);
});
  
app.get('/api/superheroes/search', (req, res) => {
    const { field, pattern, n } = req.query;
    
    if (!field || !pattern) {
      return res.status(400).send('Both field and pattern are required');
    }
    const superheroIds = searchSuperheroes(field, pattern, n);
    
    if (superheroIds.length === 0) {
      return res.status(404).send('No matches found');
    }
  
    res.json(superheroIds);
});

app.get('/api/superheroes/:id', (req, res) => {
    const superhero = getSuperheroById(req.params.id);
    
    if (!superhero) {
      return res.status(404).send('Superhero not found');
    }
  
    res.json(superhero);
  });
  
  app.get('/api/superheroes/:id/powers', (req, res) => {
    const superhero = getSuperheroById(req.params.id);
    
    if (!superhero) {
      return res.status(404).send('Superhero not found');
    }
  
    const superheroName = superhero.name;
    const superheroPowers = readSuperheroPowers();
    
    const powers = superheroPowers.find(powerInfo => powerInfo.hero_names === superheroName);
    
    if (!powers) {
      return res.status(404).send('Powers not found for the given superhero ID');
    }
  
    res.json(powers);
  });
  