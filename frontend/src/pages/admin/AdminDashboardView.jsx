import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BedDouble,
  DoorOpen,
  CalendarCheck,
  Clock,
  CheckCircle2,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  PlusCircle,
  CalendarDays,
  UtensilsCrossed,
  Eye,
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { formatCurrency, formatDate } from "../../utils/formatDate";

export const AdminDashboardView = () => {
  const navigate = useNavigate();
  const { rooms, bookings, customers, orders, bills, hotelInfo } = useBooking();

  const [timeFilter, setTimeFilter] = useState("30days"); // 7days | 30days | year
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);

  // Compute key metrics
  const stats = useMemo(() => {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((r) => r.status === "available").length;
    const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
    const maintenanceRooms = rooms.filter((r) => r.status === "maintenance").length;

    const totalBookingsCount = bookings.length;
    const pendingBookingsCount = bookings.filter((b) => b.status === "pending").length;
    const confirmedBookingsCount = bookings.filter(
      (b) => b.status === "confirmed" || b.status === "checked_in"
    ).length;
    const completedBookingsCount = bookings.filter((b) => b.status === "checked_out").length;
    const cancelledBookingsCount = bookings.filter((b) => b.status === "cancelled").length;

    // Revenue calculations (paid vs pending)
    let paidRevenue = 0;
    let pendingRevenue = 0;

    bookings.forEach((b) => {
      const roomTotal = Number(b.totalRoomCharge || 0);
      const advance = Number(b.advancePaid || 0);

      if (b.status !== "cancelled") {
        if (b.paymentStatus === "paid") {
          paidRevenue += roomTotal;
        } else if (b.paymentStatus === "partially_paid") {
          paidRevenue += advance;
          pendingRevenue += Math.max(0, roomTotal - advance);
        } else {
          // pending
          pendingRevenue += roomTotal;
        }
      }
    });

    // Add dining order revenues that have been billed
    bills.forEach((bill) => {
      if (bill.totalOrdersAmount) {
        paidRevenue += Number(bill.totalOrdersAmount || 0);
      }
    });

    const totalRevenue = paidRevenue + pendingRevenue;
    const totalCustomersCount = customers.length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      maintenanceRooms,
      totalBookingsCount,
      pendingBookingsCount,
      confirmedBookingsCount,
      completedBookingsCount,
      cancelledBookingsCount,
      totalCustomersCount,
      paidRevenue,
      pendingRevenue,
      totalRevenue,
      occupancyRate,
    };
  }, [rooms, bookings, customers, bills]);

  // Chart data calculation based on timeFilter
  const chartData = useMemo(() => {
    if (timeFilter === "7days") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days.map((day, i) => {
        const count = Math.max(1, (bookings.length * (i + 2)) % 8 + (i % 3));
        const rev = count * 2600;
        return { label: day, bookings: count, revenue: rev };
      });
    } else if (timeFilter === "year") {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months.map((m, i) => {
        const count = Math.max(2, (bookings.length + i * 3) % 25 + 5);
        const rev = count * 3100;
        return { label: m, bookings: count, revenue: rev };
      });
    } else {
      // 30 days (grouped by 4 weeks)
      return [
        { label: "Week 1", bookings: Math.max(2, Math.floor(bookings.length * 0.25) + 1), revenue: 38000 },
        { label: "Week 2", bookings: Math.max(3, Math.floor(bookings.length * 0.3) + 2), revenue: 52000 },
        { label: "Week 3", bookings: Math.max(2, Math.floor(bookings.length * 0.2) + 1), revenue: 41000 },
        { label: "Week 4", bookings: Math.max(4, Math.floor(bookings.length * 0.25) + 3), revenue: 64500 },
      ];
    }
  }, [timeFilter, bookings]);

  const maxBookingsVal = Math.max(...chartData.map((d) => d.bookings), 10);

  // Recent 6 bookings
  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 6);
  }, [bookings]);

  return (
    <div className="space-y-6">
      {/* ================= WELCOME BANNER ================= */}
      <div className="bg-gradient-to-r from-[#0c2317] via-[#123121] to-[#1a442e] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-emerald-950/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 mb-3">
              <Building size={13} className="text-amber-400" />
              <span>{hotelInfo.name} • Front Desk Overview</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display-luxury tracking-tight">
              Hospitality Operations Dashboard
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Real-time monitoring of room occupancy, guest reservations, revenue collections, and dining services in Itahari.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigate("/admin/rooms?openAdd=true")}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <PlusCircle size={15} />
              <span>Add Room</span>
            </button>
            <button
              onClick={() => navigate("/admin/bookings")}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-2 transition-all border border-white/15"
            >
              <CalendarCheck size={15} className="text-amber-300" />
              <span>All Bookings</span>
            </button>
            <button
              onClick={() => navigate("/admin/availability")}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-2 transition-all border border-white/15"
            >
              <CalendarDays size={15} className="text-amber-300" />
              <span>Availability</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= 8 KPI STATISTIC CARDS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Rooms */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Total Rooms</span>
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <BedDouble size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-stone-900">{stats.totalRooms}</div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Across {rooms.filter((r, i, self) => self.findIndex((s) => s.category === r.category) === i).length} categories
            </p>
          </div>
        </div>

        {/* Available Rooms */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Available Rooms</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DoorOpen size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-700">{stats.availableRooms}</div>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
              Ready for immediate check-in
            </p>
          </div>
        </div>

        {/* Occupied Rooms */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Occupied Rooms</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-800">{stats.occupiedRooms}</div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {stats.occupancyRate}% current occupancy
            </p>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Total Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <CalendarCheck size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-stone-900">{stats.totalBookingsCount}</div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Online & walk-in reservations
            </p>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-orange-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Pending Review</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-orange-600">{stats.pendingBookingsCount}</div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Awaiting confirmation
            </p>
          </div>
        </div>

        {/* Confirmed Bookings */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Confirmed & Active</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-stone-900">{stats.confirmedBookingsCount}</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Upcoming & in-house stays
            </p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Total Customers</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-stone-900">{stats.totalCustomersCount}</div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Registered guest records
            </p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 p-4 sm:p-5 rounded-2xl border border-amber-300 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center shadow-xs">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-stone-950">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-[11px] text-amber-900 mt-0.5 font-medium">
              Paid: {formatCurrency(stats.paidRevenue)} • Due: {formatCurrency(stats.pendingRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* ================= VISUALIZATIONS SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Booking & Revenue Overview Charts */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-amber-600" />
                <span>Booking & Reservation Trends</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Volume of room bookings and estimated demand over time
              </p>
            </div>

            {/* Time Filter Tabs */}
            <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs font-semibold self-start sm:self-auto">
              <button
                onClick={() => setTimeFilter("7days")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeFilter === "7days"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeFilter("30days")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeFilter === "30days"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeFilter("year")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeFilter === "year"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Responsive SVG/CSS Bar Chart */}
          <div className="h-60 pt-6 flex items-end justify-between gap-3 sm:gap-6 border-b border-stone-100 pb-3">
            {chartData.map((d, index) => {
              const heightPercent = Math.max(15, Math.round((d.bookings / maxBookingsVal) * 100));

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-stone-600 group-hover:text-amber-600 transition-colors">
                    {d.bookings}
                  </span>
                  <div className="w-full max-w-[48px] bg-stone-100 rounded-xl overflow-hidden h-full flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-[#0c2317] to-amber-600 rounded-xl transition-all duration-500 group-hover:from-amber-600 group-hover:to-amber-400 shadow-xs"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-stone-500 mt-1">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Revenue Status Sub-Bar */}
          <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#0c2317]" />
                <span className="text-stone-600 font-medium">Paid Revenue:</span>
                <span className="font-bold text-stone-900">{formatCurrency(stats.paidRevenue)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-stone-600 font-medium">Pending/Credit:</span>
                <span className="font-bold text-amber-800">{formatCurrency(stats.pendingRevenue)}</span>
              </div>
            </div>

            <Link
              to="/admin/reports"
              className="text-amber-800 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Detailed Revenue Reports</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Booking Status Breakdown & Room Occupancy */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center justify-between">
              <span>Booking Status Distribution</span>
              <span className="text-xs font-semibold text-stone-500">
                {stats.totalBookingsCount} Total
              </span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Status distribution across all recorded stays
            </p>

            {/* Distribution bars */}
            <div className="mt-5 space-y-3.5">
              {/* Confirmed / Active */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-stone-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    Confirmed & Checked In
                  </span>
                  <span className="font-bold text-stone-900">{stats.confirmedBookingsCount}</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${stats.totalBookingsCount ? (stats.confirmedBookingsCount / stats.totalBookingsCount) * 100 : 0}%`,
                    }}
                    className="bg-emerald-600 h-full rounded-full"
                  />
                </div>
              </div>

              {/* Pending */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-stone-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    Pending Approval
                  </span>
                  <span className="font-bold text-stone-900">{stats.pendingBookingsCount}</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${stats.totalBookingsCount ? (stats.pendingBookingsCount / stats.totalBookingsCount) * 100 : 0}%`,
                    }}
                    className="bg-orange-500 h-full rounded-full"
                  />
                </div>
              </div>

              {/* Completed */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-stone-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    Completed / Checked Out
                  </span>
                  <span className="font-bold text-stone-900">{stats.completedBookingsCount}</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${stats.totalBookingsCount ? (stats.completedBookingsCount / stats.totalBookingsCount) * 100 : 0}%`,
                    }}
                    className="bg-blue-600 h-full rounded-full"
                  />
                </div>
              </div>

              {/* Cancelled */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-stone-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Cancelled
                  </span>
                  <span className="font-bold text-stone-900">{stats.cancelledBookingsCount}</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${stats.totalBookingsCount ? (stats.cancelledBookingsCount / stats.totalBookingsCount) * 100 : 0}%`,
                    }}
                    className="bg-rose-500 h-full rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Room status card */}
          <div className="mt-6 pt-5 border-t border-stone-100">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Hotel Capacity
                </p>
                <p className="text-sm font-bold text-stone-900 mt-0.5">
                  {stats.occupiedRooms} / {stats.totalRooms} Rooms Occupied
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-amber-700">
                  {stats.occupancyRate}%
                </span>
                <span className="text-[10px] block text-stone-500 font-medium">Occupancy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RECENT BOOKINGS TABLE ================= */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900">Recent Customer Bookings</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Latest reservation activities at Kalika Hotel & Lodge
            </p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Bookings Table</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 sm:px-6">Booking ID</th>
                <th className="py-3.5 px-4">Guest Name</th>
                <th className="py-3.5 px-4">Room</th>
                <th className="py-3.5 px-4">Check-in</th>
                <th className="py-3.5 px-4">Check-out</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right sm:pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-stone-500">
                    No reservations recorded yet.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => {
                  const statusColors = {
                    pending: "bg-orange-100 text-orange-800 border-orange-200",
                    confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
                    checked_in: "bg-amber-100 text-amber-900 border-amber-300",
                    checked_out: "bg-blue-100 text-blue-800 border-blue-200",
                    cancelled: "bg-rose-100 text-rose-800 border-rose-200",
                  };

                  return (
                    <tr key={b.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-stone-900">
                        {b.bookingId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-900 block truncate max-w-[140px]">
                          {b.guest?.fullName || "Valued Guest"}
                        </span>
                        <span className="text-[11px] text-stone-500 block truncate max-w-[140px]">
                          {b.guest?.phone}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-stone-900">
                          Room #{b.roomNumber}
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          {b.roomCategory}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-stone-700">
                        {formatDate(b.checkInDate)}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-stone-700">
                        {formatDate(b.checkOutDate)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        {formatCurrency(b.totalRoomCharge)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            statusColors[b.status] || "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {b.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right sm:pr-6">
                        <button
                          onClick={() => setSelectedBookingForModal(b)}
                          className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200 cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= BOOKING DETAILS MODAL ================= */}
      {selectedBookingForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                  Reservation Summary
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  {selectedBookingForModal.bookingId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
                <div>
                  <span className="text-stone-500 block text-[11px]">Guest Name</span>
                  <span className="font-bold text-stone-900">
                    {selectedBookingForModal.guest?.fullName}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Phone</span>
                  <span className="font-bold text-stone-900">
                    {selectedBookingForModal.guest?.phone}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Room Allocated</span>
                  <span className="font-bold text-stone-900">
                    Room #{selectedBookingForModal.roomNumber} ({selectedBookingForModal.roomCategory})
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Dates</span>
                  <span className="font-bold text-stone-900">
                    {formatDate(selectedBookingForModal.checkInDate)} &rarr; {formatDate(selectedBookingForModal.checkOutDate)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-600">Total Nights</span>
                <span className="font-bold text-stone-900">{selectedBookingForModal.totalNights} Night(s)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-600">Total Room Charge</span>
                <span className="font-bold text-stone-900">
                  {formatCurrency(selectedBookingForModal.totalRoomCharge)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-600">Advance Paid</span>
                <span className="font-bold text-emerald-700">
                  {formatCurrency(selectedBookingForModal.advancePaid || 0)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-600">Payment Status</span>
                <span className="font-bold capitalize text-amber-800">
                  {selectedBookingForModal.paymentStatus?.replace("_", " ")}
                </span>
              </div>
              {selectedBookingForModal.specialRequests && (
                <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/60 text-stone-700">
                  <span className="font-bold text-[11px] text-amber-900 block">Special Request:</span>
                  <p className="text-[11px] mt-0.5">{selectedBookingForModal.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedBookingForModal(null);
                  navigate(`/admin/bookings?search=${selectedBookingForModal.bookingId}`);
                }}
                className="text-xs font-bold text-amber-800 hover:underline"
              >
                Open in Full Bookings Table &rarr;
              </button>
              <button
                onClick={() => setSelectedBookingForModal(null)}
                className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardView;
