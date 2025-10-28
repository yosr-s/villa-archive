// const Visitor = require('../models/visitor.model');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// // ✅ Créer un nouveau visitor
// exports.createVisitor = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Vérifie si email déjà existant
//     const existingVisitor = await Visitor.findOne({ email });
//     if (existingVisitor) {
//       return res.status(400).json({ message: "Cet email existe déjà" });
//     }

//     // Hash du mot de passe
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Création du visitor
//     const newVisitor = new Visitor({
//       email,
//       password: hashedPassword
//     });

//     await newVisitor.save();
//     res.status(201).json({ message: "Visitor créé avec succès ✅" , data: newVisitor});

//   } catch (err) {
//     console.error("Erreur création visitor :", err);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };

// // 🔑 Login visitor
// exports.loginVisitor = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Recherche du visitor
//     const visitor = await Visitor.findOne({ email });
//     if (!visitor) {
//       return res.status(404).json({ message: "Visitor introuvable" });
//     }

//     // Comparer les mots de passe
//     const isMatch = await bcrypt.compare(password, visitor.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Mot de passe incorrect" });
//     }

//     // Générer un token JWT
//     const token = jwt.sign(
//       { id: visitor._id, email: visitor.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       message: "Connexion réussie ✅",
//       token,
//       visitor: { id: visitor._id, email: visitor.email }
//     });

//   } catch (err) {
//     console.error("Erreur login visitor :", err);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };



const Visitor = require('../models/visitor.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * 🧠 Fonction utilitaire pour générer tokens
 */
const generateTokens = (visitor) => {
  const accessToken = jwt.sign(
    { id: visitor._id, email: visitor.email, role: "visitor" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // ⏳ token court (15 min)
  );

  const refreshToken = jwt.sign(
    { id: visitor._id, email: visitor.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // 🔁 refresh valide 7 jours
  );

  return { accessToken, refreshToken };
};

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
      password: hashedPassword,
    });

    await newVisitor.save();

    res.status(201).json({
      message: "Visitor créé avec succès ✅",
      data: { id: newVisitor._id, email: newVisitor.email },
    });
  } catch (err) {
    console.error("Erreur création visitor :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔑 Login visitor
exports.loginVisitor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const visitor = await Visitor.findOne({ email });
    if (!visitor) {
      return res.status(404).json({ message: "Visitor introuvable" });
    }

    const isMatch = await bcrypt.compare(password, visitor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const { accessToken, refreshToken } = generateTokens(visitor);

    // Optionnel : enregistrer le refresh token dans la DB
    visitor.refreshToken = refreshToken;
    await visitor.save();

    res.status(200).json({
      message: "Connexion réussie ✅",
      accessToken,
      refreshToken,
      visitor: { id: visitor._id, email: visitor.email },
    });
  } catch (err) {
    console.error("Erreur login visitor :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔁 Rafraîchir le token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "Aucun refresh token fourni" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const visitor = await Visitor.findById(decoded.id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor introuvable" });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      generateTokens(visitor);

    visitor.refreshToken = newRefreshToken;
    await visitor.save();

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("Erreur refresh token visitor :", err);
    res.status(403).json({ message: "Token de rafraîchissement invalide ou expiré" });
  }
};

// 🚪 Logout visitor
exports.logoutVisitor = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Aucun refresh token fourni" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const visitor = await Visitor.findById(decoded.id);

    if (visitor) {
      visitor.refreshToken = null;
      await visitor.save();
    }

    res.status(200).json({ message: "Déconnexion réussie ✅" });
  } catch (err) {
    console.error("Erreur logout visitor :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
