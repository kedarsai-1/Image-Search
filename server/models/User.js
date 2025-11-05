const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  providerId: String,
  provider: String,
  displayName: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', UserSchema);
