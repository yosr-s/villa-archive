
import React, { useState } from 'react';
import { useVideos } from '../../contexts/VideoContext';
import { toast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

const AddVideo = () => {
  const { addVideo } = useVideos();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    creationDate: '',
    isPublic: true,
    thumbnailUrl: '',
    videoUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, you would upload the video file here
      addVideo({
        ...formData,
        thumbnailUrl: formData.thumbnailUrl || 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop',
        videoUrl: formData.videoUrl || 'https://example.com/video.mp4'
      });

      toast({
        title: "Video added successfully",
        description: "The video has been uploaded to the archive.",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        creationDate: '',
        isPublic: true,
        thumbnailUrl: '',
        videoUrl: ''
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading the video.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="luxury-card p-8">
      <div className="mb-8">
        <h2 className="font-luxury text-3xl font-semibold text-luxury-darkGrey mb-2">
          Dodaj nowe wideo
        </h2>
        <p className="text-luxury-grey">
          Prześlij nowe wideo do archiwum luksusowej willi
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-luxury-darkGrey mb-2">
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
            <label htmlFor="creationDate" className="block text-sm font-medium text-luxury-darkGrey mb-2">
              Data utworzenia
            </label>
            <input
              id="creationDate"
              name="creationDate"
              type="date"
              value={formData.creationDate}
              onChange={handleInputChange}
              className="luxury-input"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-luxury-darkGrey mb-2">
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
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-luxury-darkGrey mb-2">
              Adres URL miniatury 
            </label>
            <input
              id="thumbnailUrl"
              name="thumbnailUrl"
              type="url"
              value={formData.thumbnailUrl}
              onChange={handleInputChange}
              className="luxury-input"
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-luxury-darkGrey mb-2">
              Adres URL wideo 
            </label>
            <input
              id="videoUrl"
              name="videoUrl"
              type="url"
              value={formData.videoUrl}
              onChange={handleInputChange}
              className="luxury-input"
              placeholder="https://example.com/video.mp4"
            />
          </div>
        </div>

     <div>
  <label className="flex items-center space-x-3">
    <span className="text-sm font-medium text-luxury-darkGrey">
      Udostępnij to wideo publicznie (widoczne dla gości)
    </span>

    <button
      type="button"
      role="switch"
      aria-checked={formData.isPublic}
      onClick={() =>
        handleInputChange({
          target: { name: 'isPublic', value: !formData.isPublic },
        } as any)
      }
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
        formData.isPublic ? 'bg-luxury-darkGrey' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          formData.isPublic ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </label>
</div>


        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="luxury-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>{isLoading ? 'Przesyłanie...' : 'Prześlij wideo'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVideo;
