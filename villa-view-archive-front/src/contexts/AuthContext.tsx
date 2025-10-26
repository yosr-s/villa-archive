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
  logout: () => void;
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

  useEffect(() => {
    const savedUser = localStorage.getItem("villa-user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setIsLoading(false);
  }, []);

  /**
   * 🔐 Authentification dynamique selon le rôle
   */
  const login = async (email: string, password: string, role: "admin" | "visitor"): Promise<boolean> => {
    try {
      let response;

      if (role === "admin") {
        response = await adminService.login(email, password);
      } else {
        response = await visitorService.login(email, password);
      }

      if (response?.token) {
        const userData: User = {
          id: response.user?._id || `${role}-${Date.now()}`,
          email: response.user?.email || email,
          role,
          token: response.token,
        };

        localStorage.setItem("villa-user", JSON.stringify(userData));
        localStorage.setItem(`${role}Token`, response.token);
        setUser(userData);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erreur de connexion :", error);
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

      setUser(null);
      localStorage.removeItem("villa-user");
    } catch (error) {
      console.error("Erreur logout :", error);
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
