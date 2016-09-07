const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let users = [
  {
    username: 'nicole',
    name: 'Nicole',
  },
  {
    username: 'eduardo',
    name: 'Eduardo',
  },
  {
    username: 'andres',
    name: 'Andrés',
  },
]

let pets = [
  {
    name: 'oblina',
    emoji: '🐶',
    user: 'nicole',
  },
  {
    name: 'misa',
    emoji: '🐩',
    user: 'nicole',
  },
  {
    name: 'pirata',
    emoji: '🐦',
    user: 'eduardo',
  },
  {
    name: 'silvestre',
    emoji: '🐱',
    user: 'andres',
  },
]

// Home
app.get('/', (req, res, next) => {
  res.format({
    json: () => { res.json({}); }
  });
});


// Users
app.get('/users', (req, res, next) => {
  res.format({
    json: () => { res.json(users); }
  });
});

app.post('/users', upload.array(), (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const resource = { username, name };
  users.push(resource);
  res.format({
    json: () => { res.json(users); }
  });
})

app.get('/users/:username', (req, res, next) => {
  const username = req.params.username;
  const user = users.find(item => item.username === username );
  if (!user) next();
  res.format({
    json: () => { res.json(user); }
  });
});

app.put('/users/:username', upload.array(), (req, res, next) => {
  const username = req.params.username;
  const user = users.find(item => item.username === username);

  Object.keys(user).forEach(item => {
    user[item] = req.body[item] ? req.body[item] : user[item];
  });
  res.format({
    json: () => { res.json(user); }
  });
})

app.delete('/users/:username', (req, res, next) => {
  const username = req.params.username;
  const user_index = users.findIndex(item => item.username === username );

  if (user_index < 0) next();
  users.splice(user_index, 1);

  res.status(204);
  res.send();
});


// Pets
app.get('/pets', (req, res, next) => {
  res.format({
    json: () => { res.json(pets); }
  });
});

app.post('/pets', upload.array(), (req, res, next) => {
  const name = req.body.name;
  const emoji = req.body.emoji;
  const user = users.find(item => req.body.user === item.username)
    ? req.body.user
    : undefined;
  const resource = { name, emoji, user };

  pets.push(resource);

  res.format({
    json: () => { res.json(pets); }
  });
})

app.get('/pets/:name', (req, res, next) => {
  const name = req.params.name;
  const pet = pets.find(item => item.name === name );
  if (!pet) next();
  res.format({
    json: () => { res.json(pet); }
  });
});

app.put('/pets/:name', upload.array(), (req, res, next) => {
  const name = req.params.name;
  const pet = pets.find(item => item.name === name);

  Object.keys(pet).forEach(item => {
    pet[item] = req.body[item] ? req.body[item] : pet[item];
  });
  res.format({
    json: () => { res.json(pet); }
  });
})

app.delete('/pets/:name', (req, res, next) => {
  const name = req.params.name;
  const pet_index = pets.findIndex(item => item.name === name );

  if (pet_index < 0) next();
  pets.splice(pet_index, 1);

  res.format({
    json: () => { res.json(pets); }
  });
});


// User - Pets
app.get('/users/:username/pets', (req, res, next) => {
  const username = req.params.username;
  userPets = pets.filter(item => item.user === username);

  if (!userPets) next();
  res.format({
    json: () => { res.json(userPets); }
  });
});

// Errors
app.use((req, res, next) => {
  res.status(404);
  res.send({ error: "😅 Can't find that" });
});

app.listen(3000, () => {
  console.log('Example app 👂🏽  on port 3000!');
});
