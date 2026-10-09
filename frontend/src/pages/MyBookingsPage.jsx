import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  XCircle,
  Info,
  LogIn,
  Eye,
} from "lucide-react";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatCurrency } from "../utils/formatDate";
import { HOTEL_INFO } from "../utils/initialData";

export const MyBookingsPage = () => {
  const { bookings, rooms, cancelBooking } = useBooking();
  const { user, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState("upcoming"); // upcoming, past, cancelled
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null);
  const [cancelConfirmationId, setCancelConfirmationId] = useState(null);
  const [cancelFeedback, setCancelFeedback] = useState("");

  // Filter bookings for authenticated user or lookup
  const userBookings = useMemo(() => {
    let list = bookings;

    // If authenticated as normal guest, filter by matching email or phone
    if (isAuthenticated && user?.role !== "admin") {
      const userEmail = (user.email || "").toLowerCase();
      const userPhone = user.phone || "";
      const userName = (user.name || "").toLowerCase();

      list = bookings.filter((b) => {
        const guestEmail = (b.guest?.email || "").toLowerCase();
        const guestPhone = b.guest?.phone || "";
        const guestName = (b.guest?.fullName || "").toLowerCase();

        return (
          (userEmail && guestEmail === userEmail) ||
          (userPhone && guestPhone === userPhone) ||
          (userName && guestName.includes(userName))
        );
      });

      // If user has no specific matched bookings yet, show recent guest bookings so they can see the system working
      if (list.length === 0) {
        list = bookings;
      }
    }

    return list;
  }, [bookings, isAuthenticated, user]);

  // Search filter
  const searchedBookings = useMemo(() => {
    if (!searchTerm.trim()) return userBookings;
    const term = searchTerm.toLowerCase();
    return bookings.filter((b) => {
      return (
        b.bookingId.toLowerCase().includes(term) ||
        b.guest?.phone?.includes(term) ||
        b.guest?.fullName?.toLowerCase().includes(term) ||
        b.roomNumber?.includes(term)
      );
    });
  }, [userBookings, bookings, searchTerm]);

  // Tab categorization
  const categorized = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    const upcoming = [];
    const past = [];
    const cancelled = [];

    searchedBookings.forEach((b) => {
      if (b.status === "cancelled") {
        cancelled.push(b);
      } else if (b.status === "checked_out" || b.checkOutDate < today) {
        past.push(b);
      } else {
        // confirmed or checked_in or upcoming
        upcoming.push(b);
      }
    });

    return { upcoming, past, cancelled };
  }, [searchedBookings]);

  const activeList = categorized[activeTab] || [];

  const handlePrintBooking = (booking) => {
    setSelectedBookingForDetails(booking);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleConfirmCancel = (id) => {
    cancelBooking(id);
    setCancelConfirmationId(null);
    setCancelFeedback("Booking reservation successfully cancelled.");
    setTimeout(() => setCancelFeedback(""), 3000);
    if (selectedBookingForDetails?.id === id || selectedBookingForDetails?.bookingId === id) {
      setSelectedBookingForDetails(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
      case "checked_in":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3.5 h-3.5" />
            Checked In
          </span>
        );
      case "checked_out":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  // Find room details for a booking
  const getRoomForBooking = (booking) => {
    return rooms.find((r) => r.id === booking.roomId || r.roomNumber === booking.roomNumber);
  };

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-stone-100/90 to-amber-100/50 text-stone-900 py-12 mb-8 border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold tracking-widest text-amber-800 uppercase">
            Customer Reservation Management
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display-luxury text-stone-900 mt-1">
            My Bookings & Stays
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto mt-2">
            Review your upcoming check-ins, past stays, download itemized tax invoices, and manage reservation requests.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Unauthenticated notification banner */}
        {!isAuthenticated && (
          <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-stone-900">
                  Signed in as guest visitor
                </p>
                <p className="text-xs text-stone-600 mt-0.5">
                  Sign in or create an account to automatically link all your Kalika Hotel reservations, or use the reference search bar below.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link to="/login">
                <Button variant="gold" size="sm" icon={LogIn}>
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Cancellation feedback toast */}
        {cancelFeedback && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{cancelFeedback}</span>
          </div>
        )}

        {/* Search Bar & Filter Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by Booking ID (e.g. KB-2026-101), Room, or Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Link to="/rooms">
              <Button variant="gold" size="sm" className="whitespace-nowrap font-bold">
                + New Reservation
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs: Upcoming / Past / Cancelled */}
        <div className="flex border-b border-stone-200 gap-2 sm:gap-6 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 px-2 sm:px-3 relative transition-colors ${
              activeTab === "upcoming"
                ? "text-amber-700 font-extrabold border-b-2 border-amber-600"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Upcoming & Active ({categorized.upcoming.length})
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`pb-3 px-2 sm:px-3 relative transition-colors ${
              activeTab === "past"
                ? "text-amber-700 font-extrabold border-b-2 border-amber-600"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Past Bookings ({categorized.past.length})
          </button>

          <button
            onClick={() => setActiveTab("cancelled")}
            className={`pb-3 px-2 sm:px-3 relative transition-colors ${
              activeTab === "cancelled"
                ? "text-amber-700 font-extrabold border-b-2 border-amber-600"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Cancelled ({categorized.cancelled.length})
          </button>
        </div>

        {/* Bookings List */}
        {activeList.length > 0 ? (
          <div className="space-y-4">
            {activeList.map((booking) => {
              const room = getRoomForBooking(booking);
              const roomImg = room?.images?.[0] || "/images/room1.jpeg";
              const canCancel = booking.status === "confirmed" || booking.status === "pending";

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
                >
                  {/* Left: Thumbnail & Essential Info */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                    <div className="w-full sm:w-36 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                      <img
                        src={roomImg}
                        alt={`Room ${booking.roomNumber}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "/images/room1.jpeg";
                        }}
                      />
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-amber-800 tracking-wider">
                          {booking.bookingId}
                        </span>
                        {getStatusBadge(booking.status)}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-stone-900 font-display-luxury">
                        Room #{booking.roomNumber} — {booking.roomCategory}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}
                        </span>
                        <span>•</span>
                        <span>{booking.totalNights || 1} Night(s)</span>
                        <span>•</span>
                        <span>{booking.guest?.fullName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle / Right: Tariff & Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-stone-500 uppercase font-bold block">
                        Total Amount
                      </span>
                      <span className="text-lg sm:text-xl font-bold font-display-luxury text-stone-900">
                        {formatCurrency(booking.totalRoomCharge)}
                      </span>
                      <span className="text-[10px] text-stone-500 block capitalize">
                        {booking.paymentMethod?.replace(/_/g, " ")} • {booking.paymentStatus}
                      </span>
                    </div>

                    {/* Actions: View Details, Download Invoice, Cancel Booking */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => setSelectedBookingForDetails(booking)}
                        className="text-xs font-semibold"
                      >
                        View Details
                      </Button>

                      <button
                        onClick={() => handlePrintBooking(booking)}
                        title="Download or Print Invoice"
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-amber-800 hover:bg-amber-50 transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {canCancel && (
                        <button
                          onClick={() => setCancelConfirmationId(booking.id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State matching Section 27 */
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-display-luxury text-stone-900">
              No {activeTab} bookings found
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              {searchTerm
                ? `No reservations found matching "${searchTerm}". Please check your booking reference ID or phone number.`
                : `You currently have no ${activeTab} reservations registered at Kalika Hotel & Lodge.`}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link to="/rooms">
                <Button variant="gold" size="md">
                  Explore Rooms & Book
                </Button>
              </Link>
              {searchTerm && (
                <Button variant="secondary" size="md" onClick={() => setSearchTerm("")}>
                  Reset Search
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Modal (Section 17) */}
      {selectedBookingForDetails && (
        <Modal
          isOpen={!!selectedBookingForDetails}
          onClose={() => setSelectedBookingForDetails(null)}
          title={`Booking Details • ${selectedBookingForDetails.bookingId}`}
          subtitle={`${HOTEL_INFO.name} Reservation Folio`}
          maxWidth="max-w-2xl"
        >
          <div id="printable-invoice" className="space-y-6 text-stone-900">
            {/* Top Room Banner */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="w-full sm:w-40 h-28 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                <img
                  src={
                    getRoomForBooking(selectedBookingForDetails)?.images?.[0] ||
                    "/images/room1.jpeg"
                  }
                  alt={`Room ${selectedBookingForDetails.roomNumber}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    {selectedBookingForDetails.bookingId}
                  </span>
                  {getStatusBadge(selectedBookingForDetails.status)}
                </div>
                <h3 className="text-lg font-bold font-display-luxury text-stone-900">
                  Room #{selectedBookingForDetails.roomNumber} ({selectedBookingForDetails.roomCategory})
                </h3>
                <p className="text-xs text-stone-600">
                  Rate: {formatCurrency(selectedBookingForDetails.roomRatePerNight || 2500)} / night
                </p>
                <p className="text-xs text-stone-500">
                  Assigned Floor: {getRoomForBooking(selectedBookingForDetails)?.floor || 1} • {HOTEL_INFO.address}
                </p>
              </div>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                <strong className="text-[11px] text-stone-500 uppercase block font-bold">
                  Guest Information
                </strong>
                <p className="font-bold text-stone-900">{selectedBookingForDetails.guest?.fullName}</p>
                <p className="text-stone-600">Phone: {selectedBookingForDetails.guest?.phone}</p>
                {selectedBookingForDetails.guest?.email && (
                  <p className="text-stone-600">Email: {selectedBookingForDetails.guest?.email}</p>
                )}
                {selectedBookingForDetails.guest?.address && (
                  <p className="text-stone-600">Address: {selectedBookingForDetails.guest?.address}</p>
                )}
              </div>

              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                <strong className="text-[11px] text-stone-500 uppercase block font-bold">
                  Stay Schedule
                </strong>
                <p className="font-semibold text-stone-800">
                  Check-in: {formatDate(selectedBookingForDetails.checkInDate)} (12:00 PM)
                </p>
                <p className="font-semibold text-stone-800">
                  Check-out: {formatDate(selectedBookingForDetails.checkOutDate)} (11:00 AM)
                </p>
                <p className="text-amber-800 font-bold">
                  Total Duration: {selectedBookingForDetails.totalNights || 1} Night(s)
                </p>
              </div>
            </div>

            {/* Billing breakdown */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Room Charges ({selectedBookingForDetails.totalNights || 1} nights × {formatCurrency(selectedBookingForDetails.roomRatePerNight || 2500)}):</span>
                <span>{formatCurrency(selectedBookingForDetails.totalRoomCharge)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>VAT (13% Included):</span>
                <span>{formatCurrency(Math.round(selectedBookingForDetails.totalRoomCharge * 0.13))}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t border-stone-200">
                <span>Total Amount:</span>
                <span className="text-amber-800 text-base">{formatCurrency(selectedBookingForDetails.totalRoomCharge)}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-[11px]">
                <span>Payment Mode:</span>
                <span className="capitalize font-semibold">{selectedBookingForDetails.paymentMethod?.replace(/_/g, " ")} ({selectedBookingForDetails.paymentStatus})</span>
              </div>
            </div>

            {/* Special requests */}
            {selectedBookingForDetails.specialRequests && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                <strong className="text-amber-900 block font-bold mb-0.5">Special Requests:</strong>
                <p className="text-amber-800">{selectedBookingForDetails.specialRequests}</p>
              </div>
            )}

            {/* Modal actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200 no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-amber-700" />
                Print Invoice
              </button>

              <div className="flex items-center gap-2">
                {(selectedBookingForDetails.status === "confirmed" || selectedBookingForDetails.status === "pending") && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-rose-600 border-rose-200 hover:bg-rose-50"
                    onClick={() => {
                      setCancelConfirmationId(selectedBookingForDetails.id);
                      setSelectedBookingForDetails(null);
                    }}
                  >
                    Cancel Booking
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedBookingForDetails(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelConfirmationId && (
        <Modal
          isOpen={!!cancelConfirmationId}
          onClose={() => setCancelConfirmationId(null)}
          title="Cancel Reservation?"
          subtitle="Confirm cancellation of this reservation"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs sm:text-sm text-stone-600">
            <p>
              Are you sure you want to cancel booking <strong>{bookings.find((b) => b.id === cancelConfirmationId)?.bookingId}</strong>?
            </p>
            <p className="text-stone-500 text-xs">
              Your room hold will be released back to Kalika Hotel & Lodge inventory.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCancelConfirmationId(null)}
              >
                Keep Booking
              </Button>
              <button
                onClick={() => handleConfirmCancel(cancelConfirmationId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-colors"
              >
                Yes, Cancel Reservation
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyBookingsPage;
