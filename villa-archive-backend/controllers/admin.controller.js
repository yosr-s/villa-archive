const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ Créer un nouvel admin
exports.createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifie si email déjà existant
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Cet email existe déjà" });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin créé avec succès ✅", data:newAdmin });

  } catch (err) {
    console.error("Erreur création admin :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔑 Login admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Recherche de l'admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin introuvable" });
    }

    // Comparer les mots de passe
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Connexion réussie ✅",
      token,
      admin: { id: admin._id, email: admin.email }
    });

  } catch (err) {
    console.error("Erreur login admin :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
