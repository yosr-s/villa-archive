import React, { createContext, useContext, useState, useEffect } from 'react';
import { Video } from '../types/video';

interface VideoContextType {
  videos: Video[];
  addVideo: (video: Omit<Video, 'id' | 'uploadDate'>) => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  getPublicVideos: () => Video[];
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideos = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideos must be used within a VideoProvider');
  }
  return context;
};

// Format YYYY-MM-DD pour éviter les erreurs de fuseau
const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Pola pszenicy przed żniwami',
    description: 'Kompleksowa podróż ukazująca architektoniczny kunszt naszej luksusowej willi.',
    creationDate: '2025-07-31',
    isPublic: true,
    thumbnailUrl: "/lovable-uploads/4.jpg",
    videoUrl: 'https://next.frame.io/share/fd35786a-e08f-4486-932d-ee0564b69548/view/152e4d4f-7395-4a48-9025-57fbaad550a0',
    uploadDate: '2026-01-16'
  },
  {
    id: '2',
    title: 'Kwitnienie w atrium',
    description: 'Odkryj starannie zaprojektowane wnętrza, które definiują luksusowe życie.',
    creationDate: '2025-05-23',
    isPublic: true,
    thumbnailUrl: "/lovable-uploads/3.jpg",
    videoUrl: 'https://next.frame.io/share/749ae656-e0ae-4c63-8c9b-8fe6a1312184/view/25cfb9d9-ef3c-497f-95cd-91e4711a219d',
    uploadDate: '2024-02-02'
  },
  {
    id: '3',
    title: 'Wiosenne kwitnienie',
    description: 'Intymne spojrzenie na prywatne ogrody i otaczające je krajobrazy.',
    creationDate: '2025-05-07',
    isPublic: false,
    thumbnailUrl: "/lovable-uploads/2.jpg",
    videoUrl: 'https://next.frame.io/share/d5cac2d7-cdd0-495c-9362-7ccbd8f43160/view/96946956-ede9-4afa-a461-1ebcbdfedbf7',
    uploadDate: '2024-02-16'
  },
  {
    id: '4',
    title: 'Prywatny ogród i krajobrazy',
    description: 'Intymne spojrzenie na prywatne ogrody i otaczające je krajobrazy.',
    creationDate: '2023-10-14',
    isPublic: false,
    thumbnailUrl: "/lovable-uploads/1.jpg",
    videoUrl: 'https://next.frame.io/share/583b5690-6cbd-4741-bf08-a9901a5156f9/view/7932a836-de0c-4ce8-9dfb-9820d3611ac5',
    uploadDate: '2024-02-16'
  }
];

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>([]);

  // useEffect(() => {
  //   const savedVideos = localStorage.getItem('villa-videos');
  //   if (savedVideos) {
  //     setVideos(JSON.parse(savedVideos));
  //   } else {
  //     setVideos(mockVideos);
  //     localStorage.setItem('villa-videos', JSON.stringify(mockVideos));
  //   }
  // }, []);
  useEffect(() => {
  setVideos(mockVideos); // ⚠️ forcer l’utilisation des mocks
}, []);


  const addVideo = (video: Omit<Video, 'id' | 'uploadDate'>) => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    const newVideo: Video = {
      ...video,
      id: Date.now().toString(),
      creationDate: formattedDate,
      uploadDate: formattedDate
    };
    const updatedVideos = [newVideo, ...videos];
    setVideos(updatedVideos);
    localStorage.setItem('villa-videos', JSON.stringify(updatedVideos));
  };

  const updateVideo = (id: string, updates: Partial<Video>) => {
    const updatedVideos = videos.map(video =>
      video.id === id ? { ...video, ...updates } : video
    );
    setVideos(updatedVideos);
    localStorage.setItem('villa-videos', JSON.stringify(updatedVideos));
  };

  const deleteVideo = (id: string) => {
    const updatedVideos = videos.filter(video => video.id !== id);
    setVideos(updatedVideos);
    localStorage.setItem('villa-videos', JSON.stringify(updatedVideos));
  };

  const getPublicVideos = () => {
    return videos.filter(video => video.isPublic);
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        addVideo,
        updateVideo,
        deleteVideo,
        getPublicVideos
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
