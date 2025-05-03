"use client";

import Image from "next/image";
import { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import { base64ToFile } from "../../_lib/helpers";
import { defaultImageUrl } from "../../_lib/constant";

const NEXT_PUBLIC_S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL;

export default function BackgroundRemover({
  file,
  setFile,
  imageUrl = defaultImageUrl,
}: {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  imageUrl?: string;
}) {
  const [defautImage, setDefaultImage] = useState<boolean>(true);
  const [sourceImage, setSourceImage] = useState<string>(`${NEXT_PUBLIC_S3_BASE_URL}${imageUrl}`);
  const [processedImage, setProcessedImage] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("image-product-default.jpg");
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
      setDefaultImage(false);
      setFile(file);
    }
  };

  const removeBackground = async () => {
    if (defautImage) return;
    if (processedImage) return;

    setLoading(true);

    try {
      const response = await fetch("/api/services/remove-bg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: sourceImage.split(",")[1],
        }),
      });

      const data: { image: string } = await response.json();
      const base64Image = `data:image/png;base64,${data.image}`;
      const fileObject = base64ToFile(base64Image, fileName);

      setSourceImage(base64Image);
      setProcessedImage(true);
      setFile(fileObject);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <label
          htmlFor="Image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {processedImage ? "Imagen sin fondo:" : "Imagen original:"}
        </label>
      </div>
      <div className="relative h-96 w-full rounded-lg overflow-hidden">
        <Image
          src={sourceImage}
          alt={file ? file.name : "image-product-default"}
          fill
          className="object-contain"
        />
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      />

      {!processedImage && (
        <div className="flex justify-end">
          <button
            onClick={removeBackground}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            {loading ? "Procesando..." : "Quitar fondo"}
          </button>
        </div>
      )}
    </>
  );
}
