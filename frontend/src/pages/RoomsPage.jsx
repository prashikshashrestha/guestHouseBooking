import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import RoomCard from "../components/rooms/RoomCard";
import RoomFilterBar from "../components/rooms/RoomFilterBar";
import { useBooking } from "../context/BookingContext";

export const RoomsPage = () => {
  const { rooms } = useBooking();
  const [urlParams] = useSearchParams();
  const initialCategory = urlParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("price-asc");

  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        // Category filter
        if (selectedCategory !== "All" && room.category !== selectedCategory) {
          return false;
        }
        // Status filter
        if (statusFilter !== "All" && room.status !== statusFilter) {
          return false;
        }
        // Search term
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchNumber = room.roomNumber.toLowerCase().includes(term);
          const matchCat = room.category.toLowerCase().includes(term);
          const matchDesc = room.description?.toLowerCase().includes(term);
          const matchAmenities = room.amenities?.some((a) =>
            a.toLowerCase().includes(term)
          );
          if (!matchNumber && !matchCat && !matchDesc && !matchAmenities) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.pricePerNight - b.pricePerNight;
        if (sortBy === "price-desc") return b.pricePerNight - a.pricePerNight;
        if (sortBy === "room-asc")
          return a.roomNumber.localeCompare(b.roomNumber, undefined, {
            numeric: true,
          });
        return 0;
      });
  }, [rooms, selectedCategory, statusFilter, searchTerm, sortBy]);

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-stone-100/80 to-amber-100/50 text-stone-900 py-12 mb-8 border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold tracking-widest text-amber-800 uppercase">
            Accommodations at Kalika Hotel
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display-luxury text-stone-900 mt-1">
            Rooms & Luxury Suites
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto mt-2">
            Choose from our comfortable standard rooms, spacious deluxe suites, and executive rooms with video tours.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <RoomFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-stone-600">
          <p>
            Showing <strong>{filteredRooms.length}</strong> of{" "}
            <strong>{rooms.length}</strong> rooms
          </p>
          {selectedCategory !== "All" && (
            <button
              onClick={() => setSelectedCategory("All")}
              className="text-amber-700 font-semibold hover:underline"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
            <p className="text-base font-bold text-stone-700">
              No rooms found matching your filter criteria.
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Try adjusting your category, search keywords, or status filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchTerm("");
                setStatusFilter("All");
              }}
              className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-amber-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;
