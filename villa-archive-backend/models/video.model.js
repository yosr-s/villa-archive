const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  embedUrl: { type: String, required: true },   // 🔹 pour l’iframe
  shareUrl: { type: String, default: '' },      // 🔹 pour le lien à partager
  vimeoId: { type: String, required: true },
  creationDate: { type: String, default: '' },
  isPrivate: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Video', VideoSchema);
