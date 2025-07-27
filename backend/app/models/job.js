const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  departement: { type: String, required: true },
  description: { type: String, required: true },
  requirements: String,
  requiredSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  isActive: { type: Boolean, default: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
{
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Job', jobSchema);