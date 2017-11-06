const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  from: String,
  to: String
});

mongoose.model('routes', routeSchema);
