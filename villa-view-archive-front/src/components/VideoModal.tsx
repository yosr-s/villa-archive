import React from "react";
import { X, Calendar, Lock, Globe } from "lucide-react";
import { Video } from "../types/video";

interface VideoModalProps {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ video, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden luxury-shadow relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-luxury text-2xl font-semibold text-luxury-darkGrey truncate">
            {video.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-luxury-grey" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* 🎥 Player */}
          <div className="relative bg-black rounded-lg mb-6 aspect-video overflow-hidden">
            {video.embedUrl ? (
              <iframe
                src={video.embedUrl}
                title={video.title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <p className="text-white text-center py-10">
                Nie znaleziono adresu wideo Vimeo.
              </p>
            )}
          </div>

          {/* 🧾 Infos */}
          <div className="space-y-4">
            {video.description && (
              <div>
                <h3 className="font-semibold text-luxury-darkGrey mb-2">
                  Opis
                </h3>
                <p className="text-luxury-grey">{video.description}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center text-luxury-grey">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Utworzono:{" "}
                  {video.creationDate
                    ? new Date(video.creationDate).toLocaleDateString("pl-PL")
                    : "—"}
                </span>
              </div>

              <div className="flex items-center text-luxury-grey">
                {video.isPrivate ? (
                  <>
                    <Lock className="w-4 h-4 mr-2 text-red-400" />
                    <span className="text-sm">Wideo prywatne</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2 text-green-500" />
                    <span className="text-sm">Wideo publiczne</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 🔗 Lien direct */}
          {video.shareUrl && (
            <div className="mt-6 text-center">
              <a
                href={video.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-luxury-darkGrey font-medium hover:underline"
              >
                Otwórz w Vimeo ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
