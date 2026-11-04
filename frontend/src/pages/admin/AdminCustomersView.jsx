import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  CalendarCheck,
  DollarSign,
  Eye,
  Award,
  Clock,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { formatCurrency, formatDate } from "../../utils/formatDate";

export const AdminCustomersView = () => {
  const { customers, bookings } = useBooking();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomerForModal, setSelectedCustomerForModal] = useState(null);

  // Search filter
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchTerm.toLowerCase().trim();
      if (!q) return true;
      return (
        c.fullName?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.address?.toLowerCase().includes(q)
      );
    });
  }, [customers, searchTerm]);

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Users size={22} className="text-amber-600" />
            <span>Customer Directory & Guest Profiles</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Directory of registered and walk-in guests at Kalika Hotel & Lodge, including stay frequency and total spend.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-900 font-bold border border-amber-200">
            {customers.length} Registered Guests
          </div>
        </div>
      </div>

      {/* ================= SEARCH TOOLBAR ================= */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0c2317]/20 focus:border-[#0c2317] transition-all text-xs"
          />
        </div>

        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-stone-500 hover:text-stone-900 underline text-xs"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* ================= CUSTOMERS TABLE ================= */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 sm:px-6">Customer Name</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Location / City</th>
                <th className="py-3.5 px-4 text-center">Total Stays</th>
                <th className="py-3.5 px-4">Total Amount Spent</th>
                <th className="py-3.5 px-4">Last Stay</th>
                <th className="py-3.5 px-4 text-right sm:pr-6">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-stone-500">
                    <Users size={36} className="mx-auto text-stone-300 mb-2" />
                    <p className="font-semibold text-stone-700">No customer profiles found.</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Customer profiles are automatically aggregated when bookings are created.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0c2317] to-[#1d4c33] text-amber-300 font-bold flex items-center justify-center text-xs shrink-0">
                          {cust.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block truncate max-w-[160px]">
                            {cust.fullName}
                          </span>
                          {cust.totalBookings > 1 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700">
                              <Award size={10} /> Repeat Guest
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-stone-800">
                      {cust.phone}
                    </td>

                    <td className="py-3.5 px-4 text-stone-600 truncate max-w-[160px]">
                      {cust.email || "—"}
                    </td>

                    <td className="py-3.5 px-4 text-stone-600">
                      {cust.address || "Nepal"}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-stone-100 font-bold text-stone-800 text-[11px]">
                        {cust.totalBookings}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-stone-950">
                      {formatCurrency(cust.totalSpent)}
                    </td>

                    <td className="py-3.5 px-4 text-stone-600">
                      {formatDate(cust.lastBookingDate)}
                    </td>

                    <td className="py-3.5 px-4 text-right sm:pr-6">
                      <button
                        onClick={() => setSelectedCustomerForModal(cust)}
                        className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200 cursor-pointer"
                      >
                        View History
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= CUSTOMER DETAILS MODAL ================= */}
      {selectedCustomerForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0c2317] text-amber-300 font-bold flex items-center justify-center text-sm shadow-xs">
                  {selectedCustomerForModal.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {selectedCustomerForModal.fullName}
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    Guest Account Profile
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomerForModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Profile Bio */}
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Phone Number</span>
                  <span className="font-bold text-stone-900 text-xs">{selectedCustomerForModal.phone}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Email</span>
                  <span className="font-semibold text-stone-800 text-xs">{selectedCustomerForModal.email || "—"}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Citizenship / ID Card</span>
                  <span className="font-semibold text-stone-800 text-xs">{selectedCustomerForModal.idCardNumber || "—"}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">City / Address</span>
                  <span className="font-semibold text-stone-800 text-xs">{selectedCustomerForModal.address || "Nepal"}</span>
                </div>
              </div>

              {/* KPI Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200">
                  <span className="text-amber-900 font-semibold block text-[11px]">Total Reservations</span>
                  <span className="text-xl font-bold text-amber-950 mt-0.5 block">
                    {selectedCustomerForModal.totalBookings} Stay(s)
                  </span>
                </div>
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-emerald-900 font-semibold block text-[11px]">Total Expenditure</span>
                  <span className="text-xl font-bold text-emerald-950 mt-0.5 block">
                    {formatCurrency(selectedCustomerForModal.totalSpent)}
                  </span>
                </div>
              </div>

              {/* Stay History List */}
              <div>
                <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-1.5 text-xs">
                  <CalendarCheck size={14} className="text-amber-800" />
                  <span>Recorded Reservation History</span>
                </h4>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {selectedCustomerForModal.bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-[11px]"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900">{b.bookingId}</span>
                          <span className="text-[10px] font-semibold bg-stone-200/80 px-1.5 py-0.2 rounded text-stone-700">
                            Room #{b.roomNumber} ({b.roomCategory})
                          </span>
                        </div>
                        <span className="text-stone-500 block text-[10px] mt-0.5">
                          {formatDate(b.checkInDate)} &rarr; {formatDate(b.checkOutDate)} ({b.totalNights} nts)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-stone-900 block">
                          {formatCurrency(b.totalRoomCharge)}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-amber-800 block">
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedCustomerForModal(null)}
                className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomersView;
