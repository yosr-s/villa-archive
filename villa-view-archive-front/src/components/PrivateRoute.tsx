import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PrivateRouteProps {
  allowedRole?: "admin" | "visitor";
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRole, children }) => {
  const { user, isLoading } = useAuth();

  // ⏳ Pendant le chargement du contexte, on ne fait rien
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500">
        Trwa ładowanie...
      </div>
    );
  }

  // ❌ Aucun utilisateur connecté
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // 🚫 Mauvais rôle (ex: visiteur sur route admin)
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // ✅ Accès autorisé
  return children;
};

export default PrivateRoute;
