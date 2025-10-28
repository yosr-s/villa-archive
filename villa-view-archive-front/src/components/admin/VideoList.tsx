import React, { useState } from "react";
import { useVideos } from "../../contexts/VideoContext";
import { toast } from "@/hooks/use-toast";
import { Trash2, Globe, Lock, Pencil } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const VideoList: React.FC = () => {
  const { videos, updateVideo, deleteVideo } = useVideos();

  // 🔧 État pour le modal d’édition
  const [editingVideo, setEditingVideo] = useState<any | null>(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    creationDate: "",
    isPrivate: false,
  });

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

  // ✏️ Ouvrir le modal d’édition
  const openEditModal = (video: any) => {
    setEditingVideo(video);
    setEditData({
      title: video.title || "",
      description: video.description || "",
      creationDate: video.creationDate?.split("T")[0] || "",
      isPrivate: video.isPrivate || false,
    });
  };

  // 🔄 Enregistrer les modifications
  const handleUpdate = async () => {
    if (!editingVideo) return;
    await updateVideo(editingVideo._id, editData);
    toast({
      title: "✅ Zaktualizowano wideo",
      description: "Dane filmu zostały pomyślnie zapisane.",
    });
    setEditingVideo(null);
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

  return (
    // <div className="luxury-card p-8">
    //   <div className="mb-8">
    //     <h2 className="font-luxury text-3xl font-semibold text-luxury-darkGrey mb-2">
    //       Lista wideo
    //     </h2>
    //     <p className="text-luxury-grey">
    //       Zarządzaj filmami w swoim archiwum.
    //     </p>
    //   </div>

    //   {/* 🖥️ Table desktop */}
    //   <div className="overflow-x-auto">
    //     <table className="w-full hidden md:table">
    //       <thead>
    //         <tr className="border-b border-gray-200">
    //           <th className="text-left py-4 px-2 font-medium text-luxury-darkGrey">
    //             Podgląd
    //           </th>
    //           <th className="text-left py-4 px-2 font-medium text-luxury-darkGrey">
    //             Szczegóły
    //           </th>
    //           <th className="text-left py-4 px-2 font-medium text-luxury-darkGrey">
    //             Widoczność
    //           </th>
    //           <th className="text-left py-4 px-2 font-medium text-luxury-darkGrey">
    //             Akcje
    //           </th>
    //         </tr>
    //       </thead>

    //       <tbody>
    //         {videos.map((video) => (
    //           <tr
    //             key={video._id}
    //             className="border-b border-gray-100 hover:bg-gray-50"
    //           >
    //             <td className="py-4 px-2">
    //               <div className="flex items-center space-x-4">
    //                 <img
    //                   src={
    //                     video.thumbnail ||
    //                     "https://via.placeholder.com/120x80?text=No+Thumbnail"
    //                   }
    //                   alt={video.title}
    //                   className="w-20 h-16 object-cover rounded-lg"
    //                 />
    //                 <div>
    //                   <h3 className="font-semibold text-luxury-darkGrey">
    //                     {video.title}
    //                   </h3>
    //                   <p className="text-sm text-luxury-grey mt-1">
    //                     {video.description
    //                       ? video.description.length > 60
    //                         ? `${video.description.substring(0, 60)}...`
    //                         : video.description
    //                       : "Brak opisu"}
    //                   </p>
    //                 </div>
    //               </div>
    //             </td>

    //             <td className="py-4 px-2 text-sm">
    //               <p className="text-luxury-darkGrey">
    //                 <strong>Utworzono:</strong>{" "}
    //                 {new Date(video.creationDate).toLocaleDateString()}
    //               </p>
    //             </td>

    //             <td className="py-4 px-2">
    //               <div className="flex items-center space-x-3">
    //                 <Switch
    //                   checked={!video.isPrivate}
    //                   onCheckedChange={(checked) =>
    //                     handleToggleVisibility(video._id, !checked)
    //                   }
    //                 />
    //                 <span className="flex items-center space-x-1 text-sm">
    //                   {!video.isPrivate ? (
    //                     <>
    //                       <Globe className="w-4 h-4 text-green-600" />
    //                       <span className="text-green-600">Publiczne</span>
    //                     </>
    //                   ) : (
    //                     <>
    //                       <Lock className="w-4 h-4 text-orange-600" />
    //                       <span className="text-orange-600">Prywatne</span>
    //                     </>
    //                   )}
    //                 </span>
    //               </div>
    //             </td>

    //             <td className="py-4 px-2 flex space-x-3">
    //               <button
    //                 onClick={() => openEditModal(video)}
    //                 className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
    //                 title="Edytuj wideo"
    //               >
    //                 <Pencil className="w-4 h-4" />
    //               </button>
    //               <button
    //                 onClick={() => handleDelete(video._id, video.title)}
    //                 className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
    //                 title="Usuń wideo"
    //               >
    //                 <Trash2 className="w-4 h-4" />
    //               </button>
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>

    //     {/* 🟢 Version mobile (cartes) */}
    //     <div className="md:hidden space-y-4">
    //       {videos.map((video) => (
    //         <div
    //           key={video._id}
    //           className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm"
    //         >
    //           <div className="flex items-center space-x-3 mb-3">
    //             <img
    //               src={
    //                 video.thumbnail ||
    //                 "https://via.placeholder.com/100x70?text=No+Thumbnail"
    //               }
    //               alt={video.title}
    //               className="w-24 h-16 object-cover rounded-md"
    //             />
    //             <div className="flex-1">
    //               <h3 className="font-semibold text-luxury-darkGrey">
    //                 {video.title}
    //               </h3>
    //               <p className="text-xs text-luxury-grey mt-1">
    //                 {video.description
    //                   ? video.description.length > 60
    //                     ? `${video.description.substring(0, 60)}...`
    //                     : video.description
    //                   : "Brak opisu"}
    //               </p>
    //             </div>
    //           </div>

    //           <div className="flex justify-between items-center mb-2">
    //             <p className="text-sm text-luxury-darkGrey">
    //               <strong>Utworzono:</strong>{" "}
    //               {new Date(video.creationDate).toLocaleDateString("pl-PL")}
    //             </p>

    //             <div className="flex items-center space-x-2">
    //               <Switch
    //                 checked={!video.isPrivate}
    //                 onCheckedChange={(checked) =>
    //                   handleToggleVisibility(video._id, !checked)
    //                 }
    //               />
    //               {!video.isPrivate ? (
    //                 <Globe className="w-4 h-4 text-green-600" />
    //               ) : (
    //                 <Lock className="w-4 h-4 text-orange-600" />
    //               )}
    //             </div>
    //           </div>

    //           <div className="text-right space-x-2">
    //             <button
    //               onClick={() => openEditModal(video)}
    //               className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
    //             >
    //               <Pencil className="w-4 h-4" />
    //             </button>
    //             <button
    //               onClick={() => handleDelete(video._id, video.title)}
    //               className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
    //             >
    //               <Trash2 className="w-4 h-4" />
    //             </button>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>

    //   {/* 🪟 Modal édition */}
    //   {editingVideo && (
    //     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    //       <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4 relative">
    //         <h3 className="text-xl font-semibold text-luxury-darkGrey">
    //           Edytuj wideo
    //         </h3>

    //         <div>
    //           <label className="block text-sm mb-1 text-gray-700">
    //             Tytuł
    //           </label>
    //           <input
    //             type="text"
    //             className="luxury-input w-full"
    //             value={editData.title}
    //             onChange={(e) =>
    //               setEditData((prev) => ({ ...prev, title: e.target.value }))
    //             }
    //           />
    //         </div>

    //         <div>
    //           <label className="block text-sm mb-1 text-gray-700">
    //             Opis
    //           </label>
    //           <textarea
    //             className="luxury-input w-full resize-none"
    //             rows={3}
    //             value={editData.description}
    //             onChange={(e) =>
    //               setEditData((prev) => ({
    //                 ...prev,
    //                 description: e.target.value,
    //               }))
    //             }
    //           />
    //         </div>

    //         <div>
    //           <label className="block text-sm mb-1 text-gray-700">
    //             Data utworzenia
    //           </label>
    //           <input
    //             type="date"
    //             className="luxury-input w-full"
    //             value={editData.creationDate}
    //             onChange={(e) =>
    //               setEditData((prev) => ({
    //                 ...prev,
    //                 creationDate: e.target.value,
    //               }))
    //             }
    //           />
    //         </div>

    //         <div className="flex items-center space-x-3">
    //           <Switch
    //             checked={!editData.isPrivate}
    //             onCheckedChange={(checked) =>
    //               setEditData((prev) => ({
    //                 ...prev,
    //                 isPrivate: !checked,
    //               }))
    //             }
    //           />
    //           <span className="text-sm text-gray-700">
    //             {editData.isPrivate ? "Prywatne" : "Publiczne"}
    //           </span>
    //         </div>

    //         <div className="flex justify-end space-x-3 pt-4">
    //           <button
    //             onClick={() => setEditingVideo(null)}
    //             className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
    //           >
    //             Anuluj
    //           </button>
    //           <button
    //             onClick={handleUpdate}
    //             className="px-4 py-2 rounded-md bg-luxury-darkGrey text-white hover:bg-luxury-gold transition"
    //           >
    //             Zapisz zmiany
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
   <div className="luxury-card bg-[#e6e6e6] border border-[#bfbfbf] rounded-2xl p-8 text-gray-800 shadow-sm shadow-gray-400/30">
  {/* 🏷️ Header */}
  <div className="mb-8">
    <h2 className="font-luxury text-3xl font-semibold text-gray-800 mb-2">
      Lista wideo
    </h2>
    <p className="text-gray-600">Zarządzaj filmami w swoim archiwum.</p>
  </div>

  {/* 🖥️ Table desktop */}
  <div className="overflow-x-auto">
    <table className="w-full hidden md:table">
      <thead>
        <tr className="border-b border-[#bfbfbf] bg-[#f0f0f0]">
          {["Podgląd", "Szczegóły", "Widoczność", "Akcje"].map((h) => (
            <th
              key={h}
              className="text-left py-4 px-2 font-medium text-gray-700 uppercase tracking-wide text-xs"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {videos.map((video) => (
          <tr
            key={video._id}
            className="border-b border-[#d0d0d0] hover:bg-[#f4f4f4] transition-colors"
          >
            {/* Miniature + titre */}
            <td className="py-4 px-2">
              <div className="flex items-center space-x-4">
                <img
                  src={
                    video.thumbnail ||
                    "https://via.placeholder.com/120x80?text=No+Thumbnail"
                  }
                  alt={video.title}
                  className="w-20 h-16 object-cover rounded-lg scale-105 hover:scale-110 transition-transform duration-500 border border-[#bfbfbf]"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{video.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {video.description
                      ? video.description.length > 60
                        ? `${video.description.substring(0, 60)}...`
                        : video.description
                      : "Brak opisu"}
                  </p>
                </div>
              </div>
            </td>

            {/* Détails */}
            <td className="py-4 px-2 text-sm text-gray-700">
              <p>
                <strong className="text-gray-600">Utworzono:</strong>{" "}
                {new Date(video.creationDate).toLocaleDateString("pl-PL")}
              </p>
            </td>

            {/* Widoczność */}
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
                      <Lock className="w-4 h-4 text-yellow-600" />
                      <span className="text-yellow-600">Prywatne</span>
                    </>
                  )}
                </span>
              </div>
            </td>

            {/* Akcje */}
            <td className="py-4 px-2 flex space-x-3">
              <button
                onClick={() => openEditModal(video)}
                className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                title="Edytuj wideo"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(video._id, video.title)}
                className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-100 transition-colors"
                title="Usuń wideo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* 📱 Mobile version */}
    <div className="md:hidden space-y-4">
      {videos.map((video) => (
        <div
          key={video._id}
          className="p-4 border border-[#bfbfbf] rounded-xl bg-[#f0f0f0] shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={
                video.thumbnail ||
                "https://via.placeholder.com/100x70?text=No+Thumbnail"
              }
              alt={video.title}
              className="w-24 h-16 object-cover rounded-md scale-105 hover:scale-110 transition-transform duration-500 border border-[#bfbfbf]"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{video.title}</h3>
              <p className="text-xs text-gray-600 mt-1">
                {video.description
                  ? video.description.length > 60
                    ? `${video.description.substring(0, 60)}...`
                    : video.description
                  : "Brak opisu"}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-2 text-gray-700">
            <p className="text-sm">
              <strong className="text-gray-600">Utworzono:</strong>{" "}
              {new Date(video.creationDate).toLocaleDateString("pl-PL")}
            </p>

            <div className="flex items-center space-x-2">
              <Switch
                checked={!video.isPrivate}
                onCheckedChange={(checked) =>
                  handleToggleVisibility(video._id, !checked)
                }
              />
              {!video.isPrivate ? (
                <Globe className="w-4 h-4 text-green-600" />
              ) : (
                <Lock className="w-4 h-4 text-yellow-600" />
              )}
            </div>
          </div>

          <div className="text-right space-x-2">
            <button
              onClick={() => openEditModal(video)}
              className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(video._id, video.title)}
              className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* 🪟 Modal édition */}
  {editingVideo && (
    <div className="fixed inset-0 bg-[#d9d9d9]/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#f0f0f0] border border-[#bfbfbf] rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4 relative text-gray-800">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Edytuj wideo
        </h3>

        {/* Champ titre */}
        <div>
          <label className="block text-sm mb-1 text-gray-700">Tytuł</label>
          <input
            type="text"
            className="w-full bg-[#ffffff] border border-[#bfbfbf] rounded-lg px-3 py-2 text-gray-800 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 outline-none"
            value={editData.title}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        {/* Champ opis */}
        <div>
          <label className="block text-sm mb-1 text-gray-700">Opis</label>
          <textarea
            className="w-full bg-[#ffffff] border border-[#bfbfbf] rounded-lg px-3 py-2 text-gray-800 resize-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 outline-none"
            rows={3}
            value={editData.description}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>

        {/* Champ data */}
        <div>
          <label className="block text-sm mb-1 text-gray-700">
            Data utworzenia
          </label>
          <input
            type="date"
            className="w-full bg-[#ffffff] border border-[#bfbfbf] rounded-lg px-3 py-2 text-gray-800 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 outline-none"
            value={editData.creationDate}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                creationDate: e.target.value,
              }))
            }
          />
        </div>

        {/* Switch */}
        <div className="flex items-center space-x-3">
          <Switch
            checked={!editData.isPrivate}
            onCheckedChange={(checked) =>
              setEditData((prev) => ({ ...prev, isPrivate: !checked }))
            }
          />
          <span className="text-sm text-gray-700">
            {editData.isPrivate ? "Prywatne" : "Publiczne"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={() => setEditingVideo(null)}
            className="px-4 py-2 rounded-md border border-[#bfbfbf] text-gray-700 hover:bg-[#e0e0e0] transition"
          >
            Anuluj
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded-md bg-[#cfcfcf] text-gray-900 hover:bg-[#bfbfbf] transition font-semibold"
          >
            Zapisz zmiany
          </button>
        </div>
      </div>
    </div>
  )}
</div>


  );
};

export default VideoList;
