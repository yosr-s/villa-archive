require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


const adminRoutes = require('./routes/admin.router');
const visitorRoutes = require('./routes/visitor.router');
const videoRoutes = require('./routes/video.router');
const imageRoutes = require('./routes/image.router');


const app = express();
app.use(express.json());
//app.use(cors());
// Express example
// app.use(cors({
//   origin: ['https://archiwumdomu.pl', 'https://www.archiwumdomu.pl' , 'http://localhost:8080'],
//   credentials: true
// }));
const allowedOrigins = [
  "http://localhost:8080", // ✅ ton front local
  "https://archiwumdomu.pl",
  "https://www.archiwumdomu.pl",
];

app.use(cors({
  origin: function (origin, callback) {
    // autoriser aussi Postman / appels internes sans origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ Requête refusée par CORS:", origin);
      callback(new Error("CORS non autorisé"));
    }
  },
  credentials: true,
}));


// 🔗 Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch((err) => console.error('❌ Erreur MongoDB :', err));

// 🌐 Routes
app.use('/api/admin', adminRoutes);
app.use('/api/visitor', visitorRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/images', imageRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// 🏗️ SERVIR LE FRONTEND (React build)
const frontendPath = path.join(__dirname, 'public');
app.use(express.static(frontendPath));




// 🚀 Lancement serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Serveur en marche sur http://localhost:${PORT}`));
