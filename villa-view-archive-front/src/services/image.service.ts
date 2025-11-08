import api from "./interceptors/axios.interceptor";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/**
 * 🖼️ Service de gestion des images (Upload + CRUD MongoDB)
 */
export const imageService = {
  /**
   * 1️⃣ Upload d’une image vers le backend (multer)
   * @param file fichier image
   * @param album nom de l’album (garden / seasons / garden_reconstruction)
   */
  async uploadImage(file: File, album: string) {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("album", album);

      const res = await api.post(`${API_BASE_URL}/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (error: any) {
      console.error("❌ Erreur upload image :", error.response?.data || error.message);
      throw error.response?.data || { message: "Erreur upload image" };
    }
  },

  /**
   * 2️⃣ Upload multiple (plusieurs fichiers à la fois)
   * @param files tableau de fichiers
   * @param album nom de l’album
   */
  async uploadMultipleImages(files: File[], album: string) {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      formData.append("album", album);

      const res = await api.post(`${API_BASE_URL}/images/multiple`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (error: any) {
      console.error("❌ Erreur upload multiple :", error.response?.data || error.message);
      throw error.response?.data || { message: "Erreur upload multiple" };
    }
  },

  /**
   * 3️⃣ Récupérer toutes les images
   */
  async getAllImages() {
    try {
      const res = await api.get(`${API_BASE_URL}/images`);
      return res.data;
    } catch (error: any) {
      console.error("❌ Erreur récupération images :", error.response?.data || error.message);
      throw error.response?.data || { message: "Erreur récupération images" };
    }
  },

  /**
   * 4️⃣ Récupérer les images par album
   * @param album nom de l’album
   */
//   async getImagesByAlbum(album: string) {
//     try {
//       const res = await api.get(`${API_BASE_URL}/images/album/${album}`);
//       return res.data;
//     } catch (error: any) {
//       console.error("❌ Erreur récupération par album :", error.response?.data || error.message);
//       throw error.response?.data || { message: "Erreur récupération images par album" };
//     }
//   },
async getImagesByAlbum(album: string) {
  try {
    const res = await api.get(`${API_BASE_URL}/images/album/${album}`);
    // ✅ Toujours renvoyer un tableau
    return Array.isArray(res.data) ? res.data : [];
  } catch (error: any) {
    console.error("❌ Erreur récupération par album :", error.response?.data || error.message);

    // ✅ Si c’est une erreur 404 (album vide), on retourne un tableau vide au lieu de lancer une exception
    if (error.response?.status === 404) {
      return [];
    }

    // ❌ Autres erreurs : on relance
    throw error.response?.data || { message: "Erreur récupération images par album" };
  }
}
,

  /**
   * 5️⃣ Supprimer une image par ID
   * @param id identifiant MongoDB
   */
  async deleteImage(id: string) {
    try {
      const res = await api.delete(`${API_BASE_URL}/images/${id}`);
      return res.data;
    } catch (error: any) {
      console.error("❌ Erreur suppression image :", error.response?.data || error.message);
      throw error.response?.data || { message: "Erreur suppression image" };
    }
  },
};
