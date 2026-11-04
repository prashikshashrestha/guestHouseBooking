import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BedDouble,
  PlusCircle,
  Edit,
  Trash2,
  Search,
  Grid,
  List,
  AlertTriangle,
  Tag,
} from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { formatCurrency } from "../../utils/formatDate";

export const AdminRoomsView = () => {
  const {
    rooms,
    categories,
    addRoom,
    updateRoom,
    deleteRoom,
    updateRoomStatus,
    updateCategory,
  } = useBooking();

  const [searchParams] = useSearchParams();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid | table

  // Modals state
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  // Room Form State
  const [roomForm, setRoomForm] = useState({
    roomNumber: "",
    category: categories[0]?.name || "Standard Room",
    floor: 1,
    pricePerNight: 2000,
    bedType: "King Bed",
    maxGuests: 2,
    roomSize: "300 sq.ft",
    view: "Courtyard View",
    description: "",
    amenities: "High-speed Wi-Fi, Attached Bathroom, 24/7 Hot Water, LED TV",
    images: "/images/room1.jpeg",
    videoUrl: "",
    status: "available",
  });

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    basePrice: 2500,
    description: "",
    bedType: "King Bed",
    updateExistingRooms: true,
  });

  // Open Add Room Modal
  const handleOpenAddRoom = useCallback(() => {
    setEditingRoom(null);
    setRoomForm({
      roomNumber: "",
      category: categories[0]?.name || "Standard Room",
      floor: 1,
      pricePerNight: categories[0]?.basePrice || 2000,
      bedType: "King Bed",
      maxGuests: 2,
      roomSize: "300 sq.ft",
      view: "Garden View",
      description: "Comfortable and quiet room with modern amenities at Kalika Hotel.",
      amenities: "High-speed Wi-Fi, Attached Bathroom, 24/7 Hot Shower, Smart TV",
      images: "/images/room1.jpeg",
      videoUrl: "",
      status: "available",
    });
    setIsRoomModalOpen(true);
  }, [categories]);

  // Check query parameter to auto-open Add Room modal
  useEffect(() => {
    if (searchParams.get("openAdd") === "true") {
      handleOpenAddRoom();
    }
  }, [searchParams, handleOpenAddRoom]);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const query = searchTerm.toLowerCase().trim();
      const matchSearch =
        !query ||
        r.roomNumber?.toString().includes(query) ||
        r.category?.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query);

      const matchCategory =
        categoryFilter === "all" || r.category === categoryFilter;

      const matchStatus =
        statusFilter === "all" || r.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [rooms, searchTerm, categoryFilter, statusFilter]);

  // Status Badge Helper
  const getRoomStatusBadge = (status) => {
    const map = {
      available: { bg: "bg-emerald-100 text-emerald-800 border-emerald-200", label: "Available" },
      occupied: { bg: "bg-amber-100 text-amber-900 border-amber-300 font-bold", label: "Occupied" },
      maintenance: { bg: "bg-rose-100 text-rose-800 border-rose-200", label: "Maintenance" },
      cleaning: { bg: "bg-blue-100 text-blue-800 border-blue-200", label: "Cleaning" },
      inactive: { bg: "bg-stone-200 text-stone-700 border-stone-300", label: "Inactive" },
    };
    const s = map[status] || { bg: "bg-stone-100 text-stone-700", label: status };
    return (
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${s.bg}`}>
        {s.label}
      </span>
    );
  };

  // Open Edit Room Modal
  const handleOpenEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      roomNumber: room.roomNumber,
      category: room.category,
      floor: room.floor || 1,
      pricePerNight: room.pricePerNight,
      bedType: room.bedType || "King Bed",
      maxGuests: room.maxGuests || 2,
      roomSize: room.roomSize || "300 sq.ft",
      view: room.view || "Courtyard View",
      description: room.description || "",
      amenities: Array.isArray(room.amenities)
        ? room.amenities.join(", ")
        : room.amenities || "",
      images: Array.isArray(room.images) ? room.images[0] : room.images || "/images/room1.jpeg",
      videoUrl: room.videoUrl || "",
      status: room.status || "available",
    });
    setIsRoomModalOpen(true);
  };

  // Submit Room Form (Add or Edit)
  const handleSubmitRoom = (e) => {
    e.preventDefault();
    if (!roomForm.roomNumber) {
      alert("Please enter a room number.");
      return;
    }

    const payload = {
      roomNumber: String(roomForm.roomNumber),
      category: roomForm.category,
      floor: Number(roomForm.floor),
      pricePerNight: Number(roomForm.pricePerNight),
      bedType: roomForm.bedType,
      maxGuests: Number(roomForm.maxGuests),
      roomSize: roomForm.roomSize,
      view: roomForm.view,
      description: roomForm.description,
      amenities: roomForm.amenities.split(",").map((s) => s.trim()).filter(Boolean),
      images: [roomForm.images],
      videoUrl: roomForm.videoUrl,
      status: roomForm.status,
    };

    if (editingRoom) {
      updateRoom(editingRoom.id, payload);
    } else {
      addRoom(payload);
    }

    setIsRoomModalOpen(false);
  };

  // Open Category Edit Modal
  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      basePrice: cat.basePrice,
      description: cat.description || "",
      bedType: cat.bedType || "King Bed",
      updateExistingRooms: true,
    });
    setIsCategoryModalOpen(true);
  };

  // Submit Category Update
  const handleSubmitCategory = (e) => {
    e.preventDefault();
    if (!editingCategory) return;

    updateCategory(
      editingCategory.id,
      {
        basePrice: Number(categoryForm.basePrice),
        description: categoryForm.description,
        bedType: categoryForm.bedType,
      },
      categoryForm.updateExistingRooms
    );

    setIsCategoryModalOpen(false);
  };

  // Execute Room Delete
  const handleConfirmDeleteRoom = () => {
    if (!roomToDelete) return;
    setDeleteErrorMessage("");

    const res = deleteRoom(roomToDelete.id);
    if (!res.success) {
      setDeleteErrorMessage(res.message);
      return;
    }

    setRoomToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER & TOP CONTROLS ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <BedDouble size={22} className="text-amber-600" />
            <span>Room Inventory & Tier Management</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage Kalika Hotel's rooms, assign tiers, update night rates, and maintain availability statuses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenAddRoom()}
            className="px-4 py-2.5 rounded-xl bg-[#0c2317] hover:bg-[#143825] text-amber-300 font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <PlusCircle size={16} className="text-amber-400" />
            <span>Add New Room</span>
          </button>
        </div>
      </div>

      {/* ================= CATEGORY PRICING SUMMARY ================= */}
      <div className="bg-gradient-to-r from-amber-50/70 via-stone-50 to-amber-100/40 rounded-3xl p-5 border border-amber-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <Tag size={14} className="text-amber-700" />
            <span>Standard Room Tiers & Base Rates</span>
          </span>
          <span className="text-[11px] text-stone-500">
            Click any tier to adjust base rate
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const count = rooms.filter((r) => r.category === cat.name).length;
            return (
              <div
                key={cat.id}
                onClick={() => handleOpenEditCategory(cat)}
                className="bg-white p-3.5 rounded-2xl border border-stone-200 hover:border-amber-400 transition-all cursor-pointer shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900 group-hover:text-amber-800 transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[10px] font-semibold bg-stone-100 px-2 py-0.5 rounded-full text-stone-600">
                    {count} room(s)
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-base font-bold text-amber-900">
                    {formatCurrency(cat.basePrice)}
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold group-hover:underline">
                    Edit Rate &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= SEARCH & VIEW TOOLBAR ================= */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by room number or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0c2317]/20 focus:border-[#0c2317] transition-all text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl border border-stone-200 bg-stone-50 font-semibold text-stone-800 focus:outline-none focus:border-[#0c2317]"
            >
              <option value="all">All Tiers</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl border border-stone-200 bg-stone-50 font-semibold text-stone-800 focus:outline-none focus:border-[#0c2317]"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="cleaning">Cleaning</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
              }`}
              title="Grid Card View"
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "table" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
              }`}
              title="List Table View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= ROOMS GRID / TABLE ================= */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map((room) => {
            const displayImg = Array.isArray(room.images) && room.images.length > 0 ? room.images[0] : "/images/room1.jpeg";

            return (
              <div
                key={room.id}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden flex flex-col justify-between hover:border-amber-400/80 transition-all group"
              >
                <div>
                  {/* Room Image & Badges */}
                  <div className="relative h-44 overflow-hidden bg-stone-100">
                    <img
                      src={displayImg}
                      alt={`Room ${room.roomNumber}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-3 py-1 bg-stone-950/80 backdrop-blur-md text-amber-300 text-xs font-bold rounded-xl shadow-xs">
                        Room #{room.roomNumber}
                      </span>
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-stone-800 text-[10px] font-semibold rounded-xl shadow-xs">
                        Floor {room.floor}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      {getRoomStatusBadge(room.status)}
                    </div>
                  </div>

                  {/* Room Meta */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-stone-900">
                        {room.category}
                      </h3>
                      <span className="text-base font-bold text-stone-950">
                        {formatCurrency(room.pricePerNight)}
                        <span className="text-[11px] font-normal text-stone-500">/nt</span>
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                      {room.description || "Well-appointed guest room with attached bathroom and optical internet."}
                    </p>

                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      <span className="text-[10px] bg-stone-100 text-stone-700 font-semibold px-2 py-0.5 rounded-md">
                        {room.bedType || "King Bed"}
                      </span>
                      <span className="text-[10px] bg-stone-100 text-stone-700 font-semibold px-2 py-0.5 rounded-md">
                        Up to {room.maxGuests || 2} Guests
                      </span>
                      {room.roomSize && (
                        <span className="text-[10px] bg-stone-100 text-stone-700 font-semibold px-2 py-0.5 rounded-md">
                          {room.roomSize}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Operations Footer */}
                <div className="px-4 py-3 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between text-xs">
                  {/* Quick status dropdown */}
                  <select
                    value={room.status}
                    onChange={(e) => updateRoomStatus(room.id, e.target.value)}
                    className="py-1 px-2 rounded-lg border border-stone-200 bg-white font-semibold text-[11px] text-stone-700 focus:outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditRoom(room)}
                      className="p-1.5 text-stone-700 hover:text-amber-800 hover:bg-stone-200/70 rounded-lg transition-colors"
                      title="Edit Room Details"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => setRoomToDelete(room)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Room"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 sm:px-6">Room Number</th>
                  <th className="py-3.5 px-4">Tier / Category</th>
                  <th className="py-3.5 px-4">Floor</th>
                  <th className="py-3.5 px-4">Rate per Night</th>
                  <th className="py-3.5 px-4">Bed & Capacity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right sm:pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="font-bold text-stone-900 text-sm">
                        Room #{room.roomNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-800">
                      {room.category}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      Floor {room.floor}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      {formatCurrency(room.pricePerNight)}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {room.bedType} (max {room.maxGuests || 2})
                    </td>
                    <td className="py-3.5 px-4">
                      {getRoomStatusBadge(room.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right sm:pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditRoom(room)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => setRoomToDelete(room)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= ADD / EDIT ROOM MODAL ================= */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                  {editingRoom ? "Update Room Specifications" : "Register New Room"}
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  {editingRoom ? `Edit Room #${editingRoom.roomNumber}` : "Add New Room to Inventory"}
                </h3>
              </div>
              <button
                onClick={() => setIsRoomModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitRoom} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 104"
                    value={roomForm.roomNumber}
                    onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Room Tier / Category *
                  </label>
                  <select
                    value={roomForm.category}
                    onChange={(e) => {
                      const selectedCat = categories.find((c) => c.name === e.target.value);
                      setRoomForm({
                        ...roomForm,
                        category: e.target.value,
                        pricePerNight: selectedCat ? selectedCat.basePrice : roomForm.pricePerNight,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-semibold focus:outline-none focus:border-[#0c2317]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Floor Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={roomForm.floor}
                    onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Price per Night (NPR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="500"
                    value={roomForm.pricePerNight}
                    onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Bed Configuration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 King Bed, 2 Twin Beds"
                    value={roomForm.bedType}
                    onChange={(e) => setRoomForm({ ...roomForm, bedType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Max Guest Occupancy
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={roomForm.maxGuests}
                    onChange={(e) => setRoomForm({ ...roomForm, maxGuests: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Room Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 320 sq.ft"
                    value={roomForm.roomSize}
                    onChange={(e) => setRoomForm({ ...roomForm, roomSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Current Status
                  </label>
                  <select
                    value={roomForm.status}
                    onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-semibold focus:outline-none focus:border-[#0c2317]"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Room Photo URL / Preset
                  </label>
                  <input
                    type="text"
                    placeholder="/images/room1.jpeg or https://..."
                    value={roomForm.images}
                    onChange={(e) => setRoomForm({ ...roomForm, images: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-stone-500">Presets:</span>
                    <button
                      type="button"
                      onClick={() => setRoomForm({ ...roomForm, images: "/images/room1.jpeg" })}
                      className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-700"
                    >
                      Room 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoomForm({ ...roomForm, images: "/images/room2.jpeg" })}
                      className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-700"
                    >
                      Room 2
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoomForm({ ...roomForm, images: "/images/room3.jpeg" })}
                      className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-700"
                    >
                      Room 3
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="High-speed Wi-Fi, Air Conditioning, Attached Bathroom, 24/7 Hot Shower, Smart TV"
                    value={roomForm.amenities}
                    onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Detailed Room Description
                  </label>
                  <textarea
                    rows={2}
                    value={roomForm.description}
                    onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#0c2317] hover:bg-[#143825] text-amber-300 rounded-xl shadow-md cursor-pointer"
                >
                  {editingRoom ? "Save Room Changes" : "Register Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CATEGORY PRICING MODAL ================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                  Category Tier Pricing
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  {categoryForm.name}
                </h3>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitCategory} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Default Base Rate per Night (NPR) *
                </label>
                <input
                  type="number"
                  min="500"
                  required
                  value={categoryForm.basePrice}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, basePrice: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Default Bed Type
                </label>
                <input
                  type="text"
                  value={categoryForm.bedType}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, bedType: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="updateRooms"
                  checked={categoryForm.updateExistingRooms}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      updateExistingRooms: e.target.checked,
                    })
                  }
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <label htmlFor="updateRooms" className="font-semibold text-stone-800">
                  Apply new base rate to all existing {categoryForm.name} rooms
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#0c2317] hover:bg-[#143825] text-amber-300 rounded-xl shadow-md cursor-pointer"
                >
                  Update Category Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {roomToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-bold text-stone-900">Delete Room #{roomToDelete.roomNumber}?</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Are you sure you want to remove <strong>Room #{roomToDelete.roomNumber} ({roomToDelete.category})</strong> from the hotel registry?
            </p>

            {deleteErrorMessage && (
              <div className="mt-3 p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                {deleteErrorMessage}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setRoomToDelete(null);
                  setDeleteErrorMessage("");
                }}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteRoom}
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

export default AdminRoomsView;
