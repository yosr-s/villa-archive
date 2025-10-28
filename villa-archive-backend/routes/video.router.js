const express = require("express");
const router = express.Router();
const videoController = require("../controllers/video.controller");
const verifyAuth = require("../middlewares/auth.middleware")
// 🟣 Upload Vimeo complet
router.post("/upload-url", verifyAuth(["admin"]), videoController.createUploadUrl);  // Étape 1
router.post("/register",verifyAuth(["admin"]), videoController.registerVideo);      // Étape 2

// 🟢 CRUD
router.get("/", verifyAuth(["admin"]), videoController.getVideos);
router.get("/public", verifyAuth(["admin", "visitor"]), videoController.getPublicVideos);

router.get("/:id",verifyAuth(["admin", "visitor"]), videoController.getVideoById);
router.delete("/:id",verifyAuth(["admin"]), videoController.deleteVideo);
router.patch("/:id/toggle",verifyAuth(["admin"]), videoController.toggleActive);
router.patch("/:id",verifyAuth(["admin"]), videoController.updateVideoById); // ✅ nouvelle route
router.get("/:vimeoId/download",verifyAuth(["admin"]), videoController.downloadVideo);


// 📥 Infos directes Vimeo
router.get("/vimeo/:vimeoId", videoController.getVimeoInfo);

module.exports = router;
