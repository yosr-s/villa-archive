import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Upload, List, Clock } from 'lucide-react';
import AddVideo from '../components/admin/AddVideo';
import VideoList from '../components/admin/VideoList';
import ExploreArchive from '../components/ExploreArchive';
import { toast } from "@/hooks/use-toast"; // ✅ importe bien ton hook
import { useTheme } from "../hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import { useVideos } from "../contexts/VideoContext";


const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { fetchVideos } = useVideos();


  // useEffect(() => {
  //   if (!user || user.role !== 'admin') {
  //     navigate('/admin/login');
  //   }
  // }, [user, navigate]);
   useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin/login");
    } else {
      // 🔥 Charger les vidéos une seule fois après connexion
      fetchVideos().catch((err) => {
        console.warn("Erreur chargement vidéos :", err);
        toast({
          title: "⚠️ Błąd ładowania",
          description: "Nie udało się załadować listy wideo.",
          variant: "destructive",
        });
      });
    }
  }, [user, navigate]);


  if (!user || user.role !== 'admin') return null;

  const handleLogout = async () => {
  await logout();
  toast({
    title: "👋 Wylogowano",
    description: "Zostałeś pomyślnie wylogowany z panelu administratora.",
  });
  navigate("/");
};


  const navigation = [
    { name: 'Dodaj wideo', href: '/admin/dashboard/add-video', icon: Upload },
    { name: 'Lista wideo', href: '/admin/dashboard/video-list', icon: List },
    { name: 'Przeglądaj archiwum', href: '/admin/dashboard/explore', icon: Clock },
  ];

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href);

  return (
//     <div className="relative min-h-screen">
//       {/* Background image with its own opacity */}
//       {/* <div
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//         style={{
//           backgroundImage: "url('/lovable-uploads/02001situation.jpg')",
//           opacity: 0.2, // 👈 only the background fades
//         }}
//         aria-hidden="true"
//       /> */}
//       <div
//   className="absolute inset-0 bg-luxury-silver" // couleur gris clair Tailwind
//   style={{
//     backgroundColor: "#f2f2f2", // optionnel : couleur personnalisée
//     opacity: 1, // pas de transparence
//   }}
//   aria-hidden="true"
// />


//       {/* Page content */}
//       <div className="relative z-10">
//         {/* Header */}
//         <header className="bg-white/90 backdrop-blur border-b border-gray-200 luxury-shadow">
//           <div className="container mx-auto px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="font-luxury text-2xl font-semibold text-luxury-darkGrey">
//                   {/* Admin Dashboard */}Panel administracyjny
//                 </h1>
//                 {/* <p className="text-luxury-grey">Manage your luxury villa archive</p> */}
//                 <p className="text-luxury-grey">Zarządzaj swoim archiwum</p>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center space-x-2 text-luxury-grey hover:text-luxury-darkGrey transition-colors"
//               >
//                 <LogOut className="w-4 h-4" />
//                 {/* <span>Logout</span> */}
//                 <span>Wyloguj się</span>

//               </button>
//             </div>
//           </div>
//         </header>

//         <div className="container mx-auto px-6 py-8">
//           {/* Navigation */}
//           <nav className="mb-8">
//             <div className="flex flex-wrap gap-4">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
//                     isActive(item.href)
//                       ? 'bg-luxury-darkGrey text-white luxury-shadow'
//                       : 'bg-white/90 backdrop-blur text-luxury-grey hover:bg-white border border-gray-200'
//                   }`}
//                 >
//                   <item.icon className="w-4 h-4" />
//                   <span className="font-medium">{item.name}</span>
//                 </Link>
//               ))}
//             </div>
//           </nav>

//           {/* Content */}
//           <Routes>
//             <Route path="/" element={<AddVideo />} />
//             <Route path="/add-video" element={<AddVideo />} />
//             <Route path="/video-list" element={<VideoList />} />
//             <Route path="/explore" element={<ExploreArchive isAdmin={true} />} />
//           </Routes>
//         </div>
//       </div>
//     </div>


<div className="relative min-h-screen bg-[#d9d9d9] text-gray-800">
      {/* 🩶 fond popiel clair */}

      {/* --- Page Content --- */}
      <div className="relative z-10">
        {/* --- Header --- */}
        <header className="bg-[#e6e6e6]/90 backdrop-blur-md border-b border-gray-400 shadow-sm">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="font-luxury text-2xl font-semibold text-gray-900">
                Panel administracyjny
              </h1>
              <p className="text-gray-600 text-sm">
                Zarządzaj swoim archiwum wideo
              </p>
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

        {/* --- Main content --- */}
        <div className="container mx-auto px-6 py-10">
          {/* --- Navigation --- */}
          <nav className="mb-10">
            <div className="flex flex-wrap gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-[#c2c2c2] border border-gray-500 text-gray-900 shadow-md shadow-gray-400/40"
                      : "bg-[#e0e0e0] text-gray-600 border border-gray-400 hover:text-gray-900 hover:border-gray-500 hover:bg-[#d0d0d0]"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* --- Routes --- */}
          {/* <div className="bg-[#e6e6e6] border border-gray-400 rounded-xl p-6 shadow-sm shadow-gray-500/20"> */}

            <Routes>
              <Route path="/" element={<AddVideo />} />
              <Route path="/add-video" element={<AddVideo />} />
              <Route path="/video-list" element={<VideoList />} />
              <Route path="/explore" element={<ExploreArchive isAdmin={true} />} />
            </Routes>
        </div>
      </div>
    </div>

  );
};

export default AdminDashboard;
