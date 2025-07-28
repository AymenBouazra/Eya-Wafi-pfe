const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: Number, required: true }, 
  provider: String,
  targetSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  recommendedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  isActive: { type: Boolean, default: true },
},
{
  timestamps: true,
  versionKey: false
}); 

module.exports = mongoose.model('Training', trainingSchema);