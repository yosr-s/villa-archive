require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


const adminRoutes = require('./routes/admin.router');
const visitorRoutes = require('./routes/visitor.router');
const videoRoutes = require('./routes/video.router');


const app = express();
app.use(express.json());
app.use(cors());

// 🔗 Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch((err) => console.error('❌ Erreur MongoDB :', err));

// 🌐 Routes
app.use('/api/admin', adminRoutes);
app.use('/api/visitor', visitorRoutes);
app.use('/api/videos', videoRoutes);

// 🏗️ SERVIR LE FRONTEND (React build)
const frontendPath = path.join(__dirname, 'public');
app.use(express.static(frontendPath));


// 🚀 Lancement serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Serveur en marche sur http://localhost:${PORT}`));
