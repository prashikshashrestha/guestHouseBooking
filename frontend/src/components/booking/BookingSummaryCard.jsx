import React from "react";
import { Bed, Calendar, ShieldCheck, MapPin, CheckCircle } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatDate";
import { HOTEL_INFO } from "../../utils/initialData";

export const BookingSummaryCard = ({
  room,
  checkIn,
  checkOut,
  nights,
  advancePaid = 0,
}) => {
  if (!room) return null;

  const roomTotal = room.pricePerNight * nights;
  const vatAmount = Math.round((roomTotal * HOTEL_INFO.vatRate) / 100);
  const grandTotal = roomTotal + vatAmount;
  const balanceDue = Math.max(0, grandTotal - advancePaid);

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
      <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center justify-between">
        <span>Reservation Summary</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
          Room #{room.roomNumber}
        </span>
      </h3>

      {/* Room preview mini */}
      <div className="flex gap-3">
        <img
          src={room.images?.[0] || "/images/room1.jpeg"}
          alt={room.category}
          className="w-20 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
        />
        <div>
          <h4 className="text-sm font-bold text-stone-900">{room.category}</h4>
          <p className="text-xs text-stone-500 mt-0.5">{room.bedType} • {room.view}</p>
          <p className="text-xs text-amber-700 font-semibold mt-1">
            {formatCurrency(room.pricePerNight)} / night
          </p>
        </div>
      </div>

      {/* Stay details */}
      <div className="bg-stone-50 rounded-xl p-3 space-y-2 text-xs text-stone-600">
        <div className="flex justify-between">
          <span className="text-stone-500">Check-in:</span>
          <span className="font-semibold text-stone-800">{formatDate(checkIn)} ({HOTEL_INFO.checkInTime})</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Check-out:</span>
          <span className="font-semibold text-stone-800">{formatDate(checkOut)} ({HOTEL_INFO.checkOutTime})</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Duration:</span>
          <span className="font-semibold text-stone-800">{nights} {nights === 1 ? "Night" : "Nights"}</span>
        </div>
      </div>

      {/* Cost calculation */}
      <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
        <div className="flex justify-between">
          <span>Room Charges ({nights} nights × {formatCurrency(room.pricePerNight)}):</span>
          <span className="font-medium text-stone-900">{formatCurrency(roomTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>VAT ({HOTEL_INFO.vatRate}% standard):</span>
          <span className="font-medium text-stone-900">{formatCurrency(vatAmount)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-stone-900 border-t border-stone-200 pt-2">
          <span>Estimated Total:</span>
          <span className="text-amber-700">{formatCurrency(grandTotal)}</span>
        </div>

        {advancePaid > 0 && (
          <div className="flex justify-between text-xs text-emerald-600 font-medium pt-1">
            <span>Advance Paid Now:</span>
            <span>- {formatCurrency(advancePaid)}</span>
          </div>
        )}

        <div className="flex justify-between text-xs text-stone-500 pt-1">
          <span>Balance due at check-in:</span>
          <span className="font-semibold text-stone-800">{formatCurrency(balanceDue)}</span>
        </div>
      </div>

      {/* Perks note */}
      <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          Instant confirmation. Free cancellation up to 24 hours prior to check-in. Located next to Itahari Buspark.
        </p>
      </div>
    </div>
  );
};

export default BookingSummaryCard;
