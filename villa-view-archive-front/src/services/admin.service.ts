import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api"; 
// ⚙️ adapte selon ton backend

export const adminService = {
  /**
   * 🔐 Admin login
   */
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, { email, password });
      if (response.data?.token) {
        localStorage.setItem("adminToken", response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error("Erreur de connexion admin :", error.response?.data || error.message);
      throw error.response?.data || { message: "Erreur de connexion" };
    }
  },

  /**
   * 🚪 Déconnexion admin
   */
  logout: () => {
    localStorage.removeItem("adminToken");
  },

  /**
   * 🧠 Vérifier si connecté
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("adminToken");
  },
};
