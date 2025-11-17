import type { Metadata } from "next";
import { GalleryContent } from "./GalleryContent";

export const metadata: Metadata = {
  title: "Gallery - Replit",
  description: "Explore projects built on Replit",
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gallery</h1>
          <p className="text-lg text-gray-600">
            Explore amazing projects built on Replit
          </p>
        </div>
        <GalleryContent />
      </div>
    </div>
  );
}
