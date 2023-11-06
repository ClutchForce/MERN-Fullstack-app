// Required modules
const express = require('express');
const { check, validationResult } = require('express-validator');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const Storage = require('node-storage');
 
// Initialize node-storage for list file
const superheroListsStore = new Storage(path.join(__dirname, 'heroLists/superhero_lists.json'));

//if the get returns is empty then put an empty object in the store
if (superheroListsStore.get('lists') === null) {
    superheroListsStore.put('lists', {}); // Initialize empty lists object
}

// Middleware to parse JSON bodies
app.use(express.json({ encoding: 'utf8' }));


// Function to read superhero information from file
function readSuperheroInfo() {
  const data = fs.readFileSync(path.join(__dirname,'heroData/superhero_info.json'), 'utf-8');
  return JSON.parse(data);
}

// Function to read superhero powers from file
function readSuperheroPowers() {
    const data = fs.readFileSync(path.join(__dirname,'heroData/superhero_powers.json'), 'utf-8');
    return JSON.parse(data);
}

// Function to get a list of unique publishers from superhero data
function getUniquePublishers() {
    const superheroes = readSuperheroInfo();
    const publishers = new Set(superheroes.map(hero => hero.Publisher));
    return Array.from(publishers);
}

// Function to get superhero data by ID
function getSuperheroById(id) {
    const superheroes = readSuperheroInfo();
    return superheroes.find(hero => hero.id === parseInt(id));
}

// Function to get superhero powers by superhero ID
function getSuperheroPowersById(superheroId) {
    const superheroes = readSuperheroInfo();
    const powers = readSuperheroPowers();
    const superhero = superheroes.find(hero => hero.id === superheroId);
    if (!superhero) {
        return [];  // just leave empty
    }
    const superheroName = superhero.name;
    const powersObject = powers.find(powerInfo => powerInfo.hero_names === superheroName);
    if (!powersObject) {
        return [];  // hero not found in powers file therefore has no powers
    }
    // Process the powers object to return only the powers the superhero has
    const powersArray = Object.keys(powersObject)
        .filter(power => powersObject[power] === "True")
        .map(power => power.replace(/_/g, ' '));  // Replace underscores with spaces
    return powersArray;
}
  
// Function to search superheroes by a specified field and pattern
function searchSuperheroes(field, pattern, n) {
    // If field isnt name, capitalize first letter
    if (field.toLowerCase() === 'name') {
      field = 'name';
    } else {
      field = field.charAt(0).toUpperCase() + field.slice(1);
    }

    if (field === 'Power') {
        return searchSuperheroesByPower(pattern, n);
    }

    const superheroes = readSuperheroInfo();
    const filteredHeroes = superheroes
      .filter(hero => new RegExp(pattern, 'i').test(hero[field]))
      .slice(0, n || superheroes.length);
    return filteredHeroes.map(hero => hero.id);
}

// Function to search superheroes by power
function searchSuperheroesByPower(pattern, n){
    const superheroes = readSuperheroInfo();
    const powers = readSuperheroPowers();
    const filteredHeroes = superheroes
        .filter(hero => {
            const powersObject = powers.find(powerInfo => powerInfo.hero_names === hero.name);
            if (!powersObject) {
                return false;  // hero not found in powers file therefore has no powers
            }
            const powersArray = Object.keys(powersObject)
                .filter(power => powersObject[power] === "True");
            return powersArray.some(power => new RegExp(pattern, 'i').test(power));
        })
        .slice(0, n || superheroes.length);
    return filteredHeroes.map(hero => hero.id);
}

//id validation function
function isValidId(id) {
  const num = parseInt(id, 10);
  return !isNaN(num) && num >= 0;
}

//validation function Pattern Sanitization for RegExp
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Middleware to serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});  

// Route to serve the front-end application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Endpoint to get a list of all unique publishers
app.get('/api/publishers', (req, res) => {
    const publishers = getUniquePublishers();
    res.json(publishers);
});
  
// Endpoint to search superheroes by a specified field and pattern
app.get('/api/superheroes/search', (req, res) => {
    let { field, pattern, n } = req.query;
    
    if (!field || !pattern) {
      return res.status(400).send('Both field and pattern are required');
    }
    pattern = escapeRegExp(pattern); // Sanitize the pattern

    const superheroIds = searchSuperheroes(field, pattern, n);
    
    if (superheroIds.length === 0) {
      return res.status(404).send('No matches found');
    }
  
    res.json(superheroIds);
});

// Endpoint to get superhero data by ID
app.get('/api/superheroes/:id', (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).send('Invalid ID format');
    }

    const superhero = getSuperheroById(req.params.id);  

    if (!superhero) {
      return res.status(404).send('Superhero not found');
    }
  
    res.json(superhero);
});
  
// Endpoint to get superhero powers by superhero ID
app.get('/api/superheroes/:id/powers', (req, res) => {
    const superhero = getSuperheroById(req.params.id);
    
    if (!superhero) {
      return res.status(404).send('Superhero not found');
    }
  
    const superheroName = superhero.name;
    const superheroPowers = readSuperheroPowers();
    
    const powers = superheroPowers.find(powerInfo => powerInfo.hero_names === superheroName);
    
    if (!powers) {
      //return res.status(404).send('Powers not found for the given superhero ID');
        return res.json([]);  // just leave empty
    }
  
    res.json(powers);
});
  
// Endpoint to create a new superhero list
app.post('/api/lists', [
  check('listName').trim().escape().notEmpty().withMessage('List name is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { listName } = req.body;

  if (!listName) {
    return res.status(400).send('List name is required');
  }

  const listsData = superheroListsStore.get('lists') || {};

  if (listsData[listName]) {
    return res.status(409).send('List already exists');
  }

  listsData[listName] = [];
  superheroListsStore.put('lists', listsData);
  
  res.status(201).send('List created');
});

// Endpoint to update a superhero list by name
app.put('/api/lists/:listName', [
  check('listName').trim().escape().notEmpty().withMessage('List name is required'),
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

  const listsData = superheroListsStore.get('lists') || {};

  listsData[listName] = superheroIds;
  superheroListsStore.put('lists', listsData);
  
  res.send('List updated');
});

// Endpoint to get all superhero lists
app.get('/api/lists', (req, res) => {
  const listsData = superheroListsStore.get('lists') || {};
  res.json(Object.keys(listsData));  // Send the names of all lists as an array
});

// Endpoint to get superhero IDs in a list by list name
app.get('/api/lists/:listName', (req, res) => {
  const { listName } = req.params;

  const listsData = superheroListsStore.get('lists') || {};

  if (!listsData[listName]) {
    return res.status(404).send('List not found');
  }

  res.json(listsData[listName]);
});
  
// Endpoint to delete a superhero list by name
app.delete('/api/lists/:listName', (req, res) => {
  const { listName } = req.params;

  const listsData = superheroListsStore.get('lists') || {};

  if (!listsData[listName]) {
    return res.status(404).send('List not found');
  }

  delete listsData[listName];
  superheroListsStore.put('lists', listsData);

  res.send('List deleted');
});
  
// Endpoint to get details of superheroes in a list by list name
app.get('/api/lists/:listName/details', (req, res) => {
  const { listName } = req.params;

  const listsData = superheroListsStore.get('lists') || {};

  if (!listsData[listName]) {
      return res.status(404).send('List not found');
  }

  const superheroes = readSuperheroInfo();
  
  const listDetails = listsData[listName].map(id => {
      const superhero = superheroes.find(hero => hero.id === parseInt(id));
      if (!superhero) {
          return { id: id, name: 'no-name', info: {}, powers: [] };
      }
      const powersArray = getSuperheroPowersById(parseInt(id));
      return {
          id: id,
          name: superhero.name,
          info: superhero,
          powers: powersArray
      };
  });

  res.json(listDetails);
});
