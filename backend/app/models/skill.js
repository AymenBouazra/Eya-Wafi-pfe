const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: String,
  isCore: { type: Boolean, default: false },
},
{
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Skill', skillSchema);