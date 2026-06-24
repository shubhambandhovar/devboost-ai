const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google OAuth users
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  generationsCount: { type: Number, default: 0 },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
