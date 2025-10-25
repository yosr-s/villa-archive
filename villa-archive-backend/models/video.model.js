const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  url: { type: String, required: true },
  cloudflareId: { type: String, default: '' },
  isPrivate: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Video', VideoSchema);
