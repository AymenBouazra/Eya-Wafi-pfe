const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  description: { type: String, required: true },
  requirements: String,
  requiredSkills: [{
    skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    minLevel: { type: Number, min: 1, max: 5, default: 3 }
  }],
  isActive: { type: Boolean, default: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
{
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Job', jobSchema);