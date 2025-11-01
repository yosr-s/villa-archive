import React, { useState, useRef } from "react";
import { useVideos } from "../contexts/VideoContext";
import VideoModal from "./VideoModal";
import { motion } from "framer-motion";
import {
  Play,
  Calendar,
  Trash2,
  Lock,
  Globe,
  Copy,
  Link as LinkIcon,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { ChevronDown } from "lucide-react";

interface ExploreArchiveProps {
  isAdmin: boolean;
}

const ExploreArchive: React.FC<ExploreArchiveProps> = ({ isAdmin }) => {
  const { videos, getPublicVideos, updateVideo, deleteVideo, downloadVideo  } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /** 🔁 Inversion de logique car backend = isPrivate */
  const handleToggleVisibility = (id: string, isPrivate: boolean) => {
    updateVideo(id, { isPrivate });
    // toast({
    //   title: "Zaktualizowano widoczność",
    //   description: `Wideo jest teraz ${isPrivate ? "prywatne" : "publiczne"}.`,
    // });
  };

  const handleDownload = async (vimeoId: string) => {
  try {
    await downloadVideo(vimeoId);
  } catch {
    toast({
      title: "❌ Błąd",
      description: "Nie udało się pobrać wideo.",
      variant: "destructive",
    });
  }
};


  /** 🎞️ Admin voit tout, użytkownik tylko publiczne */
  const displayVideos = isAdmin ? videos : getPublicVideos();
  const sortedVideos = [...displayVideos].sort(
    (a, b) =>
      new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
  );

  /** 🔗 Lien partage */
  const buildShareLink = (id: string) =>
    `${window.location.origin}/archive?video=${encodeURIComponent(id)}`;

  /** 📋 Copie lien */
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Link skopiowany ✅", description: text });
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      toast({ title: "Link skopiowany ✅", description: text });
    }
  };

  

  const handleCopyShareLink = (id: string) => copyToClipboard(buildShareLink(id));
  const handleCopyEmbedUrl = (url: string) => copyToClipboard(url);

  /** 🟠 Aucun wideo */
  if (sortedVideos.length === 0) {
    return (
     <div className="luxury-card p-12 text-center border border-[#bfbfbf] bg-[#e6e6e6] shadow-sm shadow-gray-400/30 hover:shadow-gray-500/40 transition-all duration-500 rounded-2xl">
  <h2 className="font-luxury text-2xl font-semibold text-gray-800 mb-4 drop-shadow-[0_0_4px_rgba(80,80,80,0.1)]">
    Brak wideo
  </h2>
  <p className="text-gray-600 tracking-wide">
    {isAdmin
      ? "Dodaj swoje pierwsze wideo, aby rozpocząć archiwum."
      : "Brak dostępnych publicznych nagrań wideo."}
  </p>
</div>

    );
  }

  return (
//     <div className="relative">
//       {/* 🏷️ Titre */}
//       <div className="mb-12 text-center">
//         <motion.h1
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1.2, ease: "easeOut" }}
//         >
//           {/* <h1
//             className="text-black"
//             style={{ fontFamily: "Archivo", fontSize: "3rem" }}
//           >
//             Oś czasu archiwum willi
//           </h1>
//           <p
//             style={{ fontFamily: "Archivo", fontSize: "1rem", color: "black" }}
//           >
//             Odkryj piękno i elegancję uchwycone na przestrzeni czasu.
//           </p> */}
//         </motion.h1>
//       </div>

//       {/* 📜 Timeline */}
//       <div ref={contentRef} className="relative max-w-6xl mx-auto px-4 md:px-0">
//         {/* Ligne centrale */}
//         <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-1 bg-luxury-silver h-full z-0" />

//         {/* Items */}
//         <div className="flex flex-col space-y-24">
//           {sortedVideos.map((video, index) => {
//             const isLeft = index % 2 === 0;
//             const videoDate = new Date(video.creationDate).toLocaleDateString();

//             return (
//               <div
//                 key={video._id}
//                 className={`relative flex w-full 
//                   ${isLeft ? "md:justify-start" : "md:justify-end"} 
//                   md:items-center`}
//               >
//                 {/* Point timeline */}
//                 <div className="hidden md:block absolute left-1/2 -translate-x-1/2 z-10">
//                   <div className="w-5 h-5 bg-luxury-silver rounded-full border-4 border-white luxury-shadow"></div>
//                 </div>

//                 {/* Date */}
//                 <div
//                   className={`absolute top-1/2 -translate-y-1/2 z-20 hidden md:block
//                     ${isLeft ? "right-[calc(50%+0.7rem)]" : "left-[calc(50%+0.9rem)]"}`
//                   }
//                 >
//                   <div className="flex items-center bg-luxury-silver text-luxury-darkGrey px-3 py-1 rounded-full text-sm font-medium luxury-shadow whitespace-nowrap">
//                     <Calendar className="w-3 h-3 mr-1" />
//                     <span>{videoDate}</span>
//                   </div>
//                 </div>

//                 {/* 🧩 Card */}
//                 <div
//                   className={`w-full md:w-5/12 ${
//                     isLeft ? "md:pr-10" : "md:pl-8"
//                   }`}
//                 >
//                   <div className="luxury-card p-6 group hover:scale-105 transition-transform duration-300 relative cursor-pointer">
//                     {/* 🧷 Copy boutons */}
//                     <div
//                       className="absolute top-3 right-3 flex items-center gap-2 
//                     opacity-100 md:opacity-0 md:group-hover:opacity-100
//                     transition-opacity duration-200 z-20"
//                     >
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleCopyEmbedUrl(video.shareUrl);
//                         }}
//                         className="rounded-full bg-white/90 hover:bg-white shadow px-2 py-1 flex items-center gap-1 text-xs font-medium"
//                         title="Kopiuj bezpośredni link Vimeo"
//                       >
//                         <Copy className="w-3.5 h-3.5" />
//                         Kopiuj Link
//                       </button>
//                     </div>
                    
//                     {/* <div
//                     className="absolute top-3 right-3 flex items-center gap-2 
//                     opacity-100 md:opacity-0 md:group-hover:opacity-100
//                     transition-opacity duration-200 z-20"
//                   >
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleCopyEmbedUrl(video.shareUrl);
//                       }}
//                       className="rounded-full bg-white/90 hover:bg-white shadow px-2 py-1 flex items-center gap-1 text-xs font-medium"
//                       title="Kopiuj bezpośredni link Vimeo"
//                     >
//                       <Copy className="w-3.5 h-3.5" />
//                       Kopiuj Link
//                     </button>

//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDownload(video.vimeoId);
//                       }}
//                       className="rounded-full bg-white/90 hover:bg-white shadow px-2 py-1 flex items-center gap-1 text-xs font-medium"
//                       title="Pobierz wideo"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="w-3.5 h-3.5"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={2}
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
//                       </svg>
//                       Pobierz
//                     </button>
//                   </div> */}


//                     {/* Miniatura */}
//                     <div className="relative mb-4 overflow-hidden rounded-lg group cursor-pointer">
//                       {video.thumbnail ? (
//                         <>
//                           {/* <img
//                             src={video.thumbnail}
//                             alt={video.title}
//                             className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
//                             onClick={() => setSelectedVideo(video)}
//                           />
//                           <div
//                             className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                             onClick={() => setSelectedVideo(video)}
//                           >
//                             <Play className="w-12 h-12 text-white" />
//                           </div> */}
//                           <div className="relative mb-4 overflow-hidden rounded-lg group cursor-pointer aspect-video">
//   <img
//     src={video.thumbnail}
//     alt={video.title}
//     className="absolute inset-0 w-full h-full object-cover object-center scale-110 transition-transform duration-300 group-hover:scale-125"
//     onClick={() => setSelectedVideo(video)}
//   />
//   <div
//     className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//     onClick={() => setSelectedVideo(video)}
//   >
//     <Play className="w-12 h-12 text-white" />
//   </div>
// </div>

//                         </>
//                       ) : (
//                         <iframe
//                           // src={video.embedUrl}
//                           src={`${video.embedUrl}?quality=4K`}
//                           className="w-full h-48 object-cover pointer-events-none"
//                           frameBorder="0"
//                           allow="autoplay; fullscreen; picture-in-picture"
//                           allowFullScreen
//                           title={video.title}
//                         />
//                       )}
//                     </div>

//                     {/* 🕓 Date mobile */}
//                     <div className="flex justify-center mt-2 md:hidden">
//                       <div className="flex items-center bg-luxury-silver text-luxury-darkGrey px-3 py-1 rounded-full text-xs font-medium luxury-shadow">
//                         <Calendar className="w-3 h-3 mr-1" />
//                         <span>{videoDate}</span>
//                       </div>
//                     </div>

//                     <div className="text-center mt-2">
//                       <h3 className="font-luxury text-xl font-semibold text-luxury-darkGrey mb-2">
//                         {video.title}
//                       </h3>
//                     </div>

//                     {/* 🧭 Visibilité admin */}
//                     {isAdmin && (
//                       <div className="py-4 px-2">
//                         <div className="flex items-center justify-between w-full">
//                           <span className="flex items-center space-x-1 text-sm">
//                             {video.isPrivate ? (
//                               <>
//                                 <Lock className="w-4 h-4 text-orange-600" />
//                                 <span className="text-orange-600">
//                                   Prywatne
//                                 </span>
//                               </>
//                             ) : (
//                               <>
//                                 <Globe className="w-4 h-4 text-green-600" />
//                                 <span className="text-green-600">
//                                   Publiczne
//                                 </span>
//                               </>
//                             )}
//                           </span>

//                           <Switch
//                             checked={!video.isPrivate}
//                             onCheckedChange={(checked) =>
//                               handleToggleVisibility(video._id, !checked)
//                             }
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* 🎬 Modal */}
//       {selectedVideo && (
//         <VideoModal
//           video={selectedVideo}
//           isOpen={!!selectedVideo}
//           onClose={() => setSelectedVideo(null)}
//         />
//       )}
//     </div>

<div className="relative bg-[#d9d9d9] min-h-screen text-gray-800 font-sans">
  {/* 🏷️ Titre */}
  <div className="mb-12 text-center">
    <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1
            className="text-black"
            style={{
                  fontFamily: "Archivo",
                  fontSize: "2.5rem",
                  color: "#626161ff",
                }}          >
           Przewiń w dół 
          </h1>
         
        </motion.h1>
      {/* Triple arrow animation – tightly stacked */}
      <div className="flex flex-col items-center mt-[2px] leading-none">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 1.3,
              delay: i * 0.12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ marginTop: "-5px" }} // ← makes them very close
          >
            <ChevronDown size={22} color="#626161ff" strokeWidth={1.5} />
          </motion.div>
        ))}
      </div>
  </div>

  {/* 📜 Timeline */}
  <div ref={contentRef} className="relative max-w-6xl mx-auto px-4 md:px-0">
    {/* Ligne centrale desktop */}
    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#8c8c8c] via-[#7a7a7a] to-[#8c8c8c] h-full z-0" />

    <div className="flex flex-col space-y-24">
      {sortedVideos.map((video, index) => {
        const isLeft = index % 2 === 0;
        const videoDate = new Date(video.creationDate).toLocaleDateString("pl-PL");

        return (
          <div
            key={video._id}
            className={`relative flex w-full ${
              isLeft ? "md:justify-start" : "md:justify-end"
            } md:items-center`}
          >
            {/* Point timeline (desktop) */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 z-10">
              <div className="w-4 h-4 bg-[#7a7a7a] rounded-full border-[3px] border-[#d9d9d9] shadow-md shadow-gray-500/30"></div>
            </div>

            {/* Bulle de date (desktop uniquement) */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 z-20 hidden md:block ${
                isLeft
                  ? "right-[calc(50%+0.8rem)]"
                  : "left-[calc(50%+0.8rem)]"
              }`}
            >
              <div className="flex items-center bg-[#ececec]/80 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-500 backdrop-blur-md shadow-sm">
                <Calendar className="w-3 h-3 mr-1 text-gray-600" />
                <span>{videoDate}</span>
              </div>
            </div>

            {/* 🧩 Card */}
            <div
              className={`w-full md:w-5/12 ${
                isLeft ? "md:pr-10" : "md:pl-10"
              }`}
            >
              <div className="group relative bg-[#e4e4e4] border border-gray-400 rounded-xl p-6 transition-transform duration-300 hover:scale-[1.02] shadow-sm hover:shadow-md hover:shadow-gray-500/30">
                
                {/* 🕓 Date en haut pour mobile uniquement */}
                <div className="flex justify-center mb-4 md:hidden">
                  <div className="flex items-center bg-[#ececec] text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-500 shadow-sm">
                    <Calendar className="w-3 h-3 mr-1 text-gray-600" />
                    <span>{videoDate}</span>
                  </div>
                </div>

                {/* Boutons copier */}
<div
  className="
    absolute top-3 right-3 flex items-center gap-2 
    opacity-100 md:opacity-0 md:group-hover:opacity-100
    transition-opacity duration-200 z-20
  "
>
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleCopyEmbedUrl(video.embedUrl);
    }}
    className="rounded-full bg-[#d9d9d9] hover:bg-[#d0d0d0] text-gray-700 px-2 py-1 flex items-center gap-1 text-xs border border-gray-500 shadow-sm"
    title="Kopiuj link Vimeo"
  >
    <Copy className="w-3.5 h-3.5 text-gray-600" />
    Kopiuj
  </button>
</div>


                {/* 📸 Miniature */}
                <div className="relative mb-4 overflow-hidden rounded-lg group cursor-pointer aspect-video border border-gray-400/50">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover object-center scale-125 transition-transform duration-700 group-hover:scale-[1.35] brightness-[1.03]"
                    onClick={() => setSelectedVideo(video)}
                  />
                  <div
                    className="absolute inset-0 bg-gray-700/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <Play className="w-12 h-12 text-gray-100 drop-shadow-sm" />
                  </div>
                </div>

                {/* Titre */}
                <div className="text-center mt-2">
                  <h3 className="font-medium text-lg text-gray-800">
                    {video.title}
                  </h3>
                </div>

                {/* 🔒 Toggle visibilité admin */}
                {isAdmin && (
                  <div className="py-4 px-2">
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center space-x-1 text-sm">
                        {video.isPrivate ? (
                          <>
                            <Lock className="w-4 h-4 text-yellow-600" />
                            <span className="text-yellow-600">Prywatne</span>
                          </>
                        ) : (
                          <>
                            <Globe className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Publiczne</span>
                          </>
                        )}
                      </span>

                      {/* Switch noir / gris */}
                      <Switch
                        checked={!video.isPrivate}
                        onCheckedChange={(checked) =>
                          handleToggleVisibility(video._id, !checked)
                        }
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full border transition-all duration-300
                          data-[state=checked]:bg-[#333333] data-[state=checked]:border-[#1a1a1a] data-[state=checked]:shadow-[0_0_6px_rgba(0,0,0,0.4)]
                          data-[state=unchecked]:bg-[#999999] data-[state=unchecked]:border-[#666666] data-[state=unchecked]:shadow-inner
                        `}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>

  {/* 🎬 Modal */}
  {selectedVideo && (
    <VideoModal
      video={selectedVideo}
      isOpen={!!selectedVideo}
      onClose={() => setSelectedVideo(null)}
    />
  )}
</div>







  );
};

export default ExploreArchive;
