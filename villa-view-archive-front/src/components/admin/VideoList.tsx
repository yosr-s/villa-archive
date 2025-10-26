import React from "react";
import { useVideos } from "../../contexts/VideoContext";
import { toast } from "@/hooks/use-toast";
import { Trash2, Globe, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const VideoList: React.FC = () => {
  const { videos, updateVideo, deleteVideo } = useVideos();

  // 🔁 Gérer le changement de visibilité
  const handleToggleVisibility = async (id: string, isPrivate: boolean) => {
    await updateVideo(id, { isPrivate });
    toast({
      title: "Zaktualizowano widoczność",
      description: `Wideo jest teraz ${isPrivate ? "prywatne" : "publiczne"}.`,
    });
  };

  // 🗑️ Suppression avec confirmation
  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Czy na pewno chcesz usunąć „${title}”?`)) {
      await deleteVideo(id);
      toast({
        title: "Wideo usunięte",
        description: "Film został usunięty z archiwum.",
      });
    }
  };

  // 🕒 Cas chargement ou vide
  if (!Array.isArray(videos)) {
    return (
      <div className="text-center py-12">
        <p className="text-luxury-grey text-lg">Ładowanie wideo...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-luxury-grey text-lg">
          Nie przesłano jeszcze żadnych wideo.
        </p>
      </div>
    );
  }

  // 🧩 Rendu principal
  return (
    <div className="luxury-card p-8">
      <div className="mb-8">
        <h2 className="font-luxury text-3xl font-semibold text-luxury-darkGrey mb-2">
          Lista archiwum wideo
        </h2>
        <p className="text-luxury-grey">
          Zarządzaj wszystkimi filmami w swoim archiwum luksusowej willi.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-2 font-medium text-luxury-darkGrey">
                Podgląd
              </th>
              <th className="text-left py-4 px-2 font-medium text-luxury-darkGrey">
                Szczegóły
              </th>
              <th className="text-left py-4 px-2 font-medium text-luxury-darkGrey">
                Widoczność
              </th>
              <th className="text-left py-4 px-2 font-medium text-luxury-darkGrey">
                Akcje
              </th>
            </tr>
          </thead>

          <tbody>
            {videos.map((video) => (
              <tr
                key={video._id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                {/* 🖼️ Miniature + titre */}
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        video.thumbnail ||
                        "https://via.placeholder.com/120x80?text=No+Thumbnail"
                      }
                      alt={video.title}
                      className="w-20 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-luxury-darkGrey">
                        {video.title}
                      </h3>
                      <p className="text-sm text-luxury-grey mt-1">
                        {video.description
                          ? video.description.length > 60
                            ? `${video.description.substring(0, 60)}...`
                            : video.description
                          : "Brak opisu"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* 📅 Dates */}
                <td className="py-4 px-2 text-sm">
                  <p className="text-luxury-darkGrey">
                    <strong>Utworzono:</strong>{" "}
                    {new Date(video.creationDate).toLocaleDateString()}
                  </p>
                  {/* <p className="text-luxury-grey mt-1">
                    <strong>Dodano:</strong>{" "}
                    {new Date(video.createdAt || "").toLocaleDateString()}
                  </p> */}
                </td>

                {/* 🌍 Widoczność */}
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={!video.isPrivate}
                      onCheckedChange={(checked) =>
                        handleToggleVisibility(video._id, !checked)
                      }
                    />
                    <span className="flex items-center space-x-1 text-sm">
                      {!video.isPrivate ? (
                        <>
                          <Globe className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Publiczne</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-orange-600" />
                          <span className="text-orange-600">Prywatne</span>
                        </>
                      )}
                    </span>
                  </div>
                </td>

                {/* 🗑️ Akcje */}
                <td className="py-4 px-2">
                  <button
                    onClick={() => handleDelete(video._id, video.title)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Usuń wideo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VideoList;
