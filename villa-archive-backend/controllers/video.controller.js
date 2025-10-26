//const fetch = require("node-fetch");
const Video = require("../models/video.model");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const VIMEO_ACCESS_TOKEN = process.env.VIMEO_ACCESS_TOKEN;

/* -------------------------------------------------------------------------- */
/* 🎥  CONTROLEUR VIMEO COMPLET : Upload + Métadonnées + CRUD                 */
/* -------------------------------------------------------------------------- */

/**
 * 🎬 Étape 1 : Crée une URL d’upload Vimeo via API
 * Frontend envoie : { title, description, size, isPrivate }
 * Vimeo répond avec : upload_link + vimeoId
 */
exports.createUploadUrl = async (req, res) => {
  try {
    const { title, description, size, isPrivate } = req.body;

    if (!size) {
      return res.status(400).json({ message: "La taille du fichier est requise." });
    }

    const response = await fetch("https://api.vimeo.com/me/videos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VIMEO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.vimeo.*+json;version=3.4",
      },
      body: JSON.stringify({
        upload: { approach: "tus", size },
        name: title || "Nouvel upload",
        description,
        privacy: { view: isPrivate ? "nobody" : "anybody" },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur création Vimeo :", data);
      return res.status(400).json({ message: "Erreur Vimeo", error: data });
    }

    const uploadUrl = data.upload?.upload_link;
    const vimeoId = data.uri?.split("/").pop();

    res.status(200).json({
      message: "Upload URL Vimeo créée ✅",
      uploadUrl,
      vimeoId,
    });
  } catch (err) {
    console.error("Erreur création URL Vimeo :", err);
    res.status(500).json({ message: "Erreur serveur Vimeo" });
  }
};

/**
 * 🧾 Étape 2 : Enregistre la vidéo dans MongoDB après upload
 * Frontend envoie : { title, description, thumbnail, vimeoId, creationDate, isPrivate }
 */
// exports.registerVideo = async (req, res) => {
//   try {
//     const { title, description, thumbnail, vimeoId, isPrivate, creationDate } = req.body;

//     if (!vimeoId) {
//       return res.status(400).json({ message: "vimeoId est requis." });
//     }

//     // 📡 Récupérer les métadonnées depuis Vimeo
//     const vimeoRes = await fetch(`https://api.vimeo.com/videos/${vimeoId}`, {
//       headers: { Authorization: `Bearer ${VIMEO_ACCESS_TOKEN}` },
//     });

//     if (!vimeoRes.ok) {
//       const errorText = await vimeoRes.text();
//       console.error("Erreur récupération métadonnées Vimeo :", errorText);
//       return res.status(400).json({ message: "Impossible de récupérer les infos Vimeo." });
//     }

//     const vimeoData = await vimeoRes.json();

//     // 🎞️ Générer les URLs
//     const embedUrl = `https://player.vimeo.com/video/${vimeoId}`;
//     const shareUrl = vimeoData.link || `https://vimeo.com/${vimeoId}`;
//     const finalThumbnail = thumbnail || vimeoData?.pictures?.sizes?.pop()?.link || "";

//     // 💾 Enregistrement MongoDB
//     const newVideo = new Video({
//       title: title || vimeoData.name,
//       description: description || vimeoData.description,
//       thumbnail: finalThumbnail,
//       embedUrl,
//       shareUrl,
//       vimeoId,
//       creationDate: creationDate || new Date().toISOString().split("T")[0],
//       isPrivate: isPrivate ?? false,
//     });

//     await newVideo.save();

//     res.status(201).json({
//       message: "Vidéo enregistrée dans la base ✅",
//       video: newVideo,
//     });
//   } catch (err) {
//     console.error("Erreur enregistrement vidéo :", err);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };

exports.registerVideo = async (req, res) => {
  try {
    const { title, description, embedUrl, shareUrl, vimeoId, creationDate, isPrivate } = req.body;

    if (!vimeoId) {
      return res.status(400).json({ message: "Missing Vimeo ID." });
    }

    // 🧠 Fonction utilitaire pour récupérer les infos vidéo Vimeo
    const getVimeoData = async () => {
      const vimeoRes = await fetch(`https://api.vimeo.com/videos/${vimeoId}`, {
        headers: { Authorization: `Bearer ${VIMEO_ACCESS_TOKEN}` },
      });
      if (!vimeoRes.ok) {
        const errorText = await vimeoRes.text();
        console.error("Erreur API Vimeo:", errorText);
        throw new Error("Erreur récupération vidéo Vimeo");
      }
      return vimeoRes.json();
    };

    // 🕓 Attente du transcodage si nécessaire
    let vimeoData = await getVimeoData();
    let attempts = 0;
    while (vimeoData?.transcode?.status !== "complete" && attempts < 20) {
      console.log(`⏳ En attente du transcodage... (${attempts + 1}/20)`);
      await new Promise((r) => setTimeout(r, 5000));
      vimeoData = await getVimeoData();
      attempts++;
    }

    console.log("🎥 Vimeo data:", vimeoData);

    // 🖼️ Récupération améliorée des miniatures
    let finalThumbnail = null;

    // 1️⃣ Prendre la plus grande miniature dispo
    if (vimeoData?.pictures?.sizes?.length > 0) {
      finalThumbnail = vimeoData.pictures.sizes.at(-1).link;
    }

    // 2️⃣ Sinon base_link (souvent sur vidéos non encore prêtes)
    else if (vimeoData?.pictures?.base_link) {
      finalThumbnail = vimeoData.pictures.base_link;
    }

    // 3️⃣ Sinon essayer de requêter /pictures séparément
    else if (vimeoData?.metadata?.connections?.pictures?.uri) {
      const picUri = vimeoData.metadata.connections.pictures.uri;
      const picRes = await fetch(`https://api.vimeo.com${picUri}`, {
        headers: { Authorization: `Bearer ${VIMEO_ACCESS_TOKEN}` },
      });
      if (picRes.ok) {
        const picData = await picRes.json();
        if (picData?.data?.[0]?.sizes?.length > 0) {
          finalThumbnail = picData.data[0].sizes.at(-1).link;
        } else {
          finalThumbnail = picData?.data?.[0]?.link || null;
        }
      }
    }

    // 4️⃣ Fallback si aucune image trouvée
    if (!finalThumbnail) {
      finalThumbnail = "https://i.vimeocdn.com/video/default-2308240_1920x1080?region=us";
    }

    // 💾 Sauvegarde MongoDB
    const newVideo = new Video({
      title: title || vimeoData.name,
      description: description || vimeoData.description,
      thumbnail: finalThumbnail,
      embedUrl: embedUrl || vimeoData.player_embed_url,
      shareUrl: shareUrl || vimeoData.link,
      vimeoId,
      creationDate: creationDate || new Date().toISOString(),
      isPrivate: !!isPrivate,
    });

    await newVideo.save();

    res.status(201).json({
      message: "Vidéo enregistrée dans la base ✅",
      video: newVideo,
    });
  } catch (err) {
    console.error("❌ Erreur création vidéo Vimeo :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* -------------------------------------------------------------------------- */
/* 📋  Autres opérations CRUD standard                                        */
/* -------------------------------------------------------------------------- */

// 🔍 Récupérer toutes les vidéos
// exports.getVideos = async (req, res) => {
//   try {
//     const videos = await Video.find().sort({ createdAt: -1 });
//     res.json(videos);
//   } catch (err) {
//     console.error("Erreur récupération vidéos :", err);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };

// exports.getVideos = async (req, res) => {
//   try {
//     const videos = await Video.aggregate([
//       {
//         $addFields: {
//           parsedDate: {
//             $cond: [
//               { $ne: ["$creationDate", null] },
//               { $dateFromString: { dateString: "$creationDate" } },
//               "$createdAt"
//             ]
//           }
//         }
//       },
//       { $sort: { parsedDate: -1 } }
//     ]);

//     res.status(200).json(videos);
//   } catch (error) {
//     console.error("❌ Erreur récupération vidéos :", error);
//     res.status(500).json({ message: "Erreur récupération vidéos" });
//   }
// };
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();

    const updatedVideos = await Promise.all(
      videos.map(async (video) => {
        try {
          if (!video.vimeoId) return video; // skip si pas de Vimeo ID

          const response = await fetch(`https://api.vimeo.com/videos/${video.vimeoId}`, {
            headers: { Authorization: `Bearer ${VIMEO_ACCESS_TOKEN}` },
          });

          if (!response.ok) {
            console.warn(`⚠️ Vimeo ${video.vimeoId} introuvable (${response.status})`);
            return video;
          }

          const vimeoData = await response.json();
          const newThumb =
            vimeoData?.pictures?.sizes?.at(-1)?.link ||
            vimeoData?.pictures?.base_link ||
            null;

          // 🧩 Vérifie si la miniature a changé
          if (newThumb && newThumb !== video.thumbnail) {
            video.thumbnail = newThumb;
            await video.save();
            console.log(`🖼️ Thumbnail mise à jour pour ${video.title}`);
          }

          return video;
        } catch (err) {
          console.error(`❌ Erreur mise à jour thumbnail pour ${video.vimeoId}`, err);
          return video; // continue quand même
        }
      })
    );

    // 🔽 Tri du plus récent au plus ancien
    const sorted = updatedVideos.sort((a, b) => {
      const dateA = new Date(a.creationDate || a.createdAt);
      const dateB = new Date(b.creationDate || b.createdAt);
      return dateB - dateA;
    });

    res.status(200).json(sorted);
  } catch (error) {
    console.error("❌ Erreur récupération vidéos :", error);
    res.status(500).json({ message: "Erreur récupération vidéos" });
  }
};
// 🔍 Récupérer une vidéo par ID Mongo
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Vidéo introuvable." });
    res.json(video);
  } catch (err) {
    console.error("Erreur récupération vidéo :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🗑️ Supprimer une vidéo
// exports.deleteVideo = async (req, res) => {
//   try {
//     const deletedVideo = await Video.findByIdAndDelete(req.params.id);
//     if (!deletedVideo) return res.status(404).json({ message: "Vidéo introuvable." });
//     res.json({ message: "Vidéo supprimée ✅" });
//   } catch (err) {
//     console.error("Erreur suppression vidéo :", err);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };
exports.deleteVideo = async (req, res) => {
  try {
    // 🧩 1. Supprimer de la base MongoDB
    const deletedVideo = await Video.findByIdAndDelete(req.params.id);
    if (!deletedVideo) {
      return res.status(404).json({ message: "Vidéo introuvable." });
    }

    const { vimeoId } = deletedVideo;
    if (!vimeoId) {
      console.warn("⚠️ Aucune vimeoId trouvée pour cette vidéo locale");
      return res.json({ message: "Vidéo supprimée localement ✅ (pas de vimeoId)" });
    }

    // 🎯 2. Supprimer depuis Vimeo via leur API
    const vimeoResponse = await fetch(`https://api.vimeo.com/videos/${vimeoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${VIMEO_ACCESS_TOKEN}`,
      },
    });

    if (vimeoResponse.status === 204) {
      console.log(`🗑️ Vidéo Vimeo ${vimeoId} supprimée avec succès`);
      return res.json({
        message: "Vidéo supprimée ✅ (local + Vimeo)",
        video: deletedVideo,
      });
    } else if (vimeoResponse.status === 404) {
      console.warn(`⚠️ Vidéo Vimeo ${vimeoId} déjà inexistante`);
      return res.json({
        message: "Vidéo supprimée localement ✅ (déjà absente sur Vimeo)",
        video: deletedVideo,
      });
    } else {
      const errorText = await vimeoResponse.text();
      console.error("Erreur suppression Vimeo :", errorText);
      return res.status(500).json({
        message: "Vidéo supprimée localement ⚠️ mais échec côté Vimeo",
        error: errorText,
      });
    }
  } catch (err) {
    console.error("❌ Erreur suppression vidéo :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// 🔁 Activer / désactiver visibilité
exports.toggleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Vidéo introuvable." });

    video.isPrivate = !video.isPrivate;
    await video.save();

    res.json({
      message: `Vidéo ${video.isPrivate ? "rendue privée" : "rendue publique"} ✅`,
      video,
    });
  } catch (err) {
    console.error("Erreur toggle visibilité :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 📥 Récupérer les infos Vimeo par ID
exports.getVimeoInfo = async (req, res) => {
  try {
    const { vimeoId } = req.params;
    const response = await fetch(`https://api.vimeo.com/videos/${vimeoId}`, {
      headers: { Authorization: `Bearer ${VIMEO_ACCESS_TOKEN}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur API Vimeo :", errorText);
      return res.status(400).json({ message: "Impossible de récupérer les infos Vimeo." });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Erreur récupération Vimeo info :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✏️ Mettre à jour les infos d’une vidéo (titre, description, date, visibilité)
exports.updateVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, creationDate, isPrivate } = req.body;

    // 🧩 Vérifie l’existence
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Vidéo introuvable." });
    }

    // 📝 Mise à jour des champs autorisés
    if (title !== undefined) video.title = title;
    if (description !== undefined) video.description = description;
    if (creationDate !== undefined) video.creationDate = creationDate;
    if (isPrivate !== undefined) video.isPrivate = isPrivate;

    await video.save();

    return res.status(200).json({
      message: "Vidéo mise à jour ✅",
      video,
    });
  } catch (err) {
    console.error("❌ Erreur update vidéo :", err);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour." });
  }
};

