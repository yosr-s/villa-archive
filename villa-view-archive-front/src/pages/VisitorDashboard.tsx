import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import ExploreArchive from '../components/ExploreArchive';
import { toast } from "@/hooks/use-toast";
import { useVideos } from "../contexts/VideoContext";


const VisitorDashboard = () => {
  const { user, logout } = useAuth();
  const { fetchPublicVideos } = useVideos();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'visitor') {
      navigate('/visitor/login');
    } else {
       fetchPublicVideos().catch((err) => {
              console.warn("Erreur chargement vidéos :", err);
              toast({
                title: "⚠️ Błąd ładowania",
                description: "Nie udało się załadować listy wideo.",
                variant: "destructive",
              });
            });
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
//     <div className="relative min-h-screen">
      
//       <div
//   className="absolute inset-0 bg-luxury-silver" // couleur gris clair Tailwind
//   style={{
//     backgroundColor: "#f2f2f2", // optionnel : couleur personnalisée
//     opacity: 1, // pas de transparence
//   }}
//   aria-hidden="true"
// />


//       {/* Foreground content */}
//       <div className="relative z-10">
//         {/* Header */}
//         <header className="bg-white border-b border-gray-200 luxury-shadow">
//           <div className="container mx-auto px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="font-luxury text-2xl font-semibold text-luxury-darkGrey">
//                   Archiwum domu
//                 </h1>
//                 <p className="text-luxury-grey">Przeglądaj kolekcję wideo</p>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center space-x-2 text-luxury-grey hover:text-luxury-darkGrey transition-colors"
//               >
//                 <LogOut className="w-4 h-4" />
//                 <span>Wyloguj się</span>
//               </button>
//             </div>
//           </div>
//         </header>

//         {/* Content */}
//         <div className="container mx-auto px-6 py-8">
//           <ExploreArchive isAdmin={false} />
//         </div>
//       </div>
//     </div>
<div className="relative min-h-screen bg-[#d9d9d9] text-gray-800">
  {/* --- Foreground content --- */}
  <div className="relative z-10">
    {/* --- Header identique admin --- */}
    <header className="bg-[#e6e6e6]/90 backdrop-blur-md border-b border-gray-400 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-luxury text-2xl font-semibold text-gray-900">
            Archiwum domu
          </h1>
          <p className="text-gray-600 text-sm">Przeglądaj kolekcję wideo</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Wyloguj się</span>
        </button>
      </div>
    </header>

    {/* --- Contenu principal --- */}
    <main className="container mx-auto px-6 py-10">
      <ExploreArchive isAdmin={false} />
    </main>
  </div>
</div>

  );
};

export default VisitorDashboard;
