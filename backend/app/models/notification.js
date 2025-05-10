const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String,
    enum: [
      'mobility_request', 
      'mobility_status', 
      'mobility_approval', 
      'mobility_final_status',
      'training_recommendation',
      'profile_update',
      'system_alert'
    ],
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  relatedEntity: { 
    type: mongoose.Schema.Types.ObjectId,
    required: false 
  },
  relatedEntityType: { 
    type: String,
    enum: [
      'MobilityRequest', 
      'Training', 
      'User', 
      'Job',
      'System'
    ],
    required: false 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  readAt: { 
    type: Date 
  }
});

// Index pour optimiser les requêtes fréquentes
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

// Middleware pour timestamp de lecture
notificationSchema.pre('save', function(next) {
  if (this.isModified('isRead') && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);