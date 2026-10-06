import React from "react";
import { Calendar, Users } from "lucide-react";

export const DateRangePicker = ({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  guests = 2,
  onGuestsChange,
  nights = 1,
}) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Check In */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          Check-in Date
        </label>
        <input
          type="date"
          min={today}
          value={checkIn}
          onChange={(e) => onCheckInChange(e.target.value)}
          className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-amber-600 font-medium"
        />
      </div>

      {/* Check Out */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          Check-out Date ({nights} {nights === 1 ? "night" : "nights"})
        </label>
        <input
          type="date"
          min={checkIn || today}
          value={checkOut}
          onChange={(e) => onCheckOutChange(e.target.value)}
          className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-amber-600 font-medium"
        />
      </div>

      {/* Guests */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-amber-600" />
          Guests
        </label>
        <select
          value={guests}
          onChange={(e) => onGuestsChange && onGuestsChange(Number(e.target.value))}
          className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-amber-600 font-medium"
        >
          <option value={1}>1 Adult</option>
          <option value={2}>2 Adults</option>
          <option value={3}>3 Guests</option>
          <option value={4}>4 Guests (Family)</option>
        </select>
      </div>
    </div>
  );
};

export default DateRangePicker;
