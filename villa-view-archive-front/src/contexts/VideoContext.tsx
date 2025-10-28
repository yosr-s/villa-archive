import React, { createContext, useContext, useState, useEffect } from "react";
import { Video } from "../types/video";
import { videoService } from "../services/video.service";
import { toast } from "@/hooks/use-toast";

interface VideoContextType {
  videos: Video[];
  fetchVideos: () => Promise<void>; 
  fetchPublicVideos: () => Promise<void>; 
  addVideo: (video: Omit<Video, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateVideo: (id: string, updates?: Partial<Video>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  getPublicVideos: () => Video[];
  downloadVideo: (vimeoId: string) => Promise<void>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideos = () => {
  const context = useContext(VideoContext);
  if (!context) throw new Error("useVideos must be used within a VideoProvider");
  return context;
};

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>([]);

  /* -------------------------------------------------------------------------- */
  /* 🟢 Charger les vidéos depuis MongoDB au montage                            */
  /* -------------------------------------------------------------------------- */
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const data = await videoService.getVideos();
  //       setVideos(data);
  //     } catch (err) {
  //       console.error("Erreur chargement vidéos :", err);
  //       toast({
  //         title: "Błąd ładowania",
  //         description: "Nie udało się załadować listy wideo.",
  //         variant: "destructive",
  //       });
  //     }
  //   })();
  // }, []);


  /* -------------------------------------------------------------------------- */
  /* 🧩 Fonction publique : chargement manuel des vidéos après login            */
  /* -------------------------------------------------------------------------- */
  const fetchVideos = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("⚠️ Pas de token — skip fetchVideos()");
      return;
    }

    try {
      const data = await videoService.getVideos();
      setVideos(data);
    } catch (err) {
      console.error("Erreur chargement vidéos :", err);
      toast({
        title: "Błąd ładowania",
        description: "Nie udało się załadować listy wideo.",
        variant: "destructive",
      });
    }
  };
    const fetchPublicVideos = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("⚠️ Pas de token — skip fetchVideos()");
      return;
    }

    try {
      const data = await videoService.getPublicVideos();
      setVideos(data);
    } catch (err) {
      console.error("Erreur chargement vidéos :", err);
      toast({
        title: "Błąd ładowania",
        description: "Nie udało się załadować listy wideo.",
        variant: "destructive",
      });
    }
  };
  /* -------------------------------------------------------------------------- */
  /* ➕ Ajouter une vidéo (via backend → MongoDB)                                */
  /* -------------------------------------------------------------------------- */
  const addVideo = async (video: Omit<Video, "_id" | "createdAt" | "updatedAt">) => {
    try {
      const res = await videoService.registerVideo(video);
      const added = res.video || res;
      setVideos((prev) => [added, ...prev]);

      toast({
        title: "✅ Wideo dodane",
        description: "Nowe wideo zostało pomyślnie zapisane w archiwum.",
      });
    } catch (err) {
      console.error("Erreur ajout vidéo :", err);
      toast({
        title: "❌ Błąd",
        description: "Nie udało się dodać wideo.",
        variant: "destructive",
      });
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🔁 Mettre à jour une vidéo (toggle ou update complet)                      */
  /* -------------------------------------------------------------------------- */
  const updateVideo = async (id: string, updates?: Partial<Video>) => {
    try {
      let updatedVideo;

      if (!updates || Object.keys(updates).length === 0 || updates.isPrivate === undefined) {
        // 🔄 Cas toggle
        const res = await videoService.toggleActive(id);
        updatedVideo = res.video || res;
      } else {
        // ✏️ Cas update complet
        const res = await videoService.updateVideoById(id, updates);
        updatedVideo = res.video || res;
      }

      setVideos((prev) =>
        prev.map((v) => (v._id === id ? { ...v, ...updatedVideo } : v))
      );

      toast({
        title: "🔄 Zaktualizowano",
        description: "Wideo zostało zaktualizowane pomyślnie.",
      });
    } catch (err) {
      console.error("Erreur mise à jour vidéo :", err);
      toast({
        title: "❌ Błąd",
        description: "Nie udało się zaktualizować wideo.",
        variant: "destructive",
      });
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🗑️ Supprimer une vidéo                                                     */
  /* -------------------------------------------------------------------------- */
  const deleteVideo = async (id: string) => {
    try {
      await videoService.deleteVideo(id);
      setVideos((prev) => prev.filter((v) => v._id !== id));

      toast({
        title: "🗑️ Usunięto",
        description: "Wideo zostało pomyślnie usunięte.",
      });
    } catch (err) {
      console.error("Erreur suppression vidéo :", err);
      toast({
        title: "❌ Błąd",
        description: "Nie udało się usunąć wideo.",
        variant: "destructive",
      });
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 📥 Télécharger une vidéo                                                   */
  /* -------------------------------------------------------------------------- */
  const downloadVideo = async (vimeoId: string) => {
    try {
      await videoService.downloadVideo(vimeoId);
      toast({
        title: "📥 Pobieranie",
        description: "Wideo zostało pobrane pomyślnie.",
      });
    } catch (err) {
      console.error("Erreur téléchargement vidéo :", err);
      toast({
        title: "❌ Błąd",
        description: "Nie udało się pobrać wideo.",
        variant: "destructive",
      });
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🌍 Filtrer uniquement les vidéos publiques                                 */
  /* -------------------------------------------------------------------------- */
  const getPublicVideos = () => videos.filter((v) => !v.isPrivate);

  return (
    <VideoContext.Provider
      value={{ videos, addVideo, updateVideo, deleteVideo,downloadVideo, getPublicVideos,  fetchVideos ,fetchPublicVideos}}
    >
      {children}
    </VideoContext.Provider>
  );
};
