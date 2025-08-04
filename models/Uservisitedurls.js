// models/visitedUrls.js
const mongoose = require('mongoose');

const visitedSchema = new mongoose.Schema({
  userId: String,
  url: String,
  date: { type: Date, default: Date.now },
  count: { type: Number, default: 1 },
});

module.exports = mongoose.model('VisitedUrl', visitedSchema);
