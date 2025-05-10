const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: false},
  role: { type: String, enum: ['employee', 'manager', 'hr'], required: true },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    department: String,
    position: String,
    skills: [{
      skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
      level: { type: Number, min: 1, max: 5, default: 1 }
    }],
    aspirations: [String],
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String
    }]
  },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
},
{
  timestamps: true,
  versionKey: false
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);