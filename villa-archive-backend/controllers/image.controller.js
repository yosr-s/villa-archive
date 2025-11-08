const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Image = require("../models/image.model");

// 📦 Configuration Multer (stockage local)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = uniqueSuffix + "-" + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// ✅ Middleware d’upload à exporter vers les routes
exports.uploadMiddleware = upload.single("image"); // ou `.array("images", 10)` pour multiple

// ➕ Dodaj nowe zdjęcie (upload + zapis w bazie)
exports.addImage = async (req, res) => {
    console.log("add image")
  try {
    const { album } = req.body;
    const file = req.file;

    if (!album || !file) {
      return res
        .status(400)
        .json({ message: "Brakuje danych (plik lub album)." });
    }

    const newImage = new Image({
      name: file.filename,
      album,
    });

    await newImage.save();

    res.status(201).json({
      message: "📸 Zdjęcie zostało przesłane i zapisane pomyślnie!",
      image: newImage,
    });
  } catch (error) {
    console.error("Błąd podczas dodawania zdjęcia:", error);
    res.status(500).json({ message: "Nie udało się dodać zdjęcia." });
  }
};

// 📋 Pobierz wszystkie zdjęcia
exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    console.error("Błąd pobierania zdjęć:", error);
    res.status(500).json({ message: "Nie udało się pobrać listy zdjęć." });
  }
};

// 📂 Pobierz zdjęcia według albumu
exports.getImagesByAlbum = async (req, res) => {
  try {
    const { album } = req.params;
    const images = await Image.find({ album }).sort({ createdAt: -1 });

    if (!images.length) {
      return res
        .status(404)
        .json({ message: `Brak zdjęć w albumie: ${album}` });
    }

    res.status(200).json(images);
  } catch (error) {
    console.error("Błąd pobierania zdjęć:", error);
    res.status(500).json({ message: "Nie udało się pobrać zdjęć." });
  }
};

// ❌ Usuń zdjęcie po ID (z serwera + bazy)
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ message: "Zdjęcie nie zostało znalezione." });
    }

    const filePath = path.join(__dirname, "../uploads", image.name);

    // usuń plik z dysku, jeśli istnieje
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Image.findByIdAndDelete(id);
    res.status(200).json({ message: "🗑️ Zdjęcie zostało usunięte." });
  } catch (error) {
    console.error("Błąd usuwania zdjęcia:", error);
    res.status(500).json({ message: "Nie udało się usunąć zdjęcia." });
  }
};
