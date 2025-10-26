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

interface ExploreArchiveProps {
  isAdmin: boolean;
}

const ExploreArchive: React.FC<ExploreArchiveProps> = ({ isAdmin }) => {
  const { videos, getPublicVideos, updateVideo, deleteVideo } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /** 🔁 Inversion de logique car backend = isPrivate */
  const handleToggleVisibility = (id: string, isPrivate: boolean) => {
    updateVideo(id, { isPrivate });
    toast({
      title: "Zaktualizowano widoczność",
      description: `Wideo jest teraz ${isPrivate ? "prywatne" : "publiczne"}.`,
    });
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
      <div className="luxury-card p-12 text-center">
        <h2 className="font-luxury text-2xl font-semibold text-luxury-darkGrey mb-4">
          Brak wideo
        </h2>
        <p className="text-luxury-grey">
          {isAdmin
            ? "Dodaj swoje pierwsze wideo, aby rozpocząć archiwum."
            : "Brak dostępnych publicznych nagrań wideo."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 🏷️ Titre */}
      <div className="mb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1
            className="text-black"
            style={{ fontFamily: "Archivo", fontSize: "3rem" }}
          >
            Oś czasu archiwum willi
          </h1>
          <p
            style={{ fontFamily: "Archivo", fontSize: "1rem", color: "black" }}
          >
            Odkryj piękno i elegancję uchwycone na przestrzeni czasu.
          </p>
        </motion.h1>
      </div>

      {/* 📜 Timeline */}
      <div ref={contentRef} className="relative max-w-6xl mx-auto px-4 md:px-0">
        {/* Ligne centrale */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-1 bg-luxury-silver h-full z-0" />

        {/* Items */}
        <div className="flex flex-col space-y-24">
          {sortedVideos.map((video, index) => {
            const isLeft = index % 2 === 0;
            const videoDate = new Date(video.creationDate).toLocaleDateString();

            return (
              <div
                key={video._id}
                className={`relative flex w-full 
                  ${isLeft ? "md:justify-start" : "md:justify-end"} 
                  md:items-center`}
              >
                {/* Point timeline */}
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 z-10">
                  <div className="w-5 h-5 bg-luxury-silver rounded-full border-4 border-white luxury-shadow"></div>
                </div>

                {/* Date */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 z-20 hidden md:block
                    ${isLeft ? "right-[calc(50%+0.7rem)]" : "left-[calc(50%+0.9rem)]"}`
                  }
                >
                  <div className="flex items-center bg-luxury-silver text-luxury-darkGrey px-3 py-1 rounded-full text-sm font-medium luxury-shadow whitespace-nowrap">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{videoDate}</span>
                  </div>
                </div>

                {/* 🧩 Card */}
                <div
                  className={`w-full md:w-5/12 ${
                    isLeft ? "md:pr-10" : "md:pl-8"
                  }`}
                >
                  <div className="luxury-card p-6 group hover:scale-105 transition-transform duration-300 relative cursor-pointer">
                    {/* 🧷 Copy boutons */}
                    <div
                      className="absolute top-3 right-3 flex items-center gap-2 
                    opacity-100 md:opacity-0 md:group-hover:opacity-100
                    transition-opacity duration-200 z-20"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyEmbedUrl(video.embedUrl);
                        }}
                        className="rounded-full bg-white/90 hover:bg-white shadow px-2 py-1 flex items-center gap-1 text-xs font-medium"
                        title="Kopiuj bezpośredni link Vimeo"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Kopiuj Link
                      </button>
                    </div>

                    {/* Miniatura */}
                    <div className="relative mb-4 overflow-hidden rounded-lg group cursor-pointer">
                      {video.thumbnail ? (
                        <>
                          {/* <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                            onClick={() => setSelectedVideo(video)}
                          />
                          <div
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            onClick={() => setSelectedVideo(video)}
                          >
                            <Play className="w-12 h-12 text-white" />
                          </div> */}
                          <div className="relative mb-4 overflow-hidden rounded-lg group cursor-pointer aspect-video">
  <img
    src={video.thumbnail}
    alt={video.title}
    className="absolute inset-0 w-full h-full object-cover object-center scale-110 transition-transform duration-300 group-hover:scale-125"
    onClick={() => setSelectedVideo(video)}
  />
  <div
    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    onClick={() => setSelectedVideo(video)}
  >
    <Play className="w-12 h-12 text-white" />
  </div>
</div>

                        </>
                      ) : (
                        <iframe
                          // src={video.embedUrl}
                          src={`${video.embedUrl}?quality=2160p&autoplay=1&muted=0`}
                          className="w-full h-48 object-cover pointer-events-none"
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          title={video.title}
                        />
                      )}
                    </div>

                    {/* 🕓 Date mobile */}
                    <div className="flex justify-center mt-2 md:hidden">
                      <div className="flex items-center bg-luxury-silver text-luxury-darkGrey px-3 py-1 rounded-full text-xs font-medium luxury-shadow">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{videoDate}</span>
                      </div>
                    </div>

                    <div className="text-center mt-2">
                      <h3 className="font-luxury text-xl font-semibold text-luxury-darkGrey mb-2">
                        {video.title}
                      </h3>
                    </div>

                    {/* 🧭 Visibilité admin */}
                    {isAdmin && (
                      <div className="py-4 px-2">
                        <div className="flex items-center justify-between w-full">
                          <span className="flex items-center space-x-1 text-sm">
                            {video.isPrivate ? (
                              <>
                                <Lock className="w-4 h-4 text-orange-600" />
                                <span className="text-orange-600">
                                  Prywatne
                                </span>
                              </>
                            ) : (
                              <>
                                <Globe className="w-4 h-4 text-green-600" />
                                <span className="text-green-600">
                                  Publiczne
                                </span>
                              </>
                            )}
                          </span>

                          <Switch
                            checked={!video.isPrivate}
                            onCheckedChange={(checked) =>
                              handleToggleVisibility(video._id, !checked)
                            }
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
