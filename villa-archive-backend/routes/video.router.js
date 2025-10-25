const express = require('express');
const router = express.Router();
const {
  createVideo,
  getVideos,
  getVideoById,
  deleteVideo,
  toggleActive,
  createUploadUrl,
  uploadFromUrl,
  getStreamInfo
} = require('../controllers/video.controller');

// CRUD
router.post('/', createVideo);
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.delete('/:id', deleteVideo);
router.patch('/:id/toggle-active', toggleActive);

// Cloudflare Stream
router.post('/cloudflare/upload-url', createUploadUrl);
router.post('/cloudflare/upload-from-url', uploadFromUrl);
router.get('/cloudflare/:uid', getStreamInfo);

module.exports = router;
