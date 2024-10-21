import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const images = [
  'https://i.imgur.com/wpLe5ia.png',
  'https://i.imgur.com/HcdvKxU.png',
  'https://i.imgur.com/duyrScy.png',
  'https://i.imgur.com/rf5DHNQ.png',
  'https://i.imgur.com/utn8woA.png',
  'https://i.imgur.com/bzQRn0c.png',
  'https://i.imgur.com/77q97rs.png',
  'https://i.imgur.com/34ESVyc.png',
  'https://i.imgur.com/RvQJQMQ.png'
];

const RupertsDownloads = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'rupert-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error("Failed to download image. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Rupert's Downloads</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <Dialog key={index}>
            <DialogTrigger>
              <img
                src={image}
                alt={`Rupert's image ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedImage(image)}
              />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <div className="mt-4">
                <img
                  src={selectedImage}
                  alt="Selected Rupert's image"
                  className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                />
                <Button
                  className="mt-4 w-full"
                  onClick={() => handleDownload(selectedImage)}
                >
                  Download Image
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default RupertsDownloads;