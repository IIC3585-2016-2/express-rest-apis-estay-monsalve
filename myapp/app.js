const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

const userFormat = (req, user) => {
  links = {
    self: {
      href: `${req.protocol}://${req.headers.host}/api/users/${user.username}`,
    },
    pets: {
      href: `${req.protocol}://${req.headers.host}/api/users/${user.username}/pets`,
    }
  };
  return _extends({}, user, { links });
}

const petFormat = (req, pet, user) => {
  let links = {
    self: {
      href: `${req.protocol}://${req.headers.host}/api/pets/${pet.name}`,
    },
    user: {
      href: `${req.protocol}://${req.headers.host}/api/users/${pet.user}`,
    },
  }
  return _extends({}, pet, { links });
}

// Home
app.get('/api', (req, res, next) => {
  res.format({
    json: () => { res.json({}); }
  });
});


// Users
app.get('/api/users', (req, res, next) => {
  const response = users.map(item => userFormat(req, item));

  res.format({
    json: () => { res.json(response); }
  });
});

app.post('/api/users', upload.array(), (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const resource = { username, name };
  users.push(resource);

  const response = userFormat(req, resource);
  res.format({
    json: () => {
      res.status(201);
      res.json(response);
    }
  });
})

app.get('/api/users/:username', (req, res, next) => {
  const username = req.params.username;
  const user = users.find(item => item.username === username );
  if (!user) next();

  res.format({
    json: () => { res.json(userFormat(req, user)); }
  });
});

app.put('/api/users/:username', upload.array(), (req, res, next) => {
  const username = req.params.username;
  const user = users.find(item => item.username === username);

  Object.keys(user).forEach(item => {
    user[item] = req.body[item] ? req.body[item] : user[item];
  });
  res.format({
    json: () => { res.json(userFormat(req, user)); }
  });
})

app.delete('/api/users/:username', (req, res, next) => {
  const username = req.params.username;
  const user_index = users.findIndex(item => item.username === username );

  if (user_index < 0) next();
  user = users.splice(user_index, 1);

  res.status(204);
  res.send();
});


// Pets
app.get('/api/pets', (req, res, next) => {
  const response = pets.map(item => petFormat(req, item));
  res.format({
    json: () => { res.json(response); }
  });
});

app.post('/api/pets', upload.array(), (req, res, next) => {
  const name = req.body.name;
  const emoji = req.body.emoji;
  const user = users.find(item => req.body.user === item.username)
    ? req.body.user
    : undefined;
  const resource = { name, emoji, user };

  pets.push(resource);

  const response = petFormat(req, resource);
  res.format({
    json: () => {
      res.status(201);
      res.json(response);
    }
  });
})

app.get('/api/pets/:name', (req, res, next) => {
  const name = req.params.name;
  const pet = pets.find(item => item.name === name );
  if (!pet) next();

  const response = petFormat(req, pet);
  res.format({
    json: () => { res.json(response); }
  });
});

app.put('/api/pets/:name', upload.array(), (req, res, next) => {
  const name = req.params.name;
  const pet = pets.find(item => item.name === name);

  Object.keys(pet).forEach(item => {
    pet[item] = req.body[item] ? req.body[item] : pet[item];
  });

  const response = petFormat(req, pet);
  res.format({
    json: () => { res.json(response); }
  });
})

app.delete('/api/pets/:name', (req, res, next) => {
  const name = req.params.name;
  const pet_index = pets.findIndex(item => item.name === name );

  if (pet_index < 0) next();
  pets.splice(pet_index, 1);

  res.status(204);
  res.send();
});


// User - Pets
app.get('/api/users/:username/pets', (req, res, next) => {
  const username = req.params.username;
  userPets = pets
    .filter(item => item.user === username)
    // .map(item => ({ name: item.name, emoji: item.emoji }));

  if (!userPets) next();

  const response = userPets.map(item => petFormat(req, item));
  res.format({
    json: () => { res.json(response); }
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
