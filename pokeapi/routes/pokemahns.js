const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const paginate = require('paginate')({ mongoose: mongoose });
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method
    delete req.body._method
    return method
  }
}))

router.route('/')
  .get(function(req, res, next) {
    res.format({
      html: function(){
        mongoose
          .model('Pokemahn')
          .find()
          .sort({id: 'asc'})
          .paginate(
            { page: req.query.page, perPage: 16 },
            (err, pokemahns) => {
              if (err) return console.error(err);
              else res.render(
                'pokemahns/index',
                { title: 'First Generation', "pokemahns" : pokemahns });
            }
          );
      },
      json: function(){
        mongoose
          .model('Pokemahn')
          .find()
          .sort({id: 'asc'})
          .exec((err, pokemahns) => {
            if (err) return console.error(err);
            pokemahns.links = {
              self: {
                href: `${req.protocol}://${req.headers.host}/pokemahns`,
              },
              home: {
                href: `${req.protocol}://${req.headers.host}`,
              },
            };
            res.json(pokemahns);
          });
      }
    });
  })
  .post(function(req, res) {
    const name = req.body.name;
    const type = req.body.type;
    const hp = req.body.hp;
    const attack = req.body.attack;
    const defense = req.body.defense;
    const speed = req.body.speed;
    const special_attack = req.body.special_attack;
    const special_defense = req.body.special_defense;
    const evolve_level = req.body.evolve_level;
    const evolve_to = req.body.evolve_to;
    const moves = req.body.moves;

    mongoose.model('Pokemahn').create({
      name,
      type,
      hp,
      attack,
      defense,
      speed,
      special_attack,
      special_defense,
      evolve_level,
      evolve_to,
      moves,
    }, (err, pokemahn) => {
      if (err) {
        res.send("There was a problem adding your pokemahn to the pokedex.");
      }
      else {
        console.log('POST creating new pokemahn: ' + pokemahn);
        res.format({
          html: () => {
            res.location("pokemahns");
            res.redirect("/pokemahns");
          },
          json: () => {
            pokemahn.links = {
              self: {
                 href: `${req.protocol}://${req.headers.host}/pokemahns/${pokemahn.id}`,
               },
               home: {
                 href: `${req.protocol}://${req.headers.host}`,
               },
               pokemahns: {
                 href: `${req.protocol}://${req.headers.host}/pokemahns`,
               },
            };
            res.json(pokemahn); }
        });
      }
    })
  });

router.param('id', (req, res, next, id) => {
  mongoose
    .model('Pokemahn')
    .findOne(
      { "id": req.id },
      (err, pokemahn) => {
        if (err) {
          console.log('Pokemahn #' + id + ' was not found');
          res.status(404)

          const err = new Error('Not Found');
          err.status = 404;

          res.format({
            html: () => { next(err); },
            json: () => { res.json(
              {
                message : err.status  + ' ' + err,
                // home: {
                //   ref: `${req.protocol}://${req.headers.host}`,
                // },
                // pokemahns: {
                //   href: `${req.protocol}://${req.headers.host}/pokemahns`,
                // },
              });
            }
          });
        } else {
          req.id = id;
          next();
        }
      }
    );
});

router.route('/:id')
  .get((req, res) => {
    mongoose
      .model('Pokemahn')
      .findOne(
        { "id": req.id },
        (err, pokemahn) => {
          if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
          } else {
            console.log('GET Retrieving ID: ' + pokemahn.id);
            res.format({
              html: () => {
                res.render('pokemahns/show', { "pokemahn" : pokemahn });
              },
              json: () => {
                pokemahn.links = {
                  self: {
                     href: `${req.protocol}://${req.headers.host}/pokemahns/${pokemahn.id}`,
                   },
                   home: {
                     href: `${req.protocol}://${req.headers.host}`,
                   },
                   pokemahns: {
                     href: `${req.protocol}://${req.headers.host}/pokemahns`,
                   },
                };
                res.json(pokemahn);
              }
            });
          }
        });
  });

module.exports = router;
