const express = require('express');
const app = express();

const bodyParser = require('body-parser');

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


app.get('/', (req, res) => {
  res.format({
    json: () => { res.json({}); }
  });
});

app.get('/users', (req, res) => {
  res.format({
    json: () => { res.json(users); }
  });
});

app.post('/users', (req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  const resource = { username, name };
  users.push(resource);
  res.format({
    json: () => { res.json(users); }
  });
})

app.get('/users/:username', (req, res) => {
  const username = req.params.username;
  const user = users.find(item => item.username === username );
  if (!user) next();
  res.format({
    json: () => { res.json(user); }
  });
});

app.put('/users/:username', (req, res) => {
  const username = req.params.username;
  const user = users.find(item => item.username === username);

  req.body.forEach(item => user[item] = req.body[item]);
  res.format({
    json: () => { res.json(users); }
  });
})

app.get('/pets', (req, res) => {
  res.format({
    json: () => { res.json(pets); }
  });
});

app.post('/pets', (req, res) => {
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

app.get('/users/:username/pets', (req, res, next) => {
  const username = req.params.username;
  userPets = pets.filter(item => item.user === username);
  console.log(username, userPets);
  if (!userPets) next();
  res.format({
    json: () => { res.json(userPets); }
  });
});


app.use((req, res) => {
  res.status(404);
  res.send({ error: "Lame, can't find that" });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
