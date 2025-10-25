import React from 'react';
import { useVideos } from '../../contexts/VideoContext';
import { toast } from '@/hooks/use-toast';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const VideoList = () => {
  const { videos, updateVideo, deleteVideo } = useVideos();

  const handleToggleVisibility = (id: string, isPublic: boolean) => {
    updateVideo(id, { isPublic });
    toast({
      title: 'Visibility updated',
      description: `Video is now ${isPublic ? 'public' : 'private'}`,
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteVideo(id);
      toast({
        title: 'Video deleted',
        description: 'The video has been removed from the archive.',
      });
    }
  };

  const renderContent = () => {
    if (!Array.isArray(videos)) {
      return (
        <div className="text-center py-12">
          <p className="text-luxury-grey text-lg">Loading videos...</p>
        </div>
      );
    }

    if (videos.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-luxury-grey text-lg">Nie przesłano jeszcze żadnych wideo.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-2 font-medium text-luxury-darkGrey">Wideo</th>
              <th className="text-left py-4 px-2 font-medium text-luxury-darkGrey">Szczegóły</th>
              <th className="text-left py-4 px-2 font-medium text-luxury-darkGrey">Widoczność</th>
              <th className="text-left py-4 px-2 font-medium text-luxury-darkGrey">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-4">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-20 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-luxury-darkGrey">{video.title}</h3>
                      <p className="text-sm text-luxury-grey mt-1">
                        {video.description
                          ? video.description.length > 50
                            ? `${video.description.substring(0, 50)}...`
                            : video.description
                          : "No description"}
                      </p>

                    </div>
                  </div>
                </td>
                <td className="py-4 px-2 text-sm">
                  <p className="text-luxury-darkGrey">
                    <strong>Utworzono:</strong> {video.creationDate}
                  </p>
                  <p className="text-luxury-grey mt-1">
                    <strong>Przesłano:</strong> {video.uploadDate}
                  </p>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={video.isPublic}
                      onCheckedChange={(checked) =>
                        handleToggleVisibility(video.id, checked)
                      }
                    />
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
                  </div>
                </td>
                <td className="py-4 px-2">
                  <button
                    onClick={() => handleDelete(video.id, video.title)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="luxury-card p-8">
      <div className="mb-8">
        <h2 className="font-luxury text-3xl font-semibold text-luxury-darkGrey mb-2">
          Lista archiwum wideo
        </h2>
        <p className="text-luxury-grey">
          Zarządzaj wszystkimi filmami w swoim archiwum luksusowej willi
        </p>
      </div>
      {renderContent()}
    </div>
  );
};

export default VideoList;
