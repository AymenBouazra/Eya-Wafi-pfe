const mongoose = require('mongoose');

const mobilityRequestSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  motivation: { type: String, required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'current_manager_approved',  'manager_approved', 'hr_approved', 'rejected', 'completed'],
    default: 'pending'
  },
  currentStep: {
    type: String,
    enum: [ 'current_manager_approval', 'manager_approval', 'hr_approval', 'completed', 'rejected'],
    default: 'current_manager_approval'
  },
  departureManagerApproval: {
    approved: { type: Boolean, default: false },
    comment: String,
    date: Date,
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  },
  currentManagerApproval: {
    approved: { type: Boolean, default: false },
    comment: String,
    date: Date,
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  },
  hrApproval: {
    approved: { type: Boolean, default: false },
    comment: String,
    date: Date,
    hr: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  },
},
{
  timestamps: true,
  versionKey: false
});

mobilityRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('MobilityRequest', mobilityRequestSchema);