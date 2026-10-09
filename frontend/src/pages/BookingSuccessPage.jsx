import React from "react";
import { useSearchParams, useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  MapPin,
  Printer,
  Home,
} from "lucide-react";
import Button from "../components/common/Button";
import { useBooking } from "../context/BookingContext";
import { formatDate, formatCurrency } from "../utils/formatDate";
import { HOTEL_INFO } from "../utils/initialData";

export const BookingSuccessPage = () => {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const bookingId = paramId || searchParams.get("id");
  const { bookings } = useBooking();

  const booking = bookings.find((b) => b.bookingId === bookingId || b.id === bookingId) || bookings[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-90 duration-300">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
              ✓ Booking Confirmed
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold font-display-luxury text-stone-900 mt-1">
              Thank You for Choosing {HOTEL_INFO.name}!
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg mx-auto">
              Your reservation has been secured in the system. A confirmation has been registered for your stay.
            </p>
          </div>

          {/* Booking Card Voucher / Printable Area */}
          <div
            id="printable-invoice"
            className="bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200 text-left space-y-6"
          >
            {/* Header info for printable invoice */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-200">
              <div>
                <span className="text-[11px] text-stone-500 font-bold uppercase tracking-wider block">
                  Booking Reference ID
                </span>
                <span className="text-xl font-black text-amber-800 tracking-wider">
                  {booking?.bookingId}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {booking?.status || "CONFIRMED"}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-200 text-stone-800">
                  {booking?.bookingType === "offline_walkin" ? "Front Desk Walk-in" : "Online Reservation"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-3 bg-white rounded-xl border border-stone-200/80">
                <strong className="text-[11px] text-stone-500 block uppercase font-bold">Room Assigned</strong>
                <span className="text-sm sm:text-base font-bold text-stone-900 mt-0.5 block">
                  Room #{booking?.roomNumber}
                </span>
                <span className="text-xs text-amber-800 font-medium">{booking?.roomCategory}</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-stone-200/80">
                <strong className="text-[11px] text-stone-500 block uppercase font-bold">Primary Guest</strong>
                <span className="text-sm sm:text-base font-bold text-stone-900 mt-0.5 block">
                  {booking?.guest?.fullName || "Valued Guest"}
                </span>
                <span className="text-xs text-stone-500">{booking?.guest?.phone}</span>
              </div>

              <div>
                <strong className="text-[11px] text-stone-500 block uppercase font-bold">Check-in Date:</strong>
                <span className="text-stone-900 font-semibold">
                  {formatDate(booking?.checkInDate)} (12:00 PM onwards)
                </span>
              </div>

              <div>
                <strong className="text-[11px] text-stone-500 block uppercase font-bold">Check-out Date:</strong>
                <span className="text-stone-900 font-semibold">
                  {formatDate(booking?.checkOutDate)} (By 11:00 AM)
                </span>
              </div>

              <div>
                <strong className="text-[11px] text-stone-500 block uppercase font-bold">Length of Stay:</strong>
                <span className="text-stone-900 font-semibold">
                  {booking?.totalNights || 1} Night(s)
                </span>
              </div>

              <div>
                <strong className="text-[11px] text-stone-500 block uppercase font-bold">Payment Method & Status:</strong>
                <span className="text-stone-900 font-semibold capitalize">
                  {booking?.paymentMethod?.replace(/_/g, " ")} ({booking?.paymentStatus})
                </span>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <strong className="text-[11px] text-stone-500 block uppercase font-bold">Total Tariff (incl. 13% VAT):</strong>
                  <span className="text-lg font-black text-amber-800 font-display-luxury">
                    {formatCurrency(booking?.totalRoomCharge)}
                  </span>
                </div>
                {booking?.advancePaid > 0 && (
                  <div className="text-right">
                    <strong className="text-[11px] text-stone-500 block uppercase font-bold">Advance Received:</strong>
                    <span className="text-sm font-bold text-emerald-700">
                      {formatCurrency(booking?.advancePaid)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Hotel Location note */}
            <div className="pt-3 border-t border-stone-200 flex items-start gap-2.5 text-xs text-stone-600">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>{HOTEL_INFO.name}</strong>, {HOTEL_INFO.address}. Front desk direct helpline: <strong>{HOTEL_INFO.phone}</strong>
              </span>
            </div>
          </div>

          {/* Action buttons matching Section 15 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/my-bookings" className="w-full sm:w-auto">
              <Button variant="gold" size="md" className="w-full text-xs font-bold uppercase tracking-wider">
                View My Bookings
              </Button>
            </Link>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4 text-amber-700" />
              Download / Print Invoice
            </button>

            <Link to="/" className="w-full sm:w-auto">
              <Button variant="secondary" size="md" icon={Home} className="w-full text-xs font-bold">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
