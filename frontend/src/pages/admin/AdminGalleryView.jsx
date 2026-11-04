import React, { useState, useMemo } from "react";
import {
  Image as ImageIcon,
  PlusCircle,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useBooking } from "../../context/BookingContext";

export const AdminGalleryView = () => {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useBooking();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Form State
  const [photoForm, setPhotoForm] = useState({
    title: "",
    category: "Rooms",
    image: "/images/hero.jpg",
    description: "",
  });

  const categories = ["All", "Rooms", "Dining", "Exterior", "Facilities"];

  // Filtered gallery items
  const filteredGallery = useMemo(() => {
    return gallery.filter((item) => {
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [gallery, selectedCategory, searchTerm]);

  // Open Add Photo
  const handleOpenAddPhoto = () => {
    setEditingPhoto(null);
    setPhotoForm({
      title: "",
      category: "Rooms",
      image: "/images/room1.jpeg",
      description: "Atmospheric view of our Kalika guest spaces.",
    });
    setIsPhotoModalOpen(true);
  };

  // Open Edit Photo
  const handleOpenEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setPhotoForm({
      title: photo.title,
      category: photo.category || "Rooms",
      image: photo.image,
      description: photo.description || "",
    });
    setIsPhotoModalOpen(true);
  };

  // Submit Photo Form
  const handleSubmitPhoto = (e) => {
    e.preventDefault();
    if (!photoForm.title || !photoForm.image) {
      alert("Please provide a title and image path.");
      return;
    }

    if (editingPhoto) {
      updateGalleryItem(editingPhoto.id, photoForm);
    } else {
      addGalleryItem(photoForm);
    }

    setIsPhotoModalOpen(false);
  };

  // Delete Photo
  const handleConfirmDelete = () => {
    if (!photoToDelete) return;
    deleteGalleryItem(photoToDelete.id);
    setPhotoToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <ImageIcon size={22} className="text-amber-600" />
            <span>Photo & Space Gallery Management</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Curate high-definition photography displayed on the public customer gallery page.
          </p>
        </div>

        <button
          onClick={handleOpenAddPhoto}
          className="px-4 py-2.5 rounded-xl bg-[#0c2317] hover:bg-[#143825] text-amber-300 font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer self-start md:self-auto"
        >
          <PlusCircle size={16} className="text-amber-400" />
          <span>Add New Photo</span>
        </button>
      </div>

      {/* ================= TOOLBAR ================= */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search photos by title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#0c2317] text-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-[#0c2317] text-amber-300 shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ================= GALLERY GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-all group"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-stone-950/80 backdrop-blur-md text-amber-300">
                    {item.category}
                  </span>
                </div>
                <button
                  onClick={() => setPreviewPhoto(item)}
                  className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-semibold"
                >
                  <Eye size={16} />
                  <span>Preview Full</span>
                </button>
              </div>

              <div className="p-3.5">
                <h4 className="font-bold text-xs text-stone-900 truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                  {item.description || "Kalika Hotel & Lodge space photo."}
                </p>
              </div>
            </div>

            <div className="px-3.5 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-stone-400 font-mono">
                {item.id}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditPhoto(item)}
                  className="p-1.5 text-stone-600 hover:text-amber-800 hover:bg-stone-200 rounded-lg"
                  title="Edit Caption"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => setPhotoToDelete(item)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="Delete Photo"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                {editingPhoto ? "Edit Gallery Item" : "Add Image to Gallery"}
              </h3>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitPhoto} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Photo Title / Caption *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Garden Pavilion Veranda"
                  value={photoForm.title}
                  onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Space Category *
                </label>
                <select
                  value={photoForm.category}
                  onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-semibold focus:outline-none focus:border-[#0c2317]"
                >
                  <option value="Rooms">Rooms & Suites</option>
                  <option value="Dining">Dining & Restaurant</option>
                  <option value="Exterior">Exterior & Lobby</option>
                  <option value="Facilities">Facilities & Services</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Image Path / URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="/images/hero.jpg or https://..."
                  value={photoForm.image}
                  onChange={(e) => setPhotoForm({ ...photoForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                />
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-stone-500">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setPhotoForm({ ...photoForm, image: "/images/hero.jpg" })}
                    className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-700"
                  >
                    Hero
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoForm({ ...photoForm, image: "/images/dining-main.jpg" })}
                    className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-700"
                  >
                    Dining
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoForm({ ...photoForm, image: "/images/room2.jpeg" })}
                    className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-700"
                  >
                    Deluxe
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoForm({ ...photoForm, image: "/images/dining-terrace.jpg" })}
                    className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-700"
                  >
                    Terrace
                  </button>
                </div>
              </div>

              {/* Live Image Preview */}
              {photoForm.image && (
                <div className="rounded-xl overflow-hidden h-36 bg-stone-100 border border-stone-200">
                  <img
                    src={photoForm.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/images/hero.jpg";
                    }}
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Description / Story
                </label>
                <textarea
                  rows={2}
                  value={photoForm.description}
                  onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#0c2317] hover:bg-[#143825] text-amber-300 rounded-xl shadow-md cursor-pointer"
                >
                  {editingPhoto ? "Save Photo" : "Add to Gallery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= FULL LIGHTBOX PREVIEW ================= */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="relative h-80 bg-stone-900">
              <img
                src={previewPhoto.image}
                alt={previewPhoto.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setPreviewPhoto(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-950/70 text-white flex items-center justify-center hover:bg-stone-950 transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="p-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                {previewPhoto.category}
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                {previewPhoto.title}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {previewPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {photoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-bold text-stone-900">Delete Photo?</h3>
            <p className="text-xs text-stone-600 mt-2">
              Are you sure you want to remove <strong>{photoToDelete.title}</strong> from the public gallery?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setPhotoToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGalleryView;
