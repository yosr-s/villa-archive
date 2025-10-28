const express = require("express");
const router = express.Router();
const videoController = require("../controllers/video.controller");
const verifyAccessToken= require("../middlewares/auth.middleware")
// 🟣 Upload Vimeo complet
router.post("/upload-url", verifyAccessToken, videoController.createUploadUrl);  // Étape 1
router.post("/register",verifyAccessToken, videoController.registerVideo);      // Étape 2

// 🟢 CRUD
router.get("/", verifyAccessToken, videoController.getVideos);
router.get("/public",verifyAccessToken, videoController.getPublicVideos);

router.get("/:id",verifyAccessToken, videoController.getVideoById);
router.delete("/:id",verifyAccessToken, videoController.deleteVideo);
router.patch("/:id/toggle",verifyAccessToken, videoController.toggleActive);
router.patch("/:id",verifyAccessToken, videoController.updateVideoById); // ✅ nouvelle route
router.get("/:vimeoId/download",verifyAccessToken, videoController.downloadVideo);


// 📥 Infos directes Vimeo
router.get("/vimeo/:vimeoId",verifyAccessToken, videoController.getVimeoInfo);

module.exports = router;
