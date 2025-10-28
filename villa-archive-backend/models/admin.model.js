const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
   refreshToken: { type: String, default: null }
}, {
  timestamps: true
});

module.exports = mongoose.model('Admin', AdminSchema);
