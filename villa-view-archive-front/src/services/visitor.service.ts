import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const visitorService = {


  /**
   * 🔐 Connexion du visiteur
   */
  async login(email: string, password: string) {
    try {
      const res = await axios.post(`${API_BASE_URL}/visitor/login`, { email, password });
      if (res.data?.token) {
        localStorage.setItem("visitorToken", res.data.token);
      }
      return res.data; // { token, user }
    } catch (error: any) {
      console.error("Erreur connexion visiteur :", error.response?.data || error.message);
      throw error.response?.data || { message: "Erreur de connexion visiteur" };
    }
  },

  /**
   * 🚪 Déconnexion du visiteur
   */
  logout() {
    localStorage.removeItem("visitorToken");
  },

  /**
   * 🧠 Vérifie si connecté
   */
  isAuthenticated() {
    return !!localStorage.getItem("visitorToken");
  },
};
