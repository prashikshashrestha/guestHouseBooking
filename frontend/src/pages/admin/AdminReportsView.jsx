import React, { useState, useMemo } from "react";
import {
  BarChart3,
  Calendar,
  Download,
  Printer,
  DollarSign,
  TrendingUp,
  BedDouble,
  Users,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  ArrowUpRight,
} from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { formatCurrency, formatDate } from "../../utils/formatDate";

export const AdminReportsView = () => {
  const { bookings, rooms, customers, bills, hotelInfo, orders } = useBooking();

  const [reportPeriod, setReportPeriod] = useState("all"); // all | month | week

  // Compute operational statistics
  const analytics = useMemo(() => {
    let targetBookings = bookings;

    const totalBookings = targetBookings.length;
    const confirmed = targetBookings.filter((b) => b.status === "confirmed" || b.status === "checked_in").length;
    const completed = targetBookings.filter((b) => b.status === "checked_out").length;
    const cancelled = targetBookings.filter((b) => b.status === "cancelled").length;
    const onlineBookings = targetBookings.filter((b) => b.bookingType === "online").length;
    const walkInBookings = targetBookings.filter((b) => b.bookingType === "offline_walkin").length;

    // Financials
    let totalRoomRent = 0;
    let totalPaid = 0;
    let totalPending = 0;

    targetBookings.forEach((b) => {
      const charge = Number(b.totalRoomCharge || 0);
      const adv = Number(b.advancePaid || 0);

      if (b.status !== "cancelled") {
        totalRoomRent += charge;
        if (b.paymentStatus === "paid") {
          totalPaid += charge;
        } else if (b.paymentStatus === "partially_paid") {
          totalPaid += adv;
          totalPending += Math.max(0, charge - adv);
        } else {
          totalPending += charge;
        }
      }
    });

    // Dining revenue from settled bills
    let diningRevenue = 0;
    let totalVatCollected = 0;
    bills.forEach((bill) => {
      diningRevenue += Number(bill.totalOrdersAmount || 0);
      totalVatCollected += Number(bill.taxAmount || 0);
    });

    const grandRevenue = totalRoomRent + diningRevenue;

    // Room tier breakdown
    const categoryPopularity = {};
    targetBookings.forEach((b) => {
      const cat = b.roomCategory || "Standard Room";
      categoryPopularity[cat] = (categoryPopularity[cat] || 0) + 1;
    });

    // Customer analytics
    const repeatGuests = customers.filter((c) => c.totalBookings > 1).length;
    const repeatRate = customers.length > 0 ? Math.round((repeatGuests / customers.length) * 100) : 0;

    return {
      totalBookings,
      confirmed,
      completed,
      cancelled,
      onlineBookings,
      walkInBookings,
      totalRoomRent,
      diningRevenue,
      totalVatCollected,
      totalPaid,
      totalPending,
      grandRevenue,
      categoryPopularity,
      repeatGuests,
      repeatRate,
    };
  }, [bookings, bills, customers]);

  // Export CSV Helper
  const handleExportCSV = () => {
    const headers = [
      "Booking ID",
      "Guest Name",
      "Phone",
      "Email",
      "Room Number",
      "Category",
      "Check-in",
      "Check-out",
      "Nights",
      "Total Amount (NPR)",
      "Payment Status",
      "Status",
      "Created At",
    ];

    const rows = bookings.map((b) => [
      `"${b.bookingId}"`,
      `"${b.guest?.fullName?.replace(/"/g, '""') || ""}"`,
      `"${b.guest?.phone || ""}"`,
      `"${b.guest?.email || ""}"`,
      `"${b.roomNumber}"`,
      `"${b.roomCategory}"`,
      `"${b.checkInDate}"`,
      `"${b.checkOutDate}"`,
      b.totalNights,
      b.totalRoomCharge,
      `"${b.paymentStatus}"`,
      `"${b.status}"`,
      `"${b.createdAt}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Kalika_Hotel_Bookings_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <BarChart3 size={22} className="text-amber-600" />
            <span>Reports & Financial Analytics</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Operational summaries, revenue metrics, customer loyalty, and CSV reporting exports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition-colors border border-stone-200"
          >
            <Download size={14} className="text-stone-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-[#0c2317] hover:bg-[#143825] text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Printer size={14} className="text-amber-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* ================= REVENUE SUMMARY TILES ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Gross Stays & Dining</span>
          <div className="text-2xl font-bold text-stone-950 mt-1">
            {formatCurrency(analytics.grandRevenue)}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Room rent: {formatCurrency(analytics.totalRoomRent)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700">Actual Realized Revenue</span>
          <div className="text-2xl font-bold text-emerald-800 mt-1">
            {formatCurrency(analytics.totalPaid)}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            Collected via cash, eSewa, or POS
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-semibold text-amber-800">Pending / Credit Dues</span>
          <div className="text-2xl font-bold text-amber-900 mt-1">
            {formatCurrency(analytics.pendingPending || analytics.totalPending)}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Pay-at-hotel or ongoing stays
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">In-Room Dining Orders</span>
          <div className="text-2xl font-bold text-stone-900 mt-1">
            {formatCurrency(analytics.diningRevenue)}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Settled via room folios
          </p>
        </div>
      </div>

      {/* ================= DETAILED REPORTS GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Channel & Performance */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <TrendingUp size={16} className="text-amber-700" />
            <span>Booking Channels & Conversion</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-stone-500 block text-[11px]">Online Web Reservations</span>
              <span className="text-xl font-bold text-stone-900 mt-0.5 block">
                {analytics.onlineBookings}
              </span>
              <span className="text-[10px] text-stone-400">Via customer site</span>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-stone-500 block text-[11px]">Front Desk Walk-ins</span>
              <span className="text-xl font-bold text-stone-900 mt-0.5 block">
                {analytics.walkInBookings}
              </span>
              <span className="text-[10px] text-stone-400">Buspark arrivals</span>
            </div>
          </div>

          <div className="pt-2 space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <span className="text-stone-600">Total Recorded Bookings:</span>
              <span className="font-bold text-stone-900">{analytics.totalBookings}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <span className="text-stone-600">Successfully Completed Stays:</span>
              <span className="font-bold text-emerald-800">{analytics.completed}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <span className="text-stone-600">Active / Confirmed Ahead:</span>
              <span className="font-bold text-amber-800">{analytics.confirmed}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <span className="text-stone-600">Cancelled Reservations:</span>
              <span className="font-bold text-rose-700">{analytics.cancelled}</span>
            </div>
          </div>
        </div>

        {/* Room Tier Popularity */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <BedDouble size={16} className="text-amber-700" />
            <span>Most-Booked Room Tiers</span>
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            {Object.entries(analytics.categoryPopularity).map(([tier, count]) => {
              const pct = analytics.totalBookings > 0 ? Math.round((count / analytics.totalBookings) * 100) : 0;
              return (
                <div key={tier}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-stone-800">{tier}</span>
                    <span className="text-stone-900">{count} bookings ({pct}%)</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="bg-gradient-to-r from-[#0c2317] to-amber-600 h-full rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guest Loyalty Summary */}
          <div className="mt-6 pt-4 border-t border-stone-100">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-amber-950 block">Repeat Guest Loyalty</span>
                <span className="text-[11px] text-amber-900">
                  {analytics.repeatGuests} guests have stayed more than once
                </span>
              </div>
              <span className="text-lg font-bold text-amber-950">
                {analytics.repeatRate}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsView;
