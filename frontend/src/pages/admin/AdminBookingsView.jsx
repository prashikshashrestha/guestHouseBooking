import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CalendarCheck,
  Search,
  Filter,
  PlusCircle,
  Eye,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  Receipt,
  Printer,
  AlertTriangle,
  Clock,
  Phone,
  Mail,
  User,
  BedDouble,
  DollarSign,
  UtensilsCrossed,
} from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { formatCurrency, formatDate, formatDateTime } from "../../utils/formatDate";

export const AdminBookingsView = () => {
  const {
    hotelInfo,
    bookings,
    rooms,
    categories,
    orders,
    confirmBooking,
    checkInGuest,
    cancelBooking,
    updateBookingStatus,
    updateBookingPaymentStatus,
    calculateCheckoutFolio,
    finalizeCheckout,
    createBooking,
  } = useBooking();

  const [searchParams] = useSearchParams();

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | pending | confirmed | checked_in | checked_out | cancelled
  const [paymentFilter, setPaymentFilter] = useState("all"); // all | paid | partially_paid | pending

  // Modals state
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null);
  const [selectedBookingForCheckout, setSelectedBookingForCheckout] = useState(null);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [selectedBillForPrint, setSelectedBillForPrint] = useState(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  // New Walk-in Booking Form State
  const [newBookingForm, setNewBookingForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    idCardNumber: "",
    address: "",
    roomNumber: rooms[0]?.roomNumber || "101",
    checkInDate: new Date().toISOString().split("T")[0],
    checkOutDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    advancePaid: 0,
    paymentMethod: "cash",
    autoCheckIn: true,
    specialRequests: "",
  });

  // Checkout Folio Form State
  const [checkoutFolioForm, setCheckoutFolioForm] = useState({
    extraCharges: 0,
    extraChargesDescription: "",
    discount: 0,
    paymentMethod: "cash",
    amountPaidAtCheckout: "",
    notes: "Settled at front desk.",
  });

  // Read URL query parameter for search
  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search match
      const query = searchTerm.toLowerCase().trim();
      const matchSearch =
        !query ||
        b.bookingId?.toLowerCase().includes(query) ||
        b.guest?.fullName?.toLowerCase().includes(query) ||
        b.guest?.phone?.includes(query) ||
        b.roomNumber?.toString().includes(query);

      // Status match
      const matchStatus =
        statusFilter === "all" || b.status === statusFilter;

      // Payment match
      const matchPayment =
        paymentFilter === "all" || b.paymentStatus === paymentFilter;

      return matchSearch && matchStatus && matchPayment;
    });
  }, [bookings, searchTerm, statusFilter, paymentFilter]);

  // Status Badge Helper
  const getStatusBadge = (status) => {
    const map = {
      pending: { bg: "bg-orange-100 text-orange-800 border-orange-200", label: "Pending" },
      confirmed: { bg: "bg-emerald-100 text-emerald-800 border-emerald-200", label: "Confirmed" },
      checked_in: { bg: "bg-amber-100 text-amber-900 border-amber-300 font-bold", label: "In-House (Checked In)" },
      checked_out: { bg: "bg-blue-100 text-blue-800 border-blue-200", label: "Checked Out" },
      cancelled: { bg: "bg-rose-100 text-rose-800 border-rose-200", label: "Cancelled" },
    };
    const s = map[status] || { bg: "bg-stone-100 text-stone-700", label: status };
    return (
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${s.bg}`}>
        {s.label}
      </span>
    );
  };

  // Payment Badge Helper
  const getPaymentBadge = (status) => {
    const map = {
      paid: { bg: "text-emerald-700 bg-emerald-50 border-emerald-200", label: "Paid" },
      partially_paid: { bg: "text-amber-800 bg-amber-50 border-amber-200", label: "Partial" },
      pending: { bg: "text-rose-700 bg-rose-50 border-rose-200", label: "Unpaid / Due" },
    };
    const p = map[status] || { bg: "text-stone-700 bg-stone-50 border-stone-200", label: status };
    return (
      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold border ${p.bg}`}>
        {p.label}
      </span>
    );
  };

  // Handle Create Walk-in Booking
  const handleCreateWalkIn = (e) => {
    e.preventDefault();
    if (!newBookingForm.fullName || !newBookingForm.phone) {
      alert("Please enter guest name and phone number.");
      return;
    }

    const selectedRoom = rooms.find((r) => r.roomNumber === newBookingForm.roomNumber);

    createBooking({
      bookingType: "offline_walkin",
      roomId: selectedRoom?.id,
      roomNumber: newBookingForm.roomNumber,
      roomCategory: selectedRoom?.category || "Standard Room",
      checkInDate: newBookingForm.checkInDate,
      checkOutDate: newBookingForm.checkOutDate,
      autoCheckIn: newBookingForm.autoCheckIn,
      advancePaid: Number(newBookingForm.advancePaid) || 0,
      paymentMethod: newBookingForm.paymentMethod,
      guest: {
        fullName: newBookingForm.fullName,
        phone: newBookingForm.phone,
        email: newBookingForm.email,
        idCardNumber: newBookingForm.idCardNumber,
        address: newBookingForm.address,
      },
      specialRequests: newBookingForm.specialRequests,
    });

    setIsNewBookingModalOpen(false);
    setNewBookingForm({
      fullName: "",
      phone: "",
      email: "",
      idCardNumber: "",
      address: "",
      roomNumber: rooms[0]?.roomNumber || "101",
      checkInDate: new Date().toISOString().split("T")[0],
      checkOutDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      advancePaid: 0,
      paymentMethod: "cash",
      autoCheckIn: true,
      specialRequests: "",
    });
  };

  // Open Folio Checkout
  const handleOpenCheckout = (booking) => {
    setSelectedBookingForCheckout(booking);
    const folio = calculateCheckoutFolio(booking);
    setCheckoutFolioForm({
      extraCharges: 0,
      extraChargesDescription: "",
      discount: 0,
      paymentMethod: "cash",
      amountPaidAtCheckout: folio ? folio.balanceDue : 0,
      notes: "Settled at front desk.",
    });
  };

  // Submit Folio Checkout
  const handleSubmitCheckout = () => {
    if (!selectedBookingForCheckout) return;

    const newBill = finalizeCheckout({
      bookingId: selectedBookingForCheckout.bookingId,
      extraCharges: Number(checkoutFolioForm.extraCharges) || 0,
      extraChargesDescription: checkoutFolioForm.extraChargesDescription,
      discount: Number(checkoutFolioForm.discount) || 0,
      paymentMethod: checkoutFolioForm.paymentMethod,
      amountPaidAtCheckout: Number(checkoutFolioForm.amountPaidAtCheckout),
      notes: checkoutFolioForm.notes,
    });

    setSelectedBookingForCheckout(null);
    if (newBill) {
      setSelectedBillForPrint(newBill);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER & SEARCH TOOLBAR ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <CalendarCheck size={22} className="text-amber-600" />
            <span>Reservation & Booking Management</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            View, confirm, check-in, settle folios, and print invoices for all guest bookings.
          </p>
        </div>

        <button
          onClick={() => setIsNewBookingModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0c2317] hover:bg-[#143825] text-amber-300 font-bold text-xs flex items-center gap-2 transition-all shadow-md self-start md:self-auto cursor-pointer"
        >
          <PlusCircle size={16} className="text-amber-400" />
          <span>New Walk-in Booking</span>
        </button>
      </div>

      {/* ================= FILTERS & SEARCH ROW ================= */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by ID, guest name, phone, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0c2317]/20 focus:border-[#0c2317] transition-all text-xs"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl border border-stone-200 bg-stone-50 font-semibold text-stone-800 focus:outline-none focus:border-[#0c2317]"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl border border-stone-200 bg-stone-50 font-semibold text-stone-800 focus:outline-none focus:border-[#0c2317]"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="pending">Unpaid / Due</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== "all" || paymentFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPaymentFilter("all");
              }}
              className="px-2.5 py-1.5 text-stone-500 hover:text-stone-900 underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ================= BOOKINGS TABLE ================= */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 sm:px-6">Booking Reference</th>
                <th className="py-3.5 px-4">Guest Details</th>
                <th className="py-3.5 px-4">Room</th>
                <th className="py-3.5 px-4">Dates</th>
                <th className="py-3.5 px-4">Nights</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right sm:pr-6">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-stone-500">
                    <CalendarCheck size={36} className="mx-auto text-stone-300 mb-2" />
                    <p className="font-semibold text-stone-700">No matching reservations found.</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Try adjusting your search criteria or create a new booking.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-mono font-bold text-stone-900">
                        {b.bookingId}
                      </div>
                      <span className="text-[10px] text-stone-400 block capitalize">
                        {b.bookingType?.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-900 block truncate max-w-[150px]">
                        {b.guest?.fullName || "Guest"}
                      </span>
                      <span className="text-[11px] text-stone-500 block truncate max-w-[150px]">
                        {b.guest?.phone}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900">Room #{b.roomNumber}</span>
                      <span className="text-[10px] text-stone-500 block">{b.roomCategory}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-stone-800 block">
                        {formatDate(b.checkInDate)}
                      </span>
                      <span className="text-[11px] text-stone-400 block">
                        to {formatDate(b.checkOutDate)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-stone-700">
                      {b.totalNights} night(s)
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 block">
                        {formatCurrency(b.totalRoomCharge)}
                      </span>
                      {b.advancePaid > 0 && (
                        <span className="text-[10px] text-emerald-700 block">
                          Adv: {formatCurrency(b.advancePaid)}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {getPaymentBadge(b.paymentStatus)}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(b.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right sm:pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details */}
                        <button
                          onClick={() => setSelectedBookingForDetails(b)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                          title="View Complete Booking Details"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Action: Confirm (if pending) */}
                        {b.status === "pending" && (
                          <button
                            onClick={() => confirmBooking(b.id)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Confirm Booking"
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}

                        {/* Action: Check-in (if confirmed) */}
                        {b.status === "confirmed" && (
                          <button
                            onClick={() => checkInGuest(b.id)}
                            className="px-2 py-1 text-[11px] font-semibold bg-emerald-700 text-white hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                            title="Check-in Guest into Room"
                          >
                            <LogIn size={13} />
                            <span>Check-in</span>
                          </button>
                        )}

                        {/* Action: Settle Folio & Check-out (if checked_in) */}
                        {b.status === "checked_in" && (
                          <button
                            onClick={() => handleOpenCheckout(b)}
                            className="px-2 py-1 text-[11px] font-semibold bg-amber-600 text-white hover:bg-amber-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                            title="Settle Folio Bill and Check-out"
                          >
                            <Receipt size={13} />
                            <span>Folio Checkout</span>
                          </button>
                        )}

                        {/* Action: Cancel (if not yet checked out or already cancelled) */}
                        {b.status !== "checked_out" && b.status !== "cancelled" && (
                          <button
                            onClick={() => setSelectedBookingForCancel(b)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Cancel Reservation"
                          >
                            <XCircle size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= NEW WALK-IN BOOKING MODAL ================= */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                  Front Desk Desk Walk-in
                </span>
                <h3 className="text-lg font-bold text-stone-900">Register New Guest Booking</h3>
              </div>
              <button
                onClick={() => setIsNewBookingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Karki"
                    value={newBookingForm.fullName}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="98XXXXXXXX"
                    value={newBookingForm.phone}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={newBookingForm.email}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Citizenship / ID Card No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12-01-76-00431"
                    value={newBookingForm.idCardNumber}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, idCardNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Permanent Address / City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Biratnagar, Morang"
                    value={newBookingForm.address}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, address: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Select Room *
                  </label>
                  <select
                    value={newBookingForm.roomNumber}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, roomNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-semibold focus:outline-none focus:border-[#0c2317]"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.roomNumber}>
                        Room #{r.roomNumber} — {r.category} ({formatCurrency(r.pricePerNight)}/nt) [{r.status}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Advance Payment (NPR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newBookingForm.advancePaid}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, advancePaid: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newBookingForm.checkInDate}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, checkInDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newBookingForm.checkOutDate}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, checkOutDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={newBookingForm.paymentMethod}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, paymentMethod: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#0c2317]"
                  >
                    <option value="cash">Cash at Front Desk</option>
                    <option value="esewa">eSewa QR</option>
                    <option value="khalti">Khalti</option>
                    <option value="bank_transfer">Bank Transfer / Card</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="autoCheckIn"
                    checked={newBookingForm.autoCheckIn}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, autoCheckIn: e.target.checked })
                    }
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <label htmlFor="autoCheckIn" className="font-semibold text-stone-800">
                    Immediately Check-in Guest (Hand key now)
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Special Requests / Luggage Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Extra blanket, early departure tomorrow..."
                    value={newBookingForm.specialRequests}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, specialRequests: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#0c2317] text-amber-300 hover:bg-[#153a26] rounded-xl shadow-md cursor-pointer"
                >
                  Confirm & Create Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= BOOKING DETAILS MODAL ================= */}
      {selectedBookingForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                  Reservation Dossier
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  {selectedBookingForDetails.bookingId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForDetails(null)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Guest Profile Card */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-1.5 text-xs">
                  <User size={14} className="text-amber-800" />
                  <span>Guest Identification & Contact</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-stone-500 block">Full Name:</span>
                    <span className="font-bold text-stone-900">{selectedBookingForDetails.guest?.fullName}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Phone:</span>
                    <span className="font-bold text-stone-900">{selectedBookingForDetails.guest?.phone}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Email:</span>
                    <span className="font-semibold text-stone-800">{selectedBookingForDetails.guest?.email || "—"}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Citizenship / ID:</span>
                    <span className="font-semibold text-stone-800">{selectedBookingForDetails.guest?.idCardNumber || "—"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-500 block">Address:</span>
                    <span className="font-semibold text-stone-800">{selectedBookingForDetails.guest?.address || "Nepal"}</span>
                  </div>
                </div>
              </div>

              {/* Room & Stay Details */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-1.5 text-xs">
                  <BedDouble size={14} className="text-amber-800" />
                  <span>Stay & Room Allocation</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-stone-500 block">Allocated Room:</span>
                    <span className="font-bold text-stone-900">
                      Room #{selectedBookingForDetails.roomNumber} ({selectedBookingForDetails.roomCategory})
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Rate per Night:</span>
                    <span className="font-bold text-stone-900">{formatCurrency(selectedBookingForDetails.roomRatePerNight)}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Check-in:</span>
                    <span className="font-bold text-stone-900">{formatDate(selectedBookingForDetails.checkInDate)}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Check-out:</span>
                    <span className="font-bold text-stone-900">{formatDate(selectedBookingForDetails.checkOutDate)}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Total Stay Duration:</span>
                    <span className="font-bold text-stone-900">{selectedBookingForDetails.totalNights} Night(s)</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Current Status:</span>
                    <div>{getStatusBadge(selectedBookingForDetails.status)}</div>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/70">
                <h4 className="font-bold text-amber-950 mb-2 flex items-center gap-1.5 text-xs">
                  <DollarSign size={14} className="text-amber-800" />
                  <span>Financial Breakdown</span>
                </h4>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Total Room Rent:</span>
                    <span className="font-bold text-stone-900">{formatCurrency(selectedBookingForDetails.totalRoomCharge)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Advance Paid:</span>
                    <span className="font-bold text-emerald-700">{formatCurrency(selectedBookingForDetails.advancePaid || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Payment Status:</span>
                    <span className="font-bold capitalize">{selectedBookingForDetails.paymentStatus?.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Method:</span>
                    <span className="font-semibold uppercase">{selectedBookingForDetails.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {selectedBookingForDetails.specialRequests && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-700 text-xs">
                  <span className="font-bold text-stone-900 block mb-0.5">Special Requests:</span>
                  <p className="text-[11px] text-stone-600">{selectedBookingForDetails.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedBookingForDetails(null)}
                className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOLIO CHECKOUT MODAL ================= */}
      {selectedBookingForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                  Guest Folio Settlement & Departure
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  Checkout Folio — Room #{selectedBookingForCheckout.roomNumber} ({selectedBookingForCheckout.guest?.fullName})
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForCheckout(null)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            {(() => {
              const folio = calculateCheckoutFolio(selectedBookingForCheckout);
              if (!folio) return null;

              const extraNum = Number(checkoutFolioForm.extraCharges) || 0;
              const discountNum = Number(checkoutFolioForm.discount) || 0;
              const subtotal = Math.max(0, folio.subtotal + extraNum - discountNum);
              const taxAmount = Math.round((subtotal * folio.taxRate) / 100);
              const grandTotal = subtotal + taxAmount;
              const balanceDue = Math.max(0, grandTotal - folio.advancePaid);

              return (
                <div className="py-4 space-y-4 text-xs">
                  {/* Summary of room & orders */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-2">
                    <div className="flex justify-between text-xs pb-2 border-b border-stone-200">
                      <span className="font-semibold text-stone-700">
                        Room Charges ({folio.nights} nights @ {formatCurrency(folio.roomRate)}/nt):
                      </span>
                      <span className="font-bold text-stone-900">{formatCurrency(folio.roomCharges)}</span>
                    </div>

                    {/* Room service orders billed to this room */}
                    <div className="py-1">
                      <span className="font-bold text-stone-800 block mb-1">
                        In-Room Dining Orders ({folio.orders.length} orders):
                      </span>
                      {folio.orders.length === 0 ? (
                        <p className="text-[11px] text-stone-500 italic">No dining charges recorded for this room.</p>
                      ) : (
                        <div className="space-y-1">
                          {folio.orders.map((o) => (
                            <div key={o.id} className="flex justify-between text-[11px] text-stone-600 pl-2">
                              <span>{o.orderNumber}: {o.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}</span>
                              <span className="font-semibold text-stone-800">{formatCurrency(o.totalAmount)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Adjustments: Extras & Discounts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Extra Incidentals / Laundry (NPR)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={checkoutFolioForm.extraCharges}
                        onChange={(e) =>
                          setCheckoutFolioForm({ ...checkoutFolioForm, extraCharges: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Extra Description
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Express laundry"
                        value={checkoutFolioForm.extraChargesDescription}
                        onChange={(e) =>
                          setCheckoutFolioForm({
                            ...checkoutFolioForm,
                            extraChargesDescription: e.target.value,
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Promotional Discount (NPR)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={checkoutFolioForm.discount}
                        onChange={(e) =>
                          setCheckoutFolioForm({ ...checkoutFolioForm, discount: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Payment Method Settled
                      </label>
                      <select
                        value={checkoutFolioForm.paymentMethod}
                        onChange={(e) =>
                          setCheckoutFolioForm({ ...checkoutFolioForm, paymentMethod: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white font-semibold"
                      >
                        <option value="cash">Cash at Front Desk</option>
                        <option value="esewa">eSewa Digital Wallet</option>
                        <option value="khalti">Khalti Digital Wallet</option>
                        <option value="card">POS Credit/Debit Card</option>
                      </select>
                    </div>
                  </div>

                  {/* Folio Calculation Summary */}
                  <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-300 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-stone-600">Subtotal:</span>
                      <span className="font-bold text-stone-900">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">VAT ({folio.taxRate}%):</span>
                      <span className="font-bold text-stone-900">{formatCurrency(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-1 border-t border-amber-200">
                      <span className="text-stone-950">Grand Total Folio:</span>
                      <span className="text-stone-950">{formatCurrency(grandTotal)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-800">
                      <span>Less Advance Paid:</span>
                      <span className="font-bold">-{formatCurrency(folio.advancePaid)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-amber-950 pt-2 border-t border-amber-300">
                      <span>Balance Due at Checkout:</span>
                      <span>{formatCurrency(balanceDue)}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedBookingForCheckout(null)}
                      className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitCheckout}
                      className="px-5 py-2.5 text-xs font-bold bg-[#0c2317] hover:bg-[#153a26] text-amber-300 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                    >
                      <Receipt size={15} />
                      <span>Settle & Finalize Departure</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ================= INVOICE PRINT MODAL ================= */}
      {selectedBillForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 no-print">
              <span className="text-xs font-bold text-emerald-700 uppercase">
                Invoice Generated Successfully
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-bold bg-amber-600 text-white rounded-xl flex items-center gap-1.5 hover:bg-amber-700 transition-colors shadow-xs"
                >
                  <Printer size={14} />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedBillForPrint(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Printable Invoice Container */}
            <div id="printable-invoice" className="pt-6 font-sans text-stone-900 text-xs">
              {/* Hotel Header */}
              <div className="text-center pb-6 border-b border-stone-200">
                <h2 className="text-xl font-bold font-display-luxury text-stone-950 uppercase tracking-wide">
                  {hotelInfo.name}
                </h2>
                <p className="text-[11px] text-stone-600 mt-0.5">{hotelInfo.subtitle}</p>
                <p className="text-[11px] text-stone-500">{hotelInfo.address} • Tel: {hotelInfo.phone}</p>
                <p className="text-[10px] text-stone-400 mt-1 font-mono">PAN / VAT Reg No: {hotelInfo.panNumber}</p>
              </div>

              {/* Invoice Meta */}
              <div className="grid grid-cols-2 gap-4 py-4 border-b border-stone-200">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Billed To:</span>
                  <p className="font-bold text-stone-900 text-sm">{selectedBillForPrint.guest?.fullName}</p>
                  <p className="text-stone-600">{selectedBillForPrint.guest?.phone}</p>
                  <p className="text-stone-500">{selectedBillForPrint.guest?.address || "Nepal"}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Invoice Details:</span>
                  <p className="font-mono font-bold text-stone-900">{selectedBillForPrint.billNumber}</p>
                  <p className="text-stone-500 text-[11px]">Date: {formatDateTime(selectedBillForPrint.createdAt)}</p>
                  <p className="text-stone-500 text-[11px]">Room #{selectedBillForPrint.roomNumber} ({selectedBillForPrint.roomCategory})</p>
                </div>
              </div>

              {/* Line items table */}
              <table className="w-full text-left my-4 border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 text-[10px] uppercase font-bold">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-right">Amount (NPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="py-2.5">
                      <span className="font-bold text-stone-900 block">Room Stay Charges</span>
                      <span className="text-[10px] text-stone-500">
                        {selectedBillForPrint.nights} night(s) @ {formatCurrency(selectedBillForPrint.roomRate)}/nt
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-stone-900">
                      {formatCurrency(selectedBillForPrint.roomCharges)}
                    </td>
                  </tr>

                  {selectedBillForPrint.orders && selectedBillForPrint.orders.length > 0 && (
                    <tr>
                      <td className="py-2.5">
                        <span className="font-bold text-stone-900 block">In-Room Dining Charges</span>
                        <span className="text-[10px] text-stone-500">
                          {selectedBillForPrint.orders.map((o) => o.itemsSummary).join("; ")}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-bold text-stone-900">
                        {formatCurrency(selectedBillForPrint.totalOrdersAmount)}
                      </td>
                    </tr>
                  )}

                  {selectedBillForPrint.extraCharges > 0 && (
                    <tr>
                      <td className="py-2.5">
                        <span className="font-bold text-stone-900 block">
                          Extra Charges ({selectedBillForPrint.extraChargesDescription || "Incidentals"})
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-bold text-stone-900">
                        {formatCurrency(selectedBillForPrint.extraCharges)}
                      </td>
                    </tr>
                  )}

                  {selectedBillForPrint.discount > 0 && (
                    <tr>
                      <td className="py-2.5 text-rose-700">
                        <span>Discount / Special Courtesy</span>
                      </td>
                      <td className="py-2.5 text-right font-bold text-rose-700">
                        -{formatCurrency(selectedBillForPrint.discount)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Total calculations */}
              <div className="pt-3 border-t border-stone-200 space-y-1 text-right">
                <div className="flex justify-end gap-6 text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-stone-900 w-28">{formatCurrency(selectedBillForPrint.subtotal)}</span>
                </div>
                <div className="flex justify-end gap-6 text-stone-600">
                  <span>VAT ({selectedBillForPrint.taxRate}%):</span>
                  <span className="font-bold text-stone-900 w-28">{formatCurrency(selectedBillForPrint.taxAmount)}</span>
                </div>
                <div className="flex justify-end gap-6 text-sm font-bold text-stone-950 pt-1 border-t border-stone-200">
                  <span>Grand Total:</span>
                  <span className="w-28">{formatCurrency(selectedBillForPrint.grandTotal)}</span>
                </div>
                <div className="flex justify-end gap-6 text-emerald-800 font-semibold">
                  <span>Amount Settled at Checkout:</span>
                  <span className="w-28">{formatCurrency(selectedBillForPrint.amountPaidAtCheckout)}</span>
                </div>
              </div>

              {/* Sign-off */}
              <div className="mt-8 pt-4 border-t border-stone-200 text-center text-stone-500 text-[10px]">
                <p>Thank you for choosing {hotelInfo.name}! We look forward to welcoming you again.</p>
                <p className="mt-0.5">Computer generated fiscal tax receipt.</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200 text-right no-print">
              <button
                onClick={() => setSelectedBillForPrint(null)}
                className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CANCELLATION CONFIRMATION DIALOG ================= */}
      {selectedBookingForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-bold text-stone-900">Cancel Reservation?</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Are you sure you want to cancel booking <strong className="text-stone-900 font-mono">{selectedBookingForCancel.bookingId}</strong> for <strong>{selectedBookingForCancel.guest?.fullName}</strong>?
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              Room #{selectedBookingForCancel.roomNumber} will be marked as available.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedBookingForCancel(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-xl"
              >
                Keep Booking
              </button>
              <button
                onClick={() => {
                  cancelBooking(selectedBookingForCancel.id);
                  setSelectedBookingForCancel(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsView;
