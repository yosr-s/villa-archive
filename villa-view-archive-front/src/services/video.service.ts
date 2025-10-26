import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/**
 * 🎥 Service de gestion des vidéos (Upload Vimeo + CRUD MongoDB)
 */
export const videoService = {
  /**
   * 1️⃣ Demander une URL d’upload à Vimeo
   * @param title titre de la vidéo
   * @param description description de la vidéo
   * @param size taille du fichier (en octets)
   * @param isPrivate vidéo privée ou publique
   */
  async createUploadUrl(title: string, description: string, size: number, isPrivate: boolean) {
    try {
      const res = await axios.post(`${API_BASE_URL}/videos/upload-url`, {
        title,
        description,
        size,
        isPrivate,
      });
      return res.data; // { uploadUrl, vimeoId }
    } catch (error: any) {
      console.error("❌ Erreur création URL Vimeo :", error.response?.data || error.message);
      throw error.response?.data || { message: "Erreur lors de la création de l’URL Vimeo" };
    }
  },

  /**
   * 2️⃣ Upload du fichier vidéo vers Vimeo via TUS
   * @param uploadUrl URL d’upload reçue depuis Vimeo
   * @param file Fichier vidéo local
   */
  async uploadToVimeo(uploadUrl: string, file: File) {
    try {
      const res = await axios.patch(uploadUrl, file, {
        headers: {
          "Tus-Resumable": "1.0.0",
          "Upload-Offset": "0",
          "Content-Type": "application/offset+octet-stream",
        },
      });
      return res;
    } catch (error: any) {
      console.error("❌ Erreur upload Vimeo :", error.response?.data || error.message);
      throw error.response?.data || { message: "Erreur upload Vimeo" };
    }
  },

  /**
   * 3️⃣ Enregistrer les métadonnées de la vidéo dans MongoDB
   * @param videoData { title, description, thumbnail, vimeoId, creationDate, isPrivate }
   */
  async registerVideo(videoData: {
    title: string;
    description?: string;
    thumbnail?: string;
    vimeoId: string;
    creationDate?: string;
    isPrivate?: boolean;
  }) {
    try {
      const res = await axios.post(`${API_BASE_URL}/videos/register`, videoData);
      return res.data;
    } catch (error: any) {
      console.error("❌ Erreur enregistrement MongoDB :", error.response?.data || error.message);
      throw error.response?.data || { message: "Erreur enregistrement MongoDB" };
    }
  },

  /**
   * 4️⃣ Récupérer toutes les vidéos
   */
  async getVideos() {
    try {
      const res = await axios.get(`${API_BASE_URL}/videos`);
      return res.data;
    } catch (error: any) {
      console.error("❌ Erreur récupération vidéos :", error.response?.data || error.message);
      throw error.response?.data || { message: "Erreur récupération vidéos" };
    }
  },

  /**
   * 5️⃣ Récupérer une vidéo spécifique (par ID Mongo)
   */
  async getVideoById(id: string) {
    try {
      const res = await axios.get(`${API_BASE_URL}/videos/${id}`);
      return res.data;
    } catch (error: any) {
      console.error("❌ Erreur récupération vidéo :", error.response?.data || error.message);
      throw error.response?.data || { message: "Erreur récupération vidéo" };
    }
  },

  /**
   * 6️⃣ Supprimer une vidéo
   */
  async deleteVideo(id: string) {
    try {
      const res = await axios.delete(`${API_BASE_URL}/videos/${id}`);
      return res.data;
    } catch (error: any) {
      console.error("❌ Erreur suppression vidéo :", error.response?.data || error.message);
      throw error.response?.data || { message: "Erreur suppression vidéo" };
    }
  },

  /**
   * 7️⃣ Changer la visibilité (public ↔ privé)
   */
  async toggleActive(id: string) {
    try {
      const res = await axios.patch(`${API_BASE_URL}/videos/${id}/toggle`);
      return res.data;
    } catch (error: any) {
      console.error("❌ Erreur toggle visibilité :", error.response?.data || error.message);
      throw error.response?.data || { message: "Erreur changement visibilité" };
    }
  },

  /**
   * 8️⃣ Récupérer les infos directes depuis l’API Vimeo
   */
  async getVimeoInfo(vimeoId: string) {
    try {
      const res = await axios.get(`${API_BASE_URL}/videos/vimeo/${vimeoId}`);
      return res.data;
    } catch (error: any) {
      console.error("❌ Erreur récupération Vimeo info :", error.response?.data || error.message);
      throw error.response?.data || { message: "Erreur récupération Vimeo" };
    }
  },


    // 9️⃣ ✅ Mettre à jour une vidéo par ID (titre, description, date, visibilité)
  async updateVideoById(id: string, updates: {
    title?: string;
    description?: string;
    creationDate?: string;
    isPrivate?: boolean;
  }) {
    try {
      const res = await axios.patch(`${API_BASE_URL}/videos/${id}`, updates);
      return res.data;
    } catch (error: any) {
      console.error("❌ Erreur update vidéo :", error.response?.data || error.message);
      throw error.response?.data || { message: "Erreur mise à jour vidéo" };
    }
  },
};
