export interface Video {
  _id?: string;
  title: string;
  description?: string;
  thumbnail?: string;
  embedUrl: string;      // 🔹 URL pour l’iframe
  shareUrl?: string;     // 🔹 URL publique pour le partage
  vimeoId: string;       // 🔹 ID vidéo Vimeo
  creationDate?: string; // optionnelle
  isPrivate?: boolean;   // true = cachée pour visiteurs
  createdAt?: string;
  updatedAt?: string;
}
