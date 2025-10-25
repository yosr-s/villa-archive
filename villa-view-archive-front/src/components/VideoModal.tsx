import React from 'react';
import { X, Calendar, User } from 'lucide-react';
import { Video } from '../types/video';

interface VideoModalProps {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ video, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden luxury-shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-luxury text-2xl font-semibold text-luxury-darkGrey">
            {video.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-luxury-grey" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Video player */}
          <div className="relative bg-black rounded-lg mb-6 aspect-video overflow-hidden">
            {video.videoUrl.includes('cloudinary') ||
             video.videoUrl.includes('youtube') ||
             video.videoUrl.includes('vimeo') ||
             video.videoUrl.includes('frame.io') ? (
              <iframe
                src={video.videoUrl}
                title={video.title}
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <video controls className="w-full h-full rounded-lg">
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Details */}
          {/* <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-luxury-darkGrey mb-2">Description</h3>
              <p className="text-luxury-grey">{video.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center text-luxury-grey">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Created: {new Date(video.creationDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-luxury-grey">
                <User className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Uploaded: {new Date(video.uploadDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
