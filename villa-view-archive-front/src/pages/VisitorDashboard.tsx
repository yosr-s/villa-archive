import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import ExploreArchive from '../components/ExploreArchive';
import { toast } from "@/hooks/use-toast";

const VisitorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'visitor') {
      navigate('/visitor/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'visitor') {
    return null;
  }

const handleLogout = async () => {
  await logout();
  toast({
    title: "👋 Wylogowano",
    description: "Zostałeś pomyślnie wylogowany z konta gościa.",
  });
  navigate("/");
};


  return (
    <div className="relative min-h-screen">
      {/* 🌄 Background image with its own opacity */}
      {/* <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/lovable-uploads/02001situation.jpg')",
          opacity: 0.2, // 👈 only the background fades
        }}
        aria-hidden="true"
      /> */}
      <div
  className="absolute inset-0 bg-gray-200" // couleur gris clair Tailwind
  style={{
    backgroundColor: "#f2f2f2", // optionnel : couleur personnalisée
    opacity: 1, // pas de transparence
  }}
  aria-hidden="true"
/>


      {/* Foreground content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 luxury-shadow">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-luxury text-2xl font-semibold text-luxury-darkGrey">
                  Archiwum willi
                </h1>
                <p className="text-luxury-grey">Przeglądaj ekskluzywną kolekcję wideo</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-luxury-grey hover:text-luxury-darkGrey transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Wyloguj się</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="container mx-auto px-6 py-8">
          <ExploreArchive isAdmin={false} />
        </div>
      </div>
    </div>
  );
};

export default VisitorDashboard;
