const express = require('express');
const router = express.Router();
const { createVisitor, loginVisitor } = require('../controllers/visitor.controller');

// 🧾 Créer un visitor
router.post('/create', createVisitor);

// 🔐 Login visitor
router.post('/login', loginVisitor);

module.exports = router;
