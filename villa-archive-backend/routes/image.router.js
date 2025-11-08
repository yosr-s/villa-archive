const express = require("express");
const router = express.Router();
const imageController = require("../controllers/image.controller");
const verifyAuth = require("../middlewares/auth.middleware")

// POST /api/images  → upload + add to DB
router.post(
  "/",verifyAuth(["admin"]),
  imageController.uploadMiddleware, // ✅ multer middleware
  imageController.addImage
);

// GET /api/images
router.get("/",verifyAuth(["admin", "visitor"]), imageController.getAllImages);

// GET /api/images/album/:album
router.get("/album/:album",verifyAuth(["admin", "visitor"]), imageController.getImagesByAlbum);

// DELETE /api/images/:id
router.delete("/:id",verifyAuth(["admin"]), imageController.deleteImage);

module.exports = router;
