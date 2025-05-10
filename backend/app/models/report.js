const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['skills_gap', 'mobility_trends', 'training_needs', 'employee_retention'],
    required: true 
  },
  parameters: mongoose.Schema.Types.Mixed,
  data: mongoose.Schema.Types.Mixed,
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
{
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Report', reportSchema);