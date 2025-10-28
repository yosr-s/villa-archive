const jwt = require("jsonwebtoken");

// ✅ Export direct d’une seule fonction
// module.exports = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "Brak tokena" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res
//         .status(403)
//         .json({ message: "Token nieprawidłowy lub wygasł" });
//     }
//     req.user = decoded;
//     next();
//   });
// };
module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Aucun token fourni" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Token invalide ou expiré ❌" });
      }

      // Ajout du user dans la requête
      req.user = decoded;

      // Si un rôle est exigé → vérifier
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decoded.role)
      ) {
        return res.status(403).json({
          message: "Accès refusé : rôle insuffisant 🚫",
        });
      }

      next();
    });
  };
};