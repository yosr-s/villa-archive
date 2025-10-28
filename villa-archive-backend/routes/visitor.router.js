const express = require('express');
const router = express.Router();
const { createVisitor, loginVisitor , refreshToken, logoutVisitor} = require('../controllers/visitor.controller');

// // 🧾 Créer un visitor
// router.post('/create', createVisitor);

// // 🔐 Login visitor
// router.post('/login', loginVisitor);
// 🧾 Création d’un visitor
router.post("/create", createVisitor);

// 🔐 Login
router.post("/login", loginVisitor);

// 🔁 Refresh token
router.post("/refresh-token", refreshToken);

// 🚪 Logout
router.post("/logout", logoutVisitor);
module.exports = router;
