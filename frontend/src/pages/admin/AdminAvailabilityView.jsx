import React, { useState, useMemo } from "react";
import {
  CalendarDays,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  BedDouble,
  ShieldAlert,
  Info,
  Calendar,
} from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { formatDate } from "../../utils/formatDate";

export const AdminAvailabilityView = () => {
  const { rooms, bookings, categories, blockRoomForMaintenance, unblockRoom } = useBooking();

  // Date range state
  const [selectedDaysCount, setSelectedDaysCount] = useState(14); // 14 | 30
  const [startDateOffset, setStartDateOffset] = useState(0); // in days from today
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Maintenance Modal
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedRoomForMaintenance, setSelectedRoomForMaintenance] = useState(null);
  const [maintenanceForm, setMaintenanceForm] = useState({
    reason: "Air Conditioner repair & deep sanitization",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
  });

  // Cell Tooltip state
  const [hoveredCellInfo, setHoveredCellInfo] = useState(null);

  // Generate date list based on start date and count
  const dateColumns = useMemo(() => {
    const list = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + startDateOffset);

    for (let i = 0; i < selectedDaysCount; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString("en-US", { month: "short" });

      list.push({
        iso,
        dayName,
        dayNum,
        monthName,
        isToday: iso === new Date().toISOString().split("T")[0],
        isWeekend: d.getDay() === 6, // Saturday in Nepal
      });
    }
    return list;
  }, [startDateOffset, selectedDaysCount]);

  // Filtered rooms
  const displayRooms = useMemo(() => {
    if (selectedCategory === "all") return rooms;
    return rooms.filter((r) => r.category === selectedCategory);
  }, [rooms, selectedCategory]);

  // Determine status of room on specific date
  const getRoomDayStatus = (room, dateIso) => {
    // 1. Check if room is under maintenance on this date
    if (room.status === "maintenance") {
      const start = room.maintenanceStartDate || "1970-01-01";
      const end = room.maintenanceEndDate || "2099-12-31";
      if (dateIso >= start && (!room.maintenanceEndDate || dateIso <= end)) {
        return {
          type: "maintenance",
          reason: room.maintenanceReason || "Maintenance & Inspection",
          label: "Maintenance",
        };
      }
    }

    // 2. Check bookings overlapping this date
    const bookingMatch = bookings.find((b) => {
      if (b.status === "cancelled" || b.status === "checked_out") return false;
      if (b.roomNumber !== room.roomNumber) return false;

      // In hotel stays, check-in date <= dateIso < check-out date
      return dateIso >= b.checkInDate && dateIso < b.checkOutDate;
    });

    if (bookingMatch) {
      return {
        type: "occupied",
        booking: bookingMatch,
        label: `${bookingMatch.guest?.fullName} (${bookingMatch.bookingId})`,
      };
    }

    // Otherwise available
    return {
      type: "available",
      label: "Available",
    };
  };

  // Open Maintenance Modal
  const handleOpenMaintenance = (room) => {
    setSelectedRoomForMaintenance(room);
    setMaintenanceForm({
      reason: room.maintenanceReason || "Plumbing repair, painting, or routine inspection",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    });
    setIsMaintenanceModalOpen(true);
  };

  const handleSaveMaintenance = (e) => {
    e.preventDefault();
    if (!selectedRoomForMaintenance) return;

    blockRoomForMaintenance(
      selectedRoomForMaintenance.id,
      maintenanceForm.reason,
      maintenanceForm.startDate,
      maintenanceForm.endDate
    );

    setIsMaintenanceModalOpen(false);
  };

  const handleUnblock = (room) => {
    unblockRoom(room.id);
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <CalendarDays size={22} className="text-amber-600" />
            <span>Room Availability & Maintenance Matrix</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Visualize day-by-day availability, prevent double bookings, and block rooms for inspection or repair.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 shadow-xs" />
            <span className="text-stone-700 font-medium">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-500 shadow-xs" />
            <span className="text-stone-700 font-medium">Occupied / Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-stone-500 shadow-xs" />
            <span className="text-stone-700 font-medium">Maintenance Block</span>
          </div>
        </div>
      </div>

      {/* ================= TIMELINE CONTROLS TOOLBAR ================= */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStartDateOffset((prev) => prev - 7)}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors flex items-center gap-1"
            title="Earlier 7 Days"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Earlier</span>
          </button>
          <button
            onClick={() => setStartDateOffset(0)}
            className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-800 font-bold transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setStartDateOffset((prev) => prev + 7)}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors flex items-center gap-1"
            title="Later 7 Days"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} />
          </button>

          <span className="text-stone-500 font-medium pl-2">
            Showing from: <strong className="text-stone-900">{dateColumns[0]?.monthName} {dateColumns[0]?.dayNum}</strong> to <strong className="text-stone-900">{dateColumns[dateColumns.length - 1]?.monthName} {dateColumns[dateColumns.length - 1]?.dayNum}</strong>
          </span>
        </div>

        {/* View Range & Category Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl border border-stone-200 bg-stone-50 font-semibold text-stone-800 focus:outline-none"
            >
              <option value="all">All Room Tiers</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => setSelectedDaysCount(14)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                selectedDaysCount === 14 ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setSelectedDaysCount(30)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                selectedDaysCount === 30 ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      {/* ================= CALENDAR TIMELINE MATRIX ================= */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            {/* Table Header: Dates */}
            <thead>
              <tr className="bg-stone-50/90 border-b border-stone-200">
                <th className="py-3 px-4 text-left font-bold text-stone-700 min-w-[170px] sticky left-0 bg-stone-50 z-20 border-r border-stone-200">
                  Room / Category
                </th>
                {dateColumns.map((col) => (
                  <th
                    key={col.iso}
                    className={`py-2 px-2 text-center min-w-[50px] border-r border-stone-100 last:border-r-0 ${
                      col.isToday
                        ? "bg-amber-100/70 text-amber-900 font-extrabold"
                        : col.isWeekend
                        ? "bg-stone-100/60 text-stone-800"
                        : "text-stone-600"
                    }`}
                  >
                    <span className="block text-[10px] uppercase">{col.dayName}</span>
                    <span className="block text-xs font-bold">{col.dayNum}</span>
                    <span className="block text-[9px] text-stone-400">{col.monthName}</span>
                  </th>
                ))}
                <th className="py-3 px-3 text-center font-bold text-stone-700 min-w-[100px] border-l border-stone-200">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body: Rooms & Cells */}
            <tbody className="divide-y divide-stone-100">
              {displayRooms.map((room) => (
                <tr key={room.id} className="hover:bg-stone-50/50 transition-colors">
                  {/* Sticky Room Label */}
                  <td className="py-3 px-4 font-medium text-stone-900 sticky left-0 bg-white z-10 border-r border-stone-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 font-bold flex items-center justify-center text-xs shrink-0">
                        {room.roomNumber}
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-stone-900 block truncate">
                          Room #{room.roomNumber}
                        </span>
                        <span className="text-[10px] text-stone-500 block truncate">
                          {room.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Date Status Cells */}
                  {dateColumns.map((col) => {
                    const status = getRoomDayStatus(room, col.iso);

                    let cellStyle = "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-100";
                    let innerIcon = <CheckCircle2 size={13} className="text-emerald-600" />;

                    if (status.type === "occupied") {
                      cellStyle = "bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300 font-bold";
                      innerIcon = <span className="text-[10px] font-bold">OCC</span>;
                    } else if (status.type === "maintenance") {
                      cellStyle = "bg-stone-200 text-stone-700 hover:bg-stone-300 border border-stone-300";
                      innerIcon = <Wrench size={12} className="text-stone-600" />;
                    }

                    return (
                      <td
                        key={col.iso}
                        className="py-1.5 px-1 text-center border-r border-stone-100 last:border-r-0"
                      >
                        <div
                          title={`Room #${room.roomNumber} on ${col.iso}: ${status.label}`}
                          className={`w-full h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${cellStyle}`}
                        >
                          {innerIcon}
                        </div>
                      </td>
                    );
                  })}

                  {/* Actions Column */}
                  <td className="py-2 px-3 text-center border-l border-stone-200">
                    {room.status === "maintenance" ? (
                      <button
                        onClick={() => handleUnblock(room)}
                        className="px-2 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenMaintenance(room)}
                        className="px-2 py-1 text-[10px] font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-200 flex items-center gap-1 mx-auto"
                      >
                        <Wrench size={11} />
                        <span>Block</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= BLOCK FOR MAINTENANCE MODAL ================= */}
      {isMaintenanceModalOpen && selectedRoomForMaintenance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                  <Wrench size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Block Room #{selectedRoomForMaintenance.roomNumber}
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    {selectedRoomForMaintenance.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMaintenanceModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveMaintenance} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Reason for Blocking / Maintenance *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC unit repair, bathroom geyser replacement"
                  value={maintenanceForm.reason}
                  onChange={(e) =>
                    setMaintenanceForm({ ...maintenanceForm, reason: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={maintenanceForm.startDate}
                    onChange={(e) =>
                      setMaintenanceForm({ ...maintenanceForm, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={maintenanceForm.endDate}
                    onChange={(e) =>
                      setMaintenanceForm({ ...maintenanceForm, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-stone-700 text-[11px] leading-relaxed">
                <span className="font-bold text-amber-900 block mb-0.5">Note:</span>
                This will prevent new bookings from taking this room during the specified maintenance period.
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMaintenanceModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 rounded-xl shadow-md cursor-pointer"
                >
                  Confirm Room Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAvailabilityView;
