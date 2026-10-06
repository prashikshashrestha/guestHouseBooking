import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Calendar,
  Bed,
  MapPin,
  Phone,
  Printer,
  UtensilsCrossed,
  Home,
  ShieldCheck,
} from "lucide-react";
import Button from "../components/common/Button";
import { useBooking } from "../context/BookingContext";
import { formatDate, formatCurrency } from "../utils/formatDate";
import { HOTEL_INFO } from "../utils/initialData";

export const BookingSuccessPage = () => {
  const [params] = useSearchParams();
  const bookingId = params.get("id");
  const { bookings } = useBooking();

  const booking = bookings.find((b) => b.bookingId === bookingId) || bookings[0];

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Banner */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
              Reservation Confirmed
            </span>
            <h1 className="text-3xl font-bold font-display-luxury text-stone-900 mt-1">
              Thank You, {booking?.guest?.fullName || "Guest"}!
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Your booking has been registered in the Kalika Hotel & Lodge system.
            </p>
          </div>

          {/* Booking Card Voucher */}
          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-200">
              <div>
                <span className="text-[11px] text-stone-500 font-bold uppercase tracking-wider block">
                  Booking Reference ID
                </span>
                <span className="text-lg font-black text-amber-800 tracking-wider">
                  {booking?.bookingId}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {booking?.status?.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-200 text-stone-800">
                  {booking?.bookingType === "offline_walkin" ? "Walk-in" : "Online"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <strong className="text-stone-500 block uppercase">Room Assigned:</strong>
                <span className="text-sm font-bold text-stone-900">
                  Room #{booking?.roomNumber} ({booking?.roomCategory})
                </span>
              </div>
              <div>
                <strong className="text-stone-500 block uppercase">Total Nights:</strong>
                <span className="text-sm font-bold text-stone-900">
                  {booking?.totalNights} Nights
                </span>
              </div>
              <div>
                <strong className="text-stone-500 block uppercase">Check-in:</strong>
                <span className="text-stone-800 font-medium">
                  {formatDate(booking?.checkInDate)} (12:00 PM)
                </span>
              </div>
              <div>
                <strong className="text-stone-500 block uppercase">Check-out:</strong>
                <span className="text-stone-800 font-medium">
                  {formatDate(booking?.checkOutDate)} (11:00 AM)
                </span>
              </div>
              <div>
                <strong className="text-stone-500 block uppercase">Payment Method:</strong>
                <span className="text-stone-800 font-medium capitalize">
                  {booking?.paymentMethod} ({booking?.paymentStatus})
                </span>
              </div>
              <div>
                <strong className="text-stone-500 block uppercase">Total Room Charges:</strong>
                <span className="text-stone-900 font-bold">
                  {formatCurrency(booking?.totalRoomCharge)}
                </span>
              </div>
            </div>

            {/* Hotel Location note */}
            <div className="pt-3 border-t border-stone-200 flex items-start gap-2 text-xs text-stone-600">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                {HOTEL_INFO.name}, {HOTEL_INFO.address}. Front desk assistance: <strong>{HOTEL_INFO.phone}</strong>
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Voucher
            </button>

            <Link to="/dining" className="w-full sm:w-auto">
              <Button variant="gold" size="md" icon={UtensilsCrossed} className="w-full text-xs font-bold">
                Order In-Room Dining
              </Button>
            </Link>

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
