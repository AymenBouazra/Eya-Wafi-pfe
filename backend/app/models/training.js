const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: Number, required: true }, // in hours
  provider: String,
  targetSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  recommendedFor: [{
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    skillLevel: { type: Number, min: 1, max: 5 }
  }],
  isActive: { type: Boolean, default: true },
},
{
  timestamps: true,
  versionKey: false
}); 

module.exports = mongoose.model('Training', trainingSchema);