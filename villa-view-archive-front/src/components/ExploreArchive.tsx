import React, { useState, useRef } from "react";
import { useVideos } from "../contexts/VideoContext";
// import { Play, Calendar } from "lucide-react";
import VideoModal from "./VideoModal";
import { motion } from "framer-motion";
// import { Trash2, Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Play, Calendar, Trash2, Eye, EyeOff, Copy, Link as LinkIcon } from "lucide-react";


interface ExploreArchiveProps {
  isAdmin: boolean;
}

const ExploreArchive: React.FC<ExploreArchiveProps> = ({ isAdmin }) => {
  //const { videos, getPublicVideos } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);

const { videos, getPublicVideos, updateVideo } = useVideos();
 

   const handleToggleVisibility = (id: string, isPublic: boolean) => {
    updateVideo(id, { isPublic });
    toast({
      title: 'Visibility updated',
      description: `Video is now ${isPublic ? 'public' : 'private'}`,
    });
  };

  const displayVideos = isAdmin ? videos : getPublicVideos();
  const sortedVideos = [...displayVideos].sort(
    (a, b) =>
      new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
  );

  // Build a shareable page link like https://your-site.com/archive?video=123
const buildShareLink = (id: string) =>
  `${window.location.origin}/archive?video=${encodeURIComponent(id)}`;

// Robust clipboard copy with fallback
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

// Click handlers
const handleCopyShareLink = (id: string) => copyToClipboard(buildShareLink(id));
const handleCopyRawUrl   = (url: string) => copyToClipboard(url);


  if (sortedVideos.length === 0) {
    return (
      <div className="luxury-card p-12 text-center">
        <h2 className="font-luxury text-2xl font-semibold text-luxury-darkGrey mb-4">
          No Videos Available
        </h2>
        <p className="text-luxury-grey">
          {isAdmin
            ? "Upload your first video to start building the archive."
            : "No public videos are currently available."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Title */}
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

      {/* Timeline container */}
      <div
        ref={contentRef}
        className="relative max-w-6xl mx-auto px-4 md:px-0"
      >
        {/* Central line only on desktop */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-1 bg-luxury-silver h-full z-0" />

        {/* Items */}
        <div className="flex flex-col space-y-24">
          {sortedVideos.map((video, index) => {
            const isLeft = index % 2 === 0;
            const videoDate = new Date(video.creationDate).toLocaleDateString();

            return (
              <div
                key={video.id}
                className={`relative flex w-full 
                  ${isLeft ? "md:justify-start" : "md:justify-end"} 
                  md:items-center`}
              >
                {/* Dot (only desktop) */}
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 z-10">
                  <div className="w-5 h-5 bg-luxury-silver rounded-full border-4 border-white luxury-shadow"></div>
                </div>

                {/* Date next to dot (desktop only) */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 z-20 hidden md:block
                    ${isLeft ? "right-[calc(50%+0.8rem)]" : "left-[calc(50%+0.7rem)]"}
                  `}
                >
                  <div className="flex items-center bg-luxury-silver text-luxury-darkGrey px-3 py-1 rounded-full text-sm font-medium luxury-shadow whitespace-nowrap">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{videoDate}</span>
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`w-full md:w-5/12 ${
                    isLeft ? "md:pr-8" : "md:pl-8"
                  }`}
                >
                  <div className="luxury-card p-6 group cursor-pointer hover:scale-105 transition-transform duration-300 relative">

                {/* COPY CONTROLS */}
  <div className="absolute top-3 right-3 flex items-center gap-2 
                  opacity-100 md:opacity-0 md:group-hover:opacity-100
                  transition-opacity duration-200 z-20">
    {/* Copy shareable page link */}
    {/* <button
      type="button"
      onClick={(e) => { e.stopPropagation(); handleCopyShareLink(video.id); }}
      className="rounded-full bg-white/90 hover:bg-white shadow px-2 py-1 flex items-center gap-1 text-xs font-medium"
      title="Kopiuj link do strony"
    >
      <LinkIcon className="w-3.5 h-3.5" />
      Kopiuj stronę
    </button> */}

    {/* Copy raw video URL */}
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); handleCopyRawUrl(video.videoUrl); }}
      className="rounded-full bg-white/90 hover:bg-white shadow px-2 py-1 flex items-center gap-1 text-xs font-medium"
      title="Kopiuj bezpośredni link do pliku"
    >
      <Copy className="w-3.5 h-3.5" />
      Kopiuj Link
    </button>
  </div>    
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                      <video
                        src={`${video.videoUrl}#t=0.1`}
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        preload="metadata"
                        poster={video.thumbnailUrl}
                      />
                      <div
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() => setSelectedVideo(video)}
                      >
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    </div>

                    {/* Date inside card (mobile only, centered bottom) */}
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
{isAdmin && (
  <div className="py-4 px-2">
    <div className="flex items-center justify-between w-full">
      <span className="flex items-center space-x-1 text-sm">
        {video.isPublic ? (
          <>
            <Eye className="w-4 h-4 text-green-600" />
            <span className="text-green-600">Publiczne</span>
          </>
        ) : (
          <>
            <EyeOff className="w-4 h-4 text-orange-600" />
            <span className="text-orange-600">Prywatne</span>
          </>
        )}
      </span>

      <Switch
        checked={video.isPublic}
        onCheckedChange={(checked) =>
          handleToggleVisibility(video.id, checked)
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

      {/* Modal */}
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
