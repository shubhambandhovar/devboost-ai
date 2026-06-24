const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feature: { type: String, required: true },
  input: { type: mongoose.Schema.Types.Mixed, required: true },
  output: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('History', historySchema);
