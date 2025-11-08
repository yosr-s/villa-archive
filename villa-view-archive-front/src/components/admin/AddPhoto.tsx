import React, { useState, ChangeEvent, FormEvent } from "react";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { imageService } from "../../services/image.service"; 

interface PhotoFormData {
  album: string;
  files: FileList | null;
}

const AddPhoto: React.FC = () => {
  const [formData, setFormData] = useState<PhotoFormData>({
    album: "",
    files: null,
  });
  const [loading, setLoading] = useState(false);

  const albums = [
    { label: "Ogród", value: "garden" },
    { label: "Pory roku", value: "seasons" },
    { label: "Odbudowa ogrodu", value: "garden_reconstruction" },
  ];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, files: e.target.files });
  };

  const handleAlbumChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, album: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.album) {
      toast({
        title: "⚠️ Brak wybranego albumu",
        description: "Wybierz album, do którego chcesz dodać zdjęcia.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.files || formData.files.length === 0) {
      toast({
        title: "⚠️ Nie wybrano plików",
        description: "Dodaj co najmniej jedno zdjęcie.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // 🚀 Envoi vers le backend (upload multiple)
      const filesArray = Array.from(formData.files);
      const res = await Promise.all(
        filesArray.map((file) => imageService.uploadImage(file, formData.album))
      );

      toast({
        title: "📸 Upload zakończony sukcesem",
        description: `${res.length} zdjęć dodano do albumu „${formData.album}”.`,
      });

      // reset formularza
      setFormData({ album: "", files: null });
      (document.getElementById("photoInput") as HTMLInputElement).value = "";
    } catch (error: any) {
      console.error("❌ Błąd uploadu:", error.message);
      toast({
        title: "❌ Błąd podczas wysyłania zdjęć",
        description: error.message || "Spróbuj ponownie później.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#e6e6e6] border border-gray-400 rounded-xl p-6 shadow-sm shadow-gray-500/20">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <Upload className="w-5 h-5" /> Dodaj zdjęcia
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Wybór albumu */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Wybierz album:
          </label>
          <select
            value={formData.album}
            onChange={handleAlbumChange}
            className="w-full border border-gray-400 rounded-md p-2 bg-[#f2f2f2] text-gray-800 focus:ring-2 focus:ring-gray-500"
          >
            <option value="">-- Wybierz album --</option>
            {albums.map((album) => (
              <option key={album.value} value={album.value}>
                {album.label}
              </option>
            ))}
          </select>
        </div>

        {/* Upload plików */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Dodaj zdjęcia:
          </label>
          <input
            id="photoInput"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-400 rounded-md p-2 bg-[#f9f9f9] text-gray-700 cursor-pointer focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Przycisk wysyłania */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-[#cfcfcf] text-gray-900 px-5 py-2 rounded-lg font-semibold hover:bg-[#bfbfbf] transition flex items-center space-x-2 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Wysyłanie..." : "Wyślij"}
        </button>
      </form>
    </div>
  );
};

export default AddPhoto;
