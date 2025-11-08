import React, { useState, useEffect } from "react";
import { imageService } from "../services/image.service";
import { toast } from "@/hooks/use-toast";
import { FolderOpen, ArrowLeft, ChevronLeft, ChevronRight, Download } from "lucide-react";

interface Image {
  _id: string;
  name: string;
  album: string;
}

const ITEMS_PER_PAGE = 8;
const VITE_API_IMAGE = import.meta.env.VITE_API_IMAGE
const PhotoList: React.FC = () => {
  const [album, setAlbum] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const albums = [
    { label: "🌿 Ogród", value: "garden" },
    { label: "🍂 Pory roku", value: "seasons" },
    { label: "🏗️ Odbudowa ogrodu", value: "garden_reconstruction" },
  ];

  // 🔁 charger les images de l’album
useEffect(() => {
  const fetchImages = async () => {
    if (!album) return;
    try {
      setLoading(true);
      setImages([]); // 🧹 reset avant de charger
      const res = await imageService.getImagesByAlbum(album);
      setImages(Array.isArray(res) ? res : []); // 🧠 sécurité
      setPage(1);
    } catch (error: any) {
      console.error("❌ Błąd ładowania zdjęć:", error.message);
      toast({
        title: "⚠️ Błąd",
        description: "Nie udało się pobrać zdjęć z tego albumu.",
        variant: "destructive",
      });
      setImages([]); // 🔒 en cas d’erreur, vider quand même
    } finally {
      setLoading(false);
    }
  };

  fetchImages();
}, [album]);


  // pagination
  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
  const paginatedImages = images.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // navigation viewer
  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % images.length);
  };

 const handleDownload = async (url: string, name: string) => {
  try {
    // 🔽 Télécharger le fichier en tant que blob
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();

    // 🧱 Créer une URL temporaire pour le blob
    const blobUrl = window.URL.createObjectURL(blob);

    // 📁 Créer un lien de téléchargement forcé
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = name; // ✅ force le téléchargement
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // ♻️ Libérer la mémoire
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("❌ Błąd pobierania:", error);
    toast({
      title: "⚠️ Błąd pobierania",
      description: "Nie udało się pobrać zdjęcia.",
      variant: "destructive",
    });
  }
};


  // 🧭 Vue principale – liste d’albums
  if (!album) {
    return (
      <div className="bg-[#e6e6e6] border border-gray-400 rounded-xl p-6 shadow-sm shadow-gray-500/20">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">📚 Wybierz album</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {albums.map((a) => (
            <button
              key={a.value}
              onClick={() => setAlbum(a.value)}
              className="flex flex-col items-center justify-center p-6 bg-[#f2f2f2] border border-gray-400 rounded-lg shadow hover:bg-[#dcdcdc] transition"
            >
              <FolderOpen className="w-10 h-10 mb-3 text-gray-700" />
              <span className="text-gray-800 font-semibold">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 🖼️ Vue album – liste des images
  return (
    <div className="bg-[#e6e6e6] border border-gray-400 rounded-xl p-6 shadow-sm shadow-gray-500/20 relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
           Zdjęcia z albumu:{" "}
          <span className="italic text-gray-700">
            {albums.find((a) => a.value === album)?.label}
          </span>
        </h2>
        <button
          onClick={() => setAlbum(null)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Wróć</span>
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Ładowanie zdjęć...</p>
      ) : images.length === 0 ? (
        <p className="text-gray-600">Brak zdjęć w tym albumie.</p>
      ) : (
        <>
          {/* miniatures */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {paginatedImages.map((img, i) => (
              <div
                key={img._id}
                className="border border-gray-400 rounded-md overflow-hidden shadow-sm bg-[#f9f9f9] cursor-pointer hover:opacity-80"
                onClick={() => setSelectedIndex((page - 1) * ITEMS_PER_PAGE + i)}
              >
                <img
                  src={`${VITE_API_IMAGE}/uploads/${img.name}`}
                  alt={img.name}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </div>

          {/* pagination controls */}
          <div className="flex justify-center items-center mt-6 space-x-3">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              ← Poprzednia
            </button>
            <span className="text-gray-700">
              Strona {page} z {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Następna →
            </button>
          </div>
        </>
      )}

      {/* viewer */}
      {selectedIndex !== null && images[selectedIndex] && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
          <button
            className="absolute top-6 right-6 text-white text-xl font-bold"
            onClick={() => setSelectedIndex(null)}
          >
            ✕
          </button>

          <div className="flex items-center space-x-8">
            <button
              onClick={handlePrev}
              className="text-white hover:text-gray-300 transition"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <img
              src={`${VITE_API_IMAGE}/uploads/${images[selectedIndex].name}`}
              alt={images[selectedIndex].name}
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
            />

            <button
              onClick={handleNext}
              className="text-white hover:text-gray-300 transition"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </div>

          <button
            onClick={() =>
              handleDownload(
                `${VITE_API_IMAGE}/uploads/${images[selectedIndex].name}`,
                images[selectedIndex].name
              )
            }
            className="flex items-center space-x-2 mt-6 text-white bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            <Download className="w-5 h-5" />
            <span>Pobierz</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoList;
