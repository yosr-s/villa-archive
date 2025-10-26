import React, { useState } from "react";
import { useVideos } from "../../contexts/VideoContext";
import { videoService } from "../../services/video.service";
import { toast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";

/**
 * 🎬 AddVideo : Upload local → Vimeo → MongoDB
 */
const AddVideo: React.FC = () => {
  const { addVideo } = useVideos();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    creationDate: "",
    isPrivate: false,
    file: null as File | null,
  });

  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 📦 Gère les changements d'input
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  /**
   * 📁 Sélection du fichier local
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
  };

  /**
   * 🚀 Soumission du formulaire (upload → Vimeo → DB)
   */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.file) {
//       toast({
//         title: "❌ Brak pliku",
//         description: "Wybierz plik wideo przed przesłaniem.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsLoading(true);
//     setProgress(0);

//     try {
//       // Étape 1️⃣ — Demande d’une URL d’upload à Vimeo
//       const { uploadUrl, vimeoId } = await videoService.createUploadUrl(
//         formData.title,
//         formData.description,
//         formData.file.size,
//         formData.isPrivate
//       );

//       // toast({
//       //   title: "🔗 Utworzono połączenie Vimeo",
//       //   description: "Rozpoczynam przesyłanie filmu...",
//       // });

//       // Étape 2️⃣ — Upload du fichier vidéo sur Vimeo (TUS)
//       //!await videoService.uploadToVimeo(uploadUrl, formData.file);
//       await videoService.uploadToVimeo(uploadUrl, formData.file, (p) => {
//   setProgress(p);
// });


//       // Étape 3️⃣ — Enregistrer la vidéo dans MongoDB
//       const embedUrl = `https://player.vimeo.com/video/${vimeoId}`;
//       const shareUrl = `https://vimeo.com/${vimeoId}`;

//       const payload = {
//         title: formData.title,
//         description: formData.description,
//         vimeoId,
//         embedUrl,
//         shareUrl,
//         isPrivate: formData.isPrivate,
//         creationDate: formData.creationDate,
//       };

//       await addVideo(payload);

//       toast({
//         title: "✅ Wideo przesłane",
//         description: "Nowe wideo zostało zapisane w archiwum willi.",
//       });

//       // 🔄 Reset formulaire
//       setFormData({
//         title: "",
//         description: "",
//         creationDate: "",
//         isPrivate: false,
//         file: null,
//       });
//       setProgress(0);
//     } catch (err) {
//       console.error("Erreur upload vidéo :", err);
//       toast({
//         title: "❌ Błąd przesyłania",
//         description: "Nie udało się przesłać wideo.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.file) {
    toast({
      title: "❌ Brak pliku",
      description: "Wybierz plik wideo przed przesłaniem.",
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);
  setProgress(0);

  try {
    // 1️⃣ — Crée une URL d’upload Vimeo
    const { uploadUrl, vimeoId } = await videoService.createUploadUrl(
      formData.title,
      formData.description,
      formData.file.size,
      formData.isPrivate
    );

    // 2️⃣ — Upload du fichier avec callback de progression
    await videoService.uploadToVimeo(uploadUrl, formData.file, (p) => {
      // Limite la progression à 80 % max pendant l'upload
      const percent = Math.min(Math.round(p * 0.8), 80);
      setProgress(percent);
    });

    // 3️⃣ — Enregistrement final dans MongoDB (phase 2)
    setProgress(85); // phase "register" démarre ici

    const embedUrl = `https://player.vimeo.com/video/${vimeoId}`;
    const shareUrl = `https://vimeo.com/${vimeoId}`;

    const payload = {
      title: formData.title,
      description: formData.description,
      vimeoId,
      embedUrl,
      shareUrl,
      isPrivate: formData.isPrivate,
      creationDate: formData.creationDate,
    };

    await addVideo(payload);

    // Simule progression finale douce (85 → 100)
    for (let i = 86; i <= 100; i++) {
      await new Promise((r) => setTimeout(r, 25));
      setProgress(i);
    }

    toast({
      title: "✅ Wideo przesłane",
      description: "Nowe wideo zostało zapisane w archiwum.",
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      creationDate: "",
      isPrivate: false,
      file: null,
    });
    setProgress(0);
  } catch (err) {
    console.error("Erreur upload vidéo :", err);
    toast({
      title: "❌ Błąd przesyłania",
      description: "Nie udało się przesłać wideo.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <>
      {/* {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
          <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
          <p className="text-white text-lg font-medium mb-4">
            Przesyłanie wideo...
          </p>

          {progress > 0 && (
            <div className="w-64 bg-gray-300 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      )} */}
      {isLoading && (
  <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 backdrop-blur-sm px-6">
    <p className="text-white text-lg font-semibold mb-4">
      Przesyłanie wideo: {progress}%
    </p>

    <div className="w-72 bg-white/30 rounded-full h-3 overflow-hidden">
      <div
        className="bg-gradient-to-r from-white via-gray-100 to-white h-3 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>

    <p className="text-gray-300 text-sm mt-3">Nie zamykaj tej strony...</p>
  </div>
)}


      <div className="luxury-card p-8">
        <div className="mb-8">
          <h2 className="font-luxury text-3xl font-semibold text-luxury-darkGrey mb-2">
            Dodaj nowe wideo
          </h2>
          <p className="text-luxury-grey">
            Prześlij plik wideo — zostanie automatycznie przesłany na serwer i
            zapisany w bazie.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-luxury-darkGrey mb-2"
              >
                Tytuł wideo
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                className="luxury-input"
                placeholder="Wpisz tytuł wideo"
                required
              />
            </div>

            <div>
              <label
                htmlFor="creationDate"
                className="block text-sm font-medium text-luxury-darkGrey mb-2"
              >
                Data utworzenia
              </label>
              <input
                id="creationDate"
                name="creationDate"
                type="date"
                value={formData.creationDate}
                onChange={handleInputChange}
                className="luxury-input"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-luxury-darkGrey mb-2"
            >
              Opis
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="luxury-input resize-none"
              placeholder="Opisz zawartość wideo"
            />
          </div>

          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-luxury-darkGrey mb-2"
            >
              Wybierz plik wideo 
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="luxury-input"
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-3">
              <span className="text-sm font-medium text-luxury-darkGrey">
                Udostępnij publicznie (widoczne dla gości)
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={!formData.isPrivate}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isPrivate: !prev.isPrivate,
                  }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  !formData.isPrivate ? "bg-luxury-darkGrey" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    !formData.isPrivate ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>

          {progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-luxury-darkGrey h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="luxury-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>{isLoading ? "Przesyłanie..." : "Prześlij wideo"}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddVideo;
