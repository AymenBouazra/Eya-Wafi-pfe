const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
},
{
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Skill', skillSchema);