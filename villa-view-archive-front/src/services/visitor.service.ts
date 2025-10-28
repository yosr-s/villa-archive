// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// export const visitorService = {


//   /**
//    * 🔐 Connexion du visiteur
//    */
//   async login(email: string, password: string) {
//     try {
//       const res = await axios.post(`${API_BASE_URL}/visitor/login`, { email, password });
//       if (res.data?.token) {
//         localStorage.setItem("visitorToken", res.data.token);
//       }
//       return res.data; // { token, user }
//     } catch (error: any) {
//       console.error("Erreur connexion visiteur :", error.response?.data || error.message);
//       throw error.response?.data || { message: "Erreur de connexion visiteur" };
//     }
//   },

//   /**
//    * 🚪 Déconnexion du visiteur
//    */
//   logout() {
//     localStorage.removeItem("visitorToken");
//   },

//   /**
//    * 🧠 Vérifie si connecté
//    */
//   isAuthenticated() {
//     return !!localStorage.getItem("visitorToken");
//   },
// };
import api from "./interceptors/axios.interceptor";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const visitorService = {
  /**
   * 🔐 Connexion du visiteur
   */
  async login(email: string, password: string) {
    try {
      const res = await api.post("/visitor/login", { email, password });

      const { accessToken, refreshToken, visitor } = res.data;

      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem(
          "villa-user",
          JSON.stringify({
            id: visitor?.id,
            email: visitor?.email,
            role: "visitor",
          })
        );
      }

      return res.data;
    } catch (error: any) {
      console.error(
        "❌ Erreur connexion visiteur :",
        error.response?.data || error.message
      );
      throw error.response?.data || { message: "Erreur de connexion visiteur" };
    }
  },

  /**
   * 🚪 Déconnexion du visiteur
   */
  async logout() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/visitor/logout", { refreshToken });
      }
    } catch (err) {
      console.warn("⚠️ Erreur lors du logout visiteur :", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("villa-user");
    }
  },

  /**
   * 🔁 Rafraîchir manuellement le token
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("Aucun refresh token trouvé");

      const res = await api.post("/visitor/refresh-token", { refreshToken });

      if (res.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
      }

      return res.data;
    } catch (err) {
      console.error("❌ Erreur refresh token visiteur :", err);
      throw err;
    }
  },

  /**
   * 🧠 Vérifie si le visiteur est connecté
   */
  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  },
};
