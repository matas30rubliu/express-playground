
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleProfileID: String,
  lastSeen: Date
});

mongoose.model('users', userSchema);
