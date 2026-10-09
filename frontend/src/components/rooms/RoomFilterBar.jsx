import React from "react";
import { Filter, Search, SlidersHorizontal, Sparkles, Calendar, Users } from "lucide-react";
import { useBooking } from "../../context/BookingContext";

export const RoomFilterBar = ({
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  guestFilter,
  onGuestChange,
  checkIn,
  onCheckInChange,
  checkOut,
  onCheckOutChange,
  onCheckAvailability,
}) => {
  const { categories } = useBooking();

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-stone-200/90 mb-8 space-y-4">
      {/* Date & Guest Availability Quick Bar */}
      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs flex-1">
          <div className="flex items-center gap-1.5 font-bold text-stone-700">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Stay Dates:</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={checkIn}
              onChange={(e) => onCheckInChange(e.target.value)}
              className="bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-600"
            />
            <span className="text-stone-400 font-bold">to</span>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => onCheckOutChange(e.target.value)}
              className="bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={guestFilter}
              onChange={(e) => onGuestChange(e.target.value)}
              className="bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-600"
            >
              <option value="All">All Guests</option>
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3+ Guests</option>
            </select>
          </div>
        </div>

        {onCheckAvailability && (
          <button
            type="button"
            onClick={onCheckAvailability}
            className="px-4 py-2 bg-stone-900 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            Check Availability
          </button>
        )}
      </div>

      {/* Top search & sorting */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search room, amenities, bed type..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
          />
        </div>

        {/* Sort & Status options */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 focus:outline-none focus:border-amber-600"
          >
            <option value="All">All Statuses</option>
            <option value="available">Available Only</option>
            <option value="occupied">Occupied</option>
            <option value="cleaning">In Cleaning</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 focus:outline-none focus:border-amber-600"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="room-asc">Room Number</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-stone-100">
        <button
          onClick={() => onSelectCategory("All")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === "All"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
          }`}
        >
          All Rooms
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.name)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.name
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
            }`}
          >
            {cat.name} (Rs. {cat.basePrice.toLocaleString()})
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoomFilterBar;
