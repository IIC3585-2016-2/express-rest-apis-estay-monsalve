var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var paginate = require('paginate')({
    mongoose: mongoose
});
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

router.route('/')
  .get(function(req, res, next) {
    res.format({
      html: function(){
        mongoose.model('Pokemahn').find().sort({id: 'asc'}).paginate({ page: req.query.page, perPage: 12 }, function (err, pokemahns) {
          if (err) {
            return console.error(err);
          } else {
            res.render('pokemahns/index', {
              title: 'First Generation',
              "pokemahns" : pokemahns
            });
          }
        });
      },
      json: function(){
        mongoose.model('Pokemahn').find().sort({id: 'asc'}).exec(function (err, pokemahns) {
          if (err) {
            return console.error(err);
          } else {
            res.json(pokemahns);
          }
        });
      }
    });
  })
  .post(function(req, res) {
    var name = req.body.name;
    var type = req.body.type;
    var hp = req.body.hp;
    var attack = req.body.attack;
    var defense = req.body.defense;
    var speed = req.body.speed;
    var special_attack = req.body.special_attack;
    var special_defense = req.body.special_defense;
    var evolve_level = req.body.evolve_level;
    var evolve_to = req.body.evolve_to;
    var moves = req.body.moves;
    mongoose.model('Pokemahn').create({
      name: name,
      type: type,
      hp: hp,
      attack: attack,
      defense: defense,
      speed: speed,
      special_attack: special_attack,
      special_defense: special_defense,
      evolve_level: evolve_level,
      evolve_to: evolve_to,
      moves: moves
    }, function (err, pokemahn) {
      if (err) {
        res.send("There was a problem adding your pokemahn to the pokedex.");
      } else {
        console.log('POST creating new pokemahn: ' + pokemahn);
        res.format({
          html: function(){
            res.location("pokemahns");
            res.redirect("/pokemahns");
          },
          json: function(){
            res.json(pokemahn);
          }
        });
      }
    })
  });

router.param('id', function(req, res, next, id) {
  mongoose.model('Pokemahn').findOne({ "id": req.id }, function (err, pokemahn) {
    if (err) {
      console.log('Pokemahn #' + id + ' was not found');
      res.status(404)
      var err = new Error('Not Found');
      err.status = 404;
      res.format({
        html: function(){
          next(err);
         },
        json: function(){
          res.json({message : err.status  + ' ' + err});
        }
      });
    } else {
      req.id = id;
      next();
    }
  });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Pokemahn').findOne({ "id": req.id }, function (err, pokemahn) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + pokemahn.id);
        res.format({
          html: function(){
              res.render('pokemahns/show', {
                "pokemahn" : pokemahn,
              });
          },
          json: function(){
              res.json(pokemahn);
          }
        });
      }
    });
  });

module.exports = router;
