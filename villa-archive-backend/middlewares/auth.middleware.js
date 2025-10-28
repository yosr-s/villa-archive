const jwt = require("jsonwebtoken");

// ✅ Export direct d’une seule fonction
module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Brak tokena" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token nieprawidłowy lub wygasł" });
    }
    req.user = decoded;
    next();
  });
};
