const mongoose = require('mongoose');

const mobilityRequestSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  motivation: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'manager_approved', 'hr_approved', 'rejected', 'completed'],
    default: 'pending'
  },
  currentStep: {
    type: String,
    enum: ['manager_approval', 'hr_approval', 'completed', 'rejected'],
    default: 'manager_approval'
  },
  managerApproval: {
    approved: Boolean,
    comment: String,
    date: Date
  },
  hrApproval: {
    approved: Boolean,
    comment: String,
    date: Date
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