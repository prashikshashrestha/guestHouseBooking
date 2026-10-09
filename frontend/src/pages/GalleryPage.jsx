import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { HOTEL_GALLERY, HOTEL_INFO } from "../utils/initialData";
import Button from "../components/common/Button";

export const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const categories = ["All", "Rooms", "Dining", "Exterior", "Facilities"];

  const filteredImages = useMemo(() => {
    if (activeCategory === "All") return HOTEL_GALLERY;
    return HOTEL_GALLERY.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const showNextImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const showPrevImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-stone-100/90 to-amber-100/40 text-stone-900 py-12 mb-10 border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold tracking-widest text-amber-800 uppercase">
            Visual Experience & Atmosphere
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display-luxury text-stone-900 mt-1">
            Photo & Space Gallery
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto mt-2">
            Explore our curated gallery of guest rooms, dining pavilions, garden verandas, and on-site hospitality facilities at {HOTEL_INFO.name}.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-stone-500">
          <p>
            Displaying <strong>{filteredImages.length}</strong> photo{filteredImages.length !== 1 ? "s" : ""} in <strong>{activeCategory}</strong>
          </p>
          <Link to="/rooms" className="text-amber-700 font-semibold hover:underline">
            View Available Rooms →
          </Link>
        </div>

        {/* Responsive Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "/images/hero.jpg";
                  }}
                />

                {/* Category badge */}
                <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  {item.category}
                </div>

                {/* Hover overlay with zoom icon */}
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Maximize2 className="w-5 h-5 text-amber-700" />
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-amber-800 font-semibold">
                  <span>Click to expand</span>
                  <span>{HOTEL_INFO.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">
            Experience In Person
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display-luxury text-stone-900">
            Ready to stay at Kalika Hotel & Lodge?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
            Book online with instant confirmation or give our front desk a call at {HOTEL_INFO.phone}.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link to="/rooms">
              <Button variant="gold" size="md">
                Browse Rooms & Reserve
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="secondary" size="md">
                Get Directions / Contact
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-50"
            aria-label="Close image lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation controls */}
          <button
            onClick={showPrevImage}
            className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={showNextImage}
            className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox content */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]"
          >
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[480px]">
              <img
                src={filteredImages[selectedImageIndex]?.image}
                alt={filteredImages[selectedImageIndex]?.title}
                className="max-h-[75vh] w-auto max-w-full object-contain mx-auto"
              />
            </div>
            <div className="p-4 sm:p-6 bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  {filteredImages[selectedImageIndex]?.category} • Photo {selectedImageIndex + 1} of {filteredImages.length}
                </span>
                <h3 className="text-base sm:text-lg font-bold font-display-luxury text-white">
                  {filteredImages[selectedImageIndex]?.title}
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  {filteredImages[selectedImageIndex]?.description}
                </p>
              </div>
              <Link to="/rooms" onClick={closeLightbox}>
                <Button variant="gold" size="sm" className="whitespace-nowrap font-bold">
                  Book A Room
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
