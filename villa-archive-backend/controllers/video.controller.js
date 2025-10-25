const fetch = require('node-fetch');
const Video = require('../models/video.model');

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN;

/* -------------------------------------------------------------------------- */
/* 🟢 CRUD SIMPLIFIÉ                                                          */
/* -------------------------------------------------------------------------- */

// 🎬 Créer une nouvelle vidéo manuellement
exports.createVideo = async (req, res) => {
  try {
    const { title, description, thumbnail, url, isPrivate } = req.body;
    if (!title || !url)
      return res.status(400).json({ message: "Le titre et l'URL sont obligatoires." });

    const newVideo = new Video({ title, description, thumbnail, url, isPrivate });
    await newVideo.save();

    res.status(201).json({
      message: 'Vidéo créée avec succès ✅',
      video: newVideo
    });
  } catch (err) {
    console.error('Erreur création vidéo :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 📋 Récupérer toutes les vidéos (sans filtre)
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error('Erreur récupération vidéos :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 🔍 Récupérer une vidéo par ID
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video)
      return res.status(404).json({ message: 'Vidéo introuvable.' });
    res.json(video);
  } catch (err) {
    console.error('Erreur récupération vidéo :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 🗑️ Supprimer une vidéo
exports.deleteVideo = async (req, res) => {
  try {
    const deletedVideo = await Video.findByIdAndDelete(req.params.id);
    if (!deletedVideo)
      return res.status(404).json({ message: 'Vidéo introuvable.' });
    res.json({ message: 'Vidéo supprimée ✅' });
  } catch (err) {
    console.error('Erreur suppression vidéo :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 🔁 Activer / désactiver une vidéo
exports.toggleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video)
      return res.status(404).json({ message: 'Vidéo introuvable.' });

    video.isPrivate = !video.isPrivate;
    await video.save();

    res.json({
      message: `Vidéo ${video.isPrivate ? 'activée' : 'désactivée'} ✅`,
      video
    });
  } catch (err) {
    console.error('Erreur changement statut vidéo :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/* -------------------------------------------------------------------------- */
/* 🟣 CLOUDLFARE STREAM                                                       */
/* -------------------------------------------------------------------------- */

// 📤 Créer une URL d’upload direct ET enregistrer la vidéo dans MongoDB
exports.createUploadUrl = async (req, res) => {
  try {
    const { title, description, thumbnail, isPrivate } = req.body;
    if (!title)
      return res.status(400).json({ message: 'Le titre est obligatoire.' });

    // 1️⃣ Créer une URL d’upload Cloudflare Stream
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/direct_upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CF_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          maxDurationSeconds: 7200,
          allowedOrigins: ['*']
        })
      }
    );

    const data = await response.json();
    if (!data.success) throw new Error(JSON.stringify(data.errors));

    const { uploadURL, uid } = data.result;

    // 2️⃣ Créer une entrée MongoDB
    const newVideo = new Video({
      title,
      description,
      thumbnail,
      url: `https://iframe.videodelivery.net/${uid}`,
      cloudflareId: uid,
      isPrivate: isPrivate !== undefined ? isPrivate : true
    });

    await newVideo.save();

    // 3️⃣ Retourner l'uploadURL et l'objet vidéo
    res.status(201).json({
      message: 'URL d’upload créée et vidéo enregistrée ✅',
      uploadURL,
      video: newVideo
    });

  } catch (err) {
    console.error('Erreur création upload URL Cloudflare:', err);
    res.status(500).json({ message: 'Erreur Cloudflare Stream' });
  }
};

// 🌐 Upload depuis une URL distante
exports.uploadFromUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url)
      return res.status(400).json({ message: 'URL source requise.' });

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/copy`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CF_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      }
    );

    const data = await response.json();
    if (!data.success) throw new Error(JSON.stringify(data.errors));

    res.json(data.result);
  } catch (err) {
    console.error('Erreur upload via URL Cloudflare:', err);
    res.status(500).json({ message: 'Erreur Cloudflare Stream' });
  }
};

// 📥 Récupérer les infos d'une vidéo Cloudflare
exports.getStreamInfo = async (req, res) => {
  try {
    const { uid } = req.params;
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/${uid}`,
      {
        headers: { 'Authorization': `Bearer ${CF_API_TOKEN}` }
      }
    );

    const data = await response.json();
    if (!data.success) throw new Error(JSON.stringify(data.errors));

    res.json(data.result);
  } catch (err) {
    console.error('Erreur récupération vidéo Cloudflare:', err);
    res.status(500).json({ message: 'Erreur Cloudflare Stream' });
  }
};
