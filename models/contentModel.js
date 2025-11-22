const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  platform: { type: String, required: true },
  content_type: { type: String, required: true },
  hashtags: [{ type: String }],
  target_audience: String,
  generation_prompt: String,
  status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Content', contentSchema);