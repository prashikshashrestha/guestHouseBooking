import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import RoomCard from "../components/rooms/RoomCard";
import RoomFilterBar from "../components/rooms/RoomFilterBar";
import Loader from "../components/common/Loader";
import { useBooking } from "../context/BookingContext";
import { HOTEL_INFO } from "../utils/initialData";

export const RoomsPage = () => {
  const { rooms, bookings, searchParams, setSearchParams } = useBooking();
  const [urlParams] = useSearchParams();

  const initialCategory = urlParams.get("category") || searchParams.category || "All";
  const initialCheckIn = urlParams.get("checkIn") || searchParams.checkIn || new Date().toISOString().split("T")[0];
  const initialCheckOut = urlParams.get("checkOut") || searchParams.checkOut || new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const initialGuests = urlParams.get("guests") || String(searchParams.guests || "All");

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("price-asc");
  const [guestFilter, setGuestFilter] = useState(initialGuests === "All" ? "All" : initialGuests);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [isLoading, setIsLoading] = useState(false);

  // Sync to context searchParams
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      checkIn,
      checkOut,
      guests: guestFilter === "All" ? 2 : Number(guestFilter),
      category: selectedCategory,
    }));
  }, [checkIn, checkOut, guestFilter, selectedCategory, setSearchParams]);

  const handleCheckAvailability = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  // Check if a room is free for the chosen date range
  const isRoomFree = useCallback(
    (room) => {
      if (room.status !== "available") return false;
      const hasConflict = bookings.some((b) => {
        if (b.status === "cancelled" || b.status === "checked_out") return false;
        if (b.roomId !== room.id && b.roomNumber !== room.roomNumber) return false;
        return b.checkInDate < checkOut && b.checkOutDate > checkIn;
      });
      return !hasConflict;
    },
    [bookings, checkIn, checkOut]
  );

  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        // Category filter
        if (selectedCategory !== "All" && room.category !== selectedCategory) {
          return false;
        }

        // Status filter
        if (statusFilter === "available") {
          if (!isRoomFree(room)) return false;
        } else if (statusFilter !== "All" && room.status !== statusFilter) {
          return false;
        }

        // Guest capacity filter
        if (guestFilter !== "All") {
          const num = Number(guestFilter);
          if (room.maxGuests < num) return false;
        }

        // Search keyword filter
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchNumber = room.roomNumber.toLowerCase().includes(term);
          const matchCat = room.category.toLowerCase().includes(term);
          const matchDesc = room.description?.toLowerCase().includes(term);
          const matchBed = room.bedType?.toLowerCase().includes(term);
          const matchView = room.view?.toLowerCase().includes(term);
          const matchAmenities = room.amenities?.some((a) =>
            a.toLowerCase().includes(term)
          );
          if (!matchNumber && !matchCat && !matchDesc && !matchBed && !matchView && !matchAmenities) {
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
  }, [rooms, selectedCategory, statusFilter, guestFilter, searchTerm, sortBy, isRoomFree]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    setStatusFilter("All");
    setGuestFilter("All");
    setSortBy("price-asc");
  };

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-stone-100/80 to-amber-100/50 text-stone-900 py-12 mb-8 border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold tracking-widest text-amber-800 uppercase">
            Accommodations at {HOTEL_INFO.name}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display-luxury text-stone-900 mt-1">
            Our Rooms & Luxury Suites
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto mt-2">
            Comfortable standard rooms, spacious deluxe suites, and executive accommodations in Itahari-9 with 24/7 power, hot water, and video tours.
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
          guestFilter={guestFilter}
          onGuestChange={setGuestFilter}
          checkIn={checkIn}
          onCheckInChange={setCheckIn}
          checkOut={checkOut}
          onCheckOutChange={setCheckOut}
          onCheckAvailability={handleCheckAvailability}
        />

        {/* Results Counter */}
        <div className="flex flex-wrap items-center justify-between mb-6 text-xs text-stone-600 gap-2">
          <p>
            Showing <strong>{filteredRooms.length}</strong> of <strong>{rooms.length}</strong> rooms at {HOTEL_INFO.name}
          </p>
          {(selectedCategory !== "All" || searchTerm || statusFilter !== "All" || guestFilter !== "All") && (
            <button
              onClick={handleResetFilters}
              className="text-amber-700 font-semibold hover:underline"
            >
              Reset all active filters
            </button>
          )}
        </div>

        {/* Rooms Grid / Loading / Empty State */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-stone-200">
            <Loader text="Checking room availability..." />
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          /* Empty state matching Section 10 & 27 */
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold">!</span>
            </div>
            <h3 className="text-lg font-bold font-display-luxury text-stone-900">
              No rooms are available for the selected dates or filter criteria.
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Please try adjusting your check-in dates, clearing the category filter, or reducing the number of guests.
            </p>
            <div className="pt-2">
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Reset Filters & View All Rooms
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;
