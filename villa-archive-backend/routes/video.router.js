const express = require("express");
const router = express.Router();
const videoController = require("../controllers/video.controller");

// 🟣 Upload Vimeo complet
router.post("/upload-url", videoController.createUploadUrl);  // Étape 1
router.post("/register", videoController.registerVideo);      // Étape 2

// 🟢 CRUD
router.get("/", videoController.getVideos);
router.get("/:id", videoController.getVideoById);
router.delete("/:id", videoController.deleteVideo);
router.patch("/:id/toggle", videoController.toggleActive);

// 📥 Infos directes Vimeo
router.get("/vimeo/:vimeoId", videoController.getVimeoInfo);

module.exports = router;
