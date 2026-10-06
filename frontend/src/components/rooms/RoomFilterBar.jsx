import React from "react";
import { Filter, Search, SlidersHorizontal, Sparkles } from "lucide-react";
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
}) => {
  const { categories } = useBooking();

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-stone-200/90 mb-8 space-y-4">
      {/* Top search & sorting */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search room number, amenities..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
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

      {/* Category Pills (Feature 1: Room Category setting) */}
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
