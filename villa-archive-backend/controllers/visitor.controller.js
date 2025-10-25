const Visitor = require('../models/visitor.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ Créer un nouveau visitor
exports.createVisitor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifie si email déjà existant
    const existingVisitor = await Visitor.findOne({ email });
    if (existingVisitor) {
      return res.status(400).json({ message: "Cet email existe déjà" });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du visitor
    const newVisitor = new Visitor({
      email,
      password: hashedPassword
    });

    await newVisitor.save();
    res.status(201).json({ message: "Visitor créé avec succès ✅" , data: newVisitor});

  } catch (err) {
    console.error("Erreur création visitor :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔑 Login visitor
exports.loginVisitor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Recherche du visitor
    const visitor = await Visitor.findOne({ email });
    if (!visitor) {
      return res.status(404).json({ message: "Visitor introuvable" });
    }

    // Comparer les mots de passe
    const isMatch = await bcrypt.compare(password, visitor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: visitor._id, email: visitor.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Connexion réussie ✅",
      token,
      visitor: { id: visitor._id, email: visitor.email }
    });

  } catch (err) {
    console.error("Erreur login visitor :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
