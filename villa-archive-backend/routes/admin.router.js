const express = require('express');
const router = express.Router();
const { createAdmin, loginAdmin , refreshToken , logoutAdmin  } = require('../controllers/admin.controller');

// 🧾 Créer un admin
router.post('/create', createAdmin);

// 🔐 Login admin
router.post('/login', loginAdmin);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutAdmin);

module.exports = router;
