import React, { createContext, useContext, useState, useEffect } from "react";
import { adminService } from "../services/admin.service";
import { visitorService } from "../services/visitor.service";

interface User {
  id: string;
  email: string;
  role: "admin" | "visitor";
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: "admin" | "visitor") => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 📦 Restaure la session depuis le localStorage
   */
  useEffect(() => {
    const savedUser = localStorage.getItem("villa-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  /**
   * 🔐 Connexion selon le rôle
   */
  const login = async (
    email: string,
    password: string,
    role: "admin" | "visitor"
  ): Promise<boolean> => {
    try {
      let response: any;

      if (role === "admin") {
        response = await adminService.login(email, password);
      } else {
        response = await visitorService.login(email, password);
      }

      // ✅ Nouveau format unifié
      const accessToken = response?.accessToken;
      const refreshToken = response?.refreshToken;
      const profile =
        role === "admin" ? response.admin : response.visitor || response.user;

      if (accessToken && refreshToken) {
        const userData: User = {
          id: profile?.id || `${role}-${Date.now()}`,
          email: profile?.email || email,
          role,
          token: accessToken,
        };

        // Sauvegarde
        localStorage.setItem("villa-user", JSON.stringify(userData));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setUser(userData);
        return true;
      }

      return false;
    } catch (error) {
      console.error("❌ Erreur de connexion :", error);
      return false;
    }
  };

  /**
   * 🚪 Déconnexion globale
   */
  const logout = async () => {
    try {
      if (user?.role === "admin") {
        await adminService.logout();
      } else if (user?.role === "visitor") {
        await visitorService.logout();
      }
    } catch (error) {
      console.warn("⚠️ Erreur logout :", error);
    } finally {
      setUser(null);
      localStorage.removeItem("villa-user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
