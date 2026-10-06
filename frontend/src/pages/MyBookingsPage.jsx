import React, { useState } from "react";
import { Search, Calendar, Bed, Phone, User, CheckCircle2, Clock } from "lucide-react";
import Button from "../components/common/Button";
import { useBooking } from "../context/BookingContext";
import { formatDate, formatCurrency } from "../utils/formatDate";

export const MyBookingsPage = () => {
  const { bookings, orders } = useBooking();
  const [searchTerm, setSearchTerm] = useState("");
  const [searched, setSearched] = useState(false);

  const matchedBookings = bookings.filter((b) => {
    if (!searchTerm.trim()) return false;
    const term = searchTerm.toLowerCase();
    return (
      b.bookingId.toLowerCase().includes(term) ||
      b.guest.phone.includes(term) ||
      b.guest.fullName.toLowerCase().includes(term) ||
      b.roomNumber.includes(term)
    );
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
            Guest Self-Service
          </span>
          <h1 className="text-3xl font-bold font-display-luxury text-stone-900 mt-1">
            Lookup Your Reservation
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Enter your Booking Reference ID (e.g. KB-2026-101) or phone number to check status.
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by Booking ID (e.g. KB-2026-101) or Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white"
            />
          </div>
          <Button type="submit" variant="primary" size="md">
            Find Booking
          </Button>
        </form>

        {/* Results */}
        {searched && (
          <div className="space-y-6">
            {matchedBookings.length > 0 ? (
              matchedBookings.map((b) => {
                const roomOrders = orders.filter(
                  (o) => o.bookingId === b.bookingId || o.roomNumber === b.roomNumber
                );
                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                      <div>
                        <span className="text-xs font-bold text-amber-800 tracking-wider">
                          {b.bookingId}
                        </span>
                        <h3 className="text-base font-bold text-stone-900">
                          Room #{b.roomNumber} - {b.roomCategory}
                        </h3>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 self-start">
                        Status: {b.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-stone-600">
                      <div>
                        <strong className="text-stone-400 block uppercase">Guest:</strong>
                        <span>{b.guest.fullName}</span>
                      </div>
                      <div>
                        <strong className="text-stone-400 block uppercase">Dates:</strong>
                        <span>
                          {formatDate(b.checkInDate)} - {formatDate(b.checkOutDate)}
                        </span>
                      </div>
                      <div>
                        <strong className="text-stone-400 block uppercase">Total Nights:</strong>
                        <span>{b.totalNights} nights</span>
                      </div>
                      <div>
                        <strong className="text-stone-400 block uppercase">Room Charges:</strong>
                        <span className="font-bold text-stone-900">
                          {formatCurrency(b.totalRoomCharge)}
                        </span>
                      </div>
                    </div>

                    {/* Associated In-Room Orders */}
                    {roomOrders.length > 0 && (
                      <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 text-xs">
                        <strong className="text-stone-700 block mb-1">
                          In-Room Dining Orders ({roomOrders.length}):
                        </strong>
                        <ul className="space-y-1 text-stone-600">
                          {roomOrders.map((ord) => (
                            <li key={ord.id} className="flex justify-between">
                              <span>
                                {ord.orderNumber} ({ord.status}):{" "}
                                {ord.items.map((i) => i.name).join(", ")}
                              </span>
                              <span className="font-semibold text-amber-800">
                                {formatCurrency(ord.totalAmount)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center border border-stone-200">
                <p className="text-sm font-bold text-stone-700">
                  No reservations found matching "{searchTerm}".
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Please verify your booking reference ID or contact front desk.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
