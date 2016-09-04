var mongoose = require("mongoose");
var pokemahnSchema = new mongoose.Schema({
  id: {
    type: Number,
    index: true,
    unique: true
  },
  name: String,
  type: String,
  hp: Number,
  attack: Number,
  defense: Number,
  speed: Number,
  special_attack: Number,
  special_defense: Number,
  evolve_level: Number,
  evolve_to: Number,
  moves: [String]
});
mongoose.model("Pokemahn", pokemahnSchema);
