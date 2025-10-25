const express = require('express');
const router = express.Router();
const { createAdmin, loginAdmin } = require('../controllers/admin.controller');

// 🧾 Créer un admin
router.post('/create', createAdmin);

// 🔐 Login admin
router.post('/login', loginAdmin);

module.exports = router;
