"use client";

import { useState, ChangeEvent } from "react";

export default function BackgroundRemover() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackground = async () => {
    if (!originalImage) return;

    setLoading(true);

    try {
      const response = await fetch("/api/services/remove-bg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: originalImage.split(",")[1],
        }),
      });

      const data: { image: string } = await response.json();
      setProcessedImage(`data:image/png;base64,${data.image}`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Eliminador de fondos</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      />

      {originalImage && (
        <button
          onClick={removeBackground}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
        >
          {loading ? "Procesando..." : "Quitar fondo"}
        </button>
      )}

      {originalImage && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Imagen original:</h2>
          <img src={originalImage} alt="Original" className="max-w-sm" />
        </div>
      )}

      {processedImage && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Imagen sin fondo:</h2>
          <img src={processedImage} alt="Sin fondo" className="max-w-sm" />
        </div>
      )}
    </div>
  );
}
