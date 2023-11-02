const express = require('express');
const { check, validationResult } = require('express-validator');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');

// Add this line to use express.json middleware
app.use(express.json());

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

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});  

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
  
// Updated POST /api/lists with validation
app.post('/api/lists', [
    check('listName').trim().escape().notEmpty(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { listName } = req.body;
  
    if (!listName) {
      return res.status(400).send('listName is required');
    }
  
    const listsPath = path.join(__dirname, '../superhero_lists.json');
    const listsData = JSON.parse(fs.readFileSync(listsPath, 'utf8'));
  
    if (listsData[listName]) {
      return res.status(409).send('List already exists');
    }
  
    listsData[listName] = [];
    fs.writeFileSync(listsPath, JSON.stringify(listsData, null, 2));
    
    res.status(201).send('List created');
});

// Updated PUT /api/lists/:listName with validation
app.put('/api/lists/:listName', [
    check('listName').trim().escape().notEmpty(),
    check('superheroIds').isArray(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { listName } = req.params;
    const { superheroIds } = req.body;
  
    if (!Array.isArray(superheroIds)) {
      return res.status(400).send('superheroIds must be an array');
    }
  
    const listsPath = path.join(__dirname, '../superhero_lists.json');
    const listsData = JSON.parse(fs.readFileSync(listsPath, 'utf8'));
  
    listsData[listName] = superheroIds;
    fs.writeFileSync(listsPath, JSON.stringify(listsData, null, 2));
    
    res.send('List updated');
});

app.get('/api/lists/:listName', (req, res) => {
    const { listName } = req.params;
  
    const listsPath = path.join(__dirname, '../superhero_lists.json');
    const listsData = JSON.parse(fs.readFileSync(listsPath, 'utf8'));
  
    if (!listsData[listName]) {
      return res.status(404).send('List not found');
    }
  
    res.json(listsData[listName]);
});
  
app.delete('/api/lists/:listName', (req, res) => {
    const { listName } = req.params;
  
    const listsPath = path.join(__dirname, '../superhero_lists.json');
    const listsData = JSON.parse(fs.readFileSync(listsPath, 'utf8'));
  
    if (!listsData[listName]) {
      return res.status(404).send('List not found');
    }
  
    delete listsData[listName];
    fs.writeFileSync(listsPath, JSON.stringify(listsData, null, 2));
  
    res.send('List deleted');
});
  
app.get('/api/lists/:listName/details', (req, res) => {
    const { listName } = req.params;
  
    const listsPath = path.join(__dirname, '../superhero_lists.json');
    const listsData = JSON.parse(fs.readFileSync(listsPath, 'utf8'));
  
    if (!listsData[listName]) {
      return res.status(404).send('List not found');
    }
  
    const superheroes = readSuperheroInfo();
    const powers = readSuperheroPowers();
    
    const listDetails = listsData[listName].map(id => {
      const superhero = superheroes.find(hero => hero.id === id);
      return {
        name: superhero.name,
        info: superhero,
        powers: powers[id] || []
      };
    });
  
    res.json(listDetails);
});
  


  