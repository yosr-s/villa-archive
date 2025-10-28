import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// 🧩 Crée une seule instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Intercepteur des requêtes : ajoute automatiquement le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ Aucun token trouvé — requête sans Authorization");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Intercepteur de réponse : gère automatiquement le refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        console.log("🔁 Token expiré — tentative de refresh...");

        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(`${API_BASE_URL}/admin/refresh-token`, {
          refreshToken,
        });

        if (res.data?.accessToken) {
          console.log("✅ Nouveau token reçu");
          localStorage.setItem("accessToken", res.data.accessToken);

          // Réessaye la requête avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.error("❌ Refresh token invalide ou expiré", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/admin/login"; // redirection propre
      }
    }

    return Promise.reject(error);
  }
);

export default api;
