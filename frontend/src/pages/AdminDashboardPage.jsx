import React, { useState } from "react";
import {
  Building,
  PlusCircle,
  Edit,
  Trash2,
  Calendar,
  UtensilsCrossed,
  Receipt,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Printer,
  DollarSign,
  Tag,
  Video,
  Eye,
  RefreshCw,
  Search,
} from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Modal from "../components/common/Modal";
import { useBooking } from "../context/BookingContext";
import { formatCurrency, formatDate, formatDateTime } from "../utils/formatDate";
import { HOTEL_INFO } from "../utils/initialData";

export const AdminDashboardPage = () => {
  const {
    hotelInfo,
    categories,
    rooms,
    foodItems,
    bookings,
    orders,
    bills,
    updateCategory,
    addCategory,
    addRoom,
    updateRoom,
    deleteRoom,
    updateRoomStatus,
    createBooking,
    checkInGuest,
    cancelBooking,
    placeOrder,
    updateOrderStatus,
    calculateCheckoutFolio,
    finalizeCheckout,
    resetDemoData,
  } = useBooking();

  // Active Tab
  const [activeTab, setActiveTab] = useState("overview"); // overview | categories | rooms | bookings | orders | billing

  // Feature 1 State: Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    code: "",
    basePrice: 2000,
    description: "",
    bedType: "King Bed",
    updateExistingRooms: true,
  });

  // Feature 2 State: Room Registration Modal
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({
    roomNumber: "",
    category: categories[0]?.name || "Standard Room",
    floor: 1,
    pricePerNight: 2000,
    bedType: "1 King Bed",
    maxGuests: 2,
    roomSize: "300 sq.ft",
    view: "Garden View",
    amenities: "High-speed Wi-Fi, Air Conditioning, Attached Bathroom",
    images: "/images/room1.jpeg",
    videoUrl: "",
    description: "Comfortable and spacious room with modern amenities.",
    status: "available",
  });

  // Feature 3 State: Walk-in Booking Modal
  const [isWalkinModalOpen, setIsWalkinModalOpen] = useState(false);
  const [walkinForm, setWalkinForm] = useState({
    roomId: rooms[0]?.id || "",
    fullName: "",
    phone: "",
    email: "",
    idCardNumber: "",
    address: "",
    checkInDate: new Date().toISOString().split("T")[0],
    checkOutDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    paymentMethod: "cash",
    advancePaid: 0,
    specialRequests: "",
  });

  // Feature 4 State: New Room Order Modal
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    roomNumber: "102",
    foodItemId: foodItems[0]?.id || "",
    quantity: 1,
    specialInstructions: "",
  });

  // Feature 5 State: Automated Billing / Checkout Modal
  const [selectedBookingForCheckout, setSelectedBookingForCheckout] = useState(null);
  const [checkoutFolio, setCheckoutFolio] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({
    extraCharges: 0,
    extraChargesDescription: "",
    discount: 0,
    paymentMethod: "cash",
    amountPaid: 0,
    notes: "Thank you for staying at Kalika Hotel & Lodge!",
  });
  const [activeInvoice, setActiveInvoice] = useState(null);

  // KPIs
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
  const cleaningRooms = rooms.filter((r) => r.status === "cleaning").length;
  const availableRooms = rooms.filter((r) => r.status === "available").length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const activeOrdersCount = orders.filter((o) => o.status === "pending" || o.status === "preparing").length;

  // Handlers for Feature 1 (Category Price Setting)
  const openCategoryEdit = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      code: cat.code,
      basePrice: cat.basePrice,
      description: cat.description,
      bedType: cat.bedType,
      updateExistingRooms: true,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(
        editingCategory.id,
        {
          name: categoryForm.name,
          basePrice: Number(categoryForm.basePrice),
          description: categoryForm.description,
          bedType: categoryForm.bedType,
        },
        categoryForm.updateExistingRooms
      );
    } else {
      addCategory({
        name: categoryForm.name,
        code: categoryForm.code || categoryForm.name.slice(0, 3).toUpperCase(),
        basePrice: Number(categoryForm.basePrice),
        description: categoryForm.description,
        bedType: categoryForm.bedType,
        defaultAmenities: ["High-speed Wi-Fi", "Attached Bathroom", "24/7 Hot Water"],
        image: "/images/room1.jpeg",
      });
    }
    setIsCategoryModalOpen(false);
  };

  // Handlers for Feature 2 (Room Registration)
  const openAddRoom = () => {
    setEditingRoom(null);
    setRoomForm({
      roomNumber: `${rooms.length + 101}`,
      category: categories[0]?.name || "Standard Room",
      floor: 1,
      pricePerNight: categories[0]?.basePrice || 2000,
      bedType: "1 King Bed",
      maxGuests: 2,
      roomSize: "320 sq.ft",
      view: "City View",
      amenities: "High-speed Wi-Fi, Air Conditioning, Attached Bathroom, 24/7 Hot Water",
      images: "/images/room2.jpeg",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Well lit room with luxury bedding, work desk and bathroom amenities.",
      status: "available",
    });
    setIsRoomModalOpen(true);
  };

  const openEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      roomNumber: room.roomNumber,
      category: room.category,
      floor: room.floor,
      pricePerNight: room.pricePerNight,
      bedType: room.bedType,
      maxGuests: room.maxGuests,
      roomSize: room.roomSize,
      view: room.view,
      amenities: Array.isArray(room.amenities) ? room.amenities.join(", ") : room.amenities,
      images: Array.isArray(room.images) ? room.images[0] : room.images,
      videoUrl: room.videoUrl || "",
      description: room.description,
      status: room.status,
    });
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = (e) => {
    e.preventDefault();
    if (editingRoom) {
      updateRoom(editingRoom.id, {
        ...roomForm,
        pricePerNight: Number(roomForm.pricePerNight),
        floor: Number(roomForm.floor),
        maxGuests: Number(roomForm.maxGuests),
        images: [roomForm.images],
        amenities: roomForm.amenities.split(",").map((s) => s.trim()),
      });
    } else {
      addRoom({
        ...roomForm,
        images: [roomForm.images],
        amenities: roomForm.amenities.split(",").map((s) => s.trim()),
      });
    }
    setIsRoomModalOpen(false);
  };

  // Handlers for Feature 3 (Walk-in booking)
  const handleSaveWalkin = (e) => {
    e.preventDefault();
    const selRoom = rooms.find((r) => r.id === walkinForm.roomId) || rooms[0];
    createBooking({
      roomId: selRoom.id,
      roomNumber: selRoom.roomNumber,
      roomCategory: selRoom.category,
      guest: {
        fullName: walkinForm.fullName,
        phone: walkinForm.phone,
        email: walkinForm.email,
        idCardNumber: walkinForm.idCardNumber,
        address: walkinForm.address,
      },
      bookingType: "offline_walkin",
      checkInDate: walkinForm.checkInDate,
      checkOutDate: walkinForm.checkOutDate,
      paymentMethod: walkinForm.paymentMethod,
      advancePaid: Number(walkinForm.advancePaid),
      paymentStatus: Number(walkinForm.advancePaid) > 0 ? "partially_paid" : "pending",
      specialRequests: walkinForm.specialRequests,
      autoCheckIn: true,
    });
    setIsWalkinModalOpen(false);
  };

  // Handlers for Feature 4 (Room Order)
  const handleSaveRoomOrder = (e) => {
    e.preventDefault();
    const item = foodItems.find((f) => f.id === orderForm.foodItemId) || foodItems[0];
    placeOrder({
      roomNumber: orderForm.roomNumber,
      items: [
        {
          foodItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: Number(orderForm.quantity),
          notes: orderForm.specialInstructions,
        },
      ],
      specialInstructions: orderForm.specialInstructions,
    });
    setIsNewOrderModalOpen(false);
  };

  // Handlers for Feature 5 (Checkout & Automated Billing)
  const startCheckoutForBooking = (booking) => {
    setSelectedBookingForCheckout(booking);
    const folio = calculateCheckoutFolio(booking);
    setCheckoutFolio(folio);
    setCheckoutForm({
      extraCharges: 0,
      extraChargesDescription: "",
      discount: 0,
      paymentMethod: "cash",
      amountPaid: folio.balanceDue,
      notes: "Thank you for staying at Kalika Hotel & Lodge!",
    });
  };

  const handleFinalizeCheckout = (e) => {
    e.preventDefault();
    if (!selectedBookingForCheckout) return;

    const newBill = finalizeCheckout({
      bookingId: selectedBookingForCheckout.bookingId,
      extraCharges: checkoutForm.extraCharges,
      extraChargesDescription: checkoutForm.extraChargesDescription,
      discount: checkoutForm.discount,
      paymentMethod: checkoutForm.paymentMethod,
      amountPaidAtCheckout: checkoutForm.amountPaid,
      notes: checkoutForm.notes,
    });

    setActiveInvoice(newBill);
    setSelectedBookingForCheckout(null);
    setCheckoutFolio(null);
  };

  return (
    <div className="pt-24 pb-20 bg-stone-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Reset Demo Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-200 text-amber-900 border border-amber-300">
                Staff & Admin Portal
              </span>
              <span className="text-xs text-stone-500">• {HOTEL_INFO.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display-luxury text-stone-900 mt-1">
              Guest House Booking Management
            </h1>
            <p className="text-xs text-stone-600">
              Implements all required features: Room Categories, Room Registration (Photos & Videos), Online/Offline Bookings, Order Tracking, and Auto-Billing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm("Reset all room data and bookings to initial demonstration state?")) {
                  resetDemoData();
                }
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 flex items-center gap-1.5 shadow-sm"
              title="Reset sample data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Demo
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-stone-900 text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Overview & Stats
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "categories"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            <Tag className="w-4 h-4" />
            1. Room Category & Price Setting
          </button>

          <button
            onClick={() => setActiveTab("rooms")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "rooms"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            <Building className="w-4 h-4" />
            2. Room Details & Media Registration
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "bookings"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            <Calendar className="w-4 h-4" />
            3. Online & Offline Bookings
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "orders"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            4. Room Order Tracking ({activeOrdersCount})
          </button>

          <button
            onClick={() => setActiveTab("billing")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "billing"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            <Receipt className="w-4 h-4" />
            5. Auto Checkout & Invoicing
          </button>
        </div>

        {/* ===================================================================== */}
        {/* TAB 0: OVERVIEW & STATS                                               */}
        {/* ===================================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-stone-500 uppercase">
                    Occupancy Rate
                  </span>
                  <div className="text-2xl font-bold font-display-luxury text-stone-900 mt-1">
                    {occupancyRate}%
                  </div>
                  <span className="text-[11px] text-stone-500">
                    {occupiedRooms} of {totalRooms} rooms occupied
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  {occupancyRate}%
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-stone-500 uppercase">
                    Available Rooms
                  </span>
                  <div className="text-2xl font-bold font-display-luxury text-emerald-700 mt-1">
                    {availableRooms}
                  </div>
                  <span className="text-[11px] text-stone-500">
                    Ready for check-in / booking
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-stone-500 uppercase">
                    Pending Room Orders
                  </span>
                  <div className="text-2xl font-bold font-display-luxury text-amber-700 mt-1">
                    {activeOrdersCount}
                  </div>
                  <span className="text-[11px] text-stone-500">
                    In kitchen / room delivery
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-stone-500 uppercase">
                    Total Invoices Generated
                  </span>
                  <div className="text-2xl font-bold font-display-luxury text-stone-900 mt-1">
                    {bills.length}
                  </div>
                  <span className="text-[11px] text-stone-500">
                    Automated checkout folios
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                  <Receipt className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Live Grid of All Rooms */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    Live Room Occupancy Status
                  </h3>
                  <p className="text-xs text-stone-500">
                    Real-time front desk room rack with direct status management.
                  </p>
                </div>
                <Button size="sm" variant="gold" icon={PlusCircle} onClick={openAddRoom}>
                  Register Room
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                {rooms.map((r) => {
                  const getBg = () => {
                    if (r.status === "occupied") return "border-amber-400 bg-amber-50/70";
                    if (r.status === "cleaning") return "border-blue-400 bg-blue-50/70";
                    return "border-emerald-400 bg-emerald-50/60";
                  };

                  return (
                    <div
                      key={r.id}
                      className={`p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between space-y-2 ${getBg()}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-black text-stone-900">
                          #{r.roomNumber}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/90">
                          {r.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] font-medium text-stone-700 block truncate">
                          {r.category}
                        </span>
                        <span className="text-[10px] text-stone-500 font-bold block">
                          {formatCurrency(r.pricePerNight)}
                        </span>
                      </div>
                      <select
                        value={r.status}
                        onChange={(e) => updateRoomStatus(r.id, e.target.value)}
                        className="text-[10px] font-semibold bg-white border border-stone-300 rounded px-1.5 py-1 text-stone-800"
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 1: ROOM CATEGORY & COST PRICE SETTING (PROFESSOR REQUIREMENT 1)   */}
        {/* ===================================================================== */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    Room Category & Cost Price Setting
                  </h3>
                  <p className="text-xs text-stone-500">
                    Define room tiers, base rates (NPR per night), bed types, and default amenities. Updating a category price can dynamically synchronize all existing rooms in that category.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="gold"
                  icon={PlusCircle}
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({
                      name: "",
                      code: "",
                      basePrice: 2500,
                      description: "",
                      bedType: "King Bed",
                      updateExistingRooms: true,
                    });
                    setIsCategoryModalOpen(true);
                  }}
                >
                  New Category
                </Button>
              </div>

              {/* Categories Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Category Name</th>
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Base Cost / Night</th>
                      <th className="py-3 px-4">Default Bedding</th>
                      <th className="py-3 px-4">Rooms in Category</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {categories.map((cat) => {
                      const count = rooms.filter((r) => r.category === cat.name).length;
                      return (
                        <tr key={cat.id} className="hover:bg-stone-50/70">
                          <td className="py-3 px-4 font-bold text-stone-900 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            {cat.name}
                          </td>
                          <td className="py-3 px-4 font-semibold text-stone-500">
                            {cat.code}
                          </td>
                          <td className="py-3 px-4 font-bold text-amber-700 text-sm">
                            {formatCurrency(cat.basePrice)}
                          </td>
                          <td className="py-3 px-4">{cat.bedType}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-stone-100 font-semibold text-stone-800">
                              {count} rooms
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openCategoryEdit(cat)}
                            >
                              Edit Price
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: ROOM REGISTRATION & MEDIA (PROFESSOR REQUIREMENT 2)            */}
        {/* ===================================================================== */}
        {activeTab === "rooms" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    Room Details & Media Registration
                  </h3>
                  <p className="text-xs text-stone-500">
                    Register new rooms with high-resolution photos, 360°/video tour links, amenities, tariff, and descriptions.
                  </p>
                </div>
                <Button size="sm" variant="gold" icon={PlusCircle} onClick={openAddRoom}>
                  Register New Room
                </Button>
              </div>

              {/* Rooms List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Room #</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price / Night</th>
                      <th className="py-3 px-4">Bed & View</th>
                      <th className="py-3 px-4">Photos & Video</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {rooms.map((r) => (
                      <tr key={r.id} className="hover:bg-stone-50/70">
                        <td className="py-3 px-4 font-black text-stone-900">
                          #{r.roomNumber}
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-800">
                          {r.category}
                        </td>
                        <td className="py-3 px-4 font-bold text-amber-700">
                          {formatCurrency(r.pricePerNight)}
                        </td>
                        <td className="py-3 px-4">
                          <span>{r.bedType}</span>
                          <span className="text-stone-400 block text-[10px]">{r.view}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={r.images?.[0] || "/images/room1.jpeg"}
                              alt="preview"
                              className="w-8 h-8 rounded object-cover border"
                            />
                            {r.videoUrl ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                Video Tour
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-400">No Video</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={r.status}
                            onChange={(e) => updateRoomStatus(r.id, e.target.value)}
                            className="text-xs bg-stone-50 border border-stone-200 rounded px-2 py-1"
                          >
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="cleaning">Cleaning</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditRoom(r)}
                              className="p-1.5 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-stone-100"
                              title="Edit Room"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete Room #${r.roomNumber}?`)) {
                                  deleteRoom(r.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete Room"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: ONLINE & OFFLINE BOOKING MANAGEMENT (PROFESSOR REQUIREMENT 3)  */}
        {/* ===================================================================== */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    Online & Offline Walk-in Bookings
                  </h3>
                  <p className="text-xs text-stone-500">
                    Manage online website reservations and register walk-in guests at the reception desk with payment integrations.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="gold"
                  icon={PlusCircle}
                  onClick={() => {
                    const availRoom = rooms.find((r) => r.status === "available") || rooms[0];
                    setWalkinForm({
                      roomId: availRoom?.id || "",
                      fullName: "",
                      phone: "",
                      email: "",
                      idCardNumber: "",
                      address: "",
                      checkInDate: new Date().toISOString().split("T")[0],
                      checkOutDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
                      paymentMethod: "cash",
                      advancePaid: availRoom?.pricePerNight || 0,
                      specialRequests: "",
                    });
                    setIsWalkinModalOpen(true);
                  }}
                >
                  Register Walk-in Guest
                </Button>
              </div>

              {/* Bookings Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Booking ID</th>
                      <th className="py-3 px-4">Guest Info</th>
                      <th className="py-3 px-4">Room #</th>
                      <th className="py-3 px-4">Dates & Nights</th>
                      <th className="py-3 px-4">Type & Payment</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50/70">
                        <td className="py-3 px-4 font-black text-amber-800">
                          {b.bookingId}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-stone-900 block">
                            {b.guest.fullName}
                          </span>
                          <span className="text-stone-400 block text-[10px]">
                            {b.guest.phone}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900">
                          Room #{b.roomNumber}
                          <span className="text-stone-400 block text-[10px] font-normal">
                            {b.roomCategory}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span>
                            {formatDate(b.checkInDate)} - {formatDate(b.checkOutDate)}
                          </span>
                          <span className="text-stone-400 block text-[10px]">
                            {b.totalNights} Nights ({formatCurrency(b.totalRoomCharge)})
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize font-semibold text-stone-800 block">
                            {b.bookingType === "offline_walkin" ? "Walk-in" : "Online"} • {b.paymentMethod}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-medium">
                            Paid: {formatCurrency(b.advancePaid)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              b.status === "checked_in"
                                ? "bg-amber-100 text-amber-800"
                                : b.status === "confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : b.status === "checked_out"
                                ? "bg-stone-200 text-stone-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.status === "confirmed" && (
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => checkInGuest(b.id)}
                              >
                                Check In
                              </Button>
                            )}

                            {b.status === "checked_in" && (
                              <Button
                                size="sm"
                                variant="gold"
                                onClick={() => {
                                  setActiveTab("billing");
                                  startCheckoutForBooking(b);
                                }}
                              >
                                Check Out
                              </Button>
                            )}

                            {b.status === "confirmed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => cancelBooking(b.id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: ROOM TO HOTEL ORDER TRACKING (PROFESSOR REQUIREMENT 4)         */}
        {/* ===================================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    Room-to-Hotel Order Tracking & Kitchen Display
                  </h3>
                  <p className="text-xs text-stone-500">
                    Track food, beverages, and room-service orders per room. Kitchen and front desk can update tracking states in real-time. All orders automatically aggregate onto the guest's checkout folio.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="gold"
                  icon={PlusCircle}
                  onClick={() => setIsNewOrderModalOpen(true)}
                >
                  Create Room Order
                </Button>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Deliver to Room</th>
                      <th className="py-3 px-4">Ordered Items</th>
                      <th className="py-3 px-4">Special Notes</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Tracking Status</th>
                      <th className="py-3 px-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/70">
                        <td className="py-3 px-4 font-black text-amber-800">
                          {ord.orderNumber}
                          <span className="text-[10px] text-stone-400 block font-normal">
                            {formatDateTime(ord.createdAt)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-stone-900 text-sm">
                            Room #{ord.roomNumber}
                          </span>
                          <span className="text-stone-400 block text-[10px]">
                            {ord.guestName}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <ul className="space-y-0.5">
                            {ord.items.map((it, idx) => (
                              <li key={idx} className="font-medium text-stone-800">
                                • {it.name} (x{it.quantity}) - {formatCurrency(it.itemTotal)}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3 px-4 text-stone-500 italic max-w-xs truncate">
                          {ord.specialInstructions || "None"}
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900 text-sm">
                          {formatCurrency(ord.totalAmount)}
                          <span className="text-[10px] text-emerald-600 block font-normal">
                            Billed to room
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              ord.status === "pending"
                                ? "bg-amber-100 text-amber-800 animate-pulse"
                                : ord.status === "preparing"
                                ? "bg-blue-100 text-blue-800"
                                : ord.status === "delivered"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                            className="text-xs bg-stone-50 border border-stone-200 rounded px-2 py-1 font-semibold"
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="delivered">Delivered to Room</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 5: AUTOMATIC BILLING & CHECKOUT (PROFESSOR REQUIREMENT 5)         */}
        {/* ===================================================================== */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            {/* Active Checked-In Guests Ready for Checkout */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="pb-3 border-b border-stone-100">
                <h3 className="font-bold text-stone-900 text-base">
                  Feature 5: Automatic Billing of Customer Expenses Upon Checkout
                </h3>
                <p className="text-xs text-stone-500">
                  Select any checked-in guest room. The system automatically computes room night charges, pulls all dining & room-service food orders, applies 13% VAT, deducts advance payments, and generates a printable invoice.
                </p>
              </div>

              {/* Active Guests List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings
                  .filter((b) => b.status === "checked_in")
                  .map((b) => {
                    const folio = calculateCheckoutFolio(b);
                    return (
                      <div
                        key={b.id}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                          selectedBookingForCheckout?.id === b.id
                            ? "border-amber-600 bg-amber-50/40 shadow-md"
                            : "border-stone-200 bg-white hover:border-amber-400"
                        }`}
                        onClick={() => startCheckoutForBooking(b)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-amber-800">
                              {b.bookingId}
                            </span>
                            <h4 className="text-base font-bold text-stone-900">
                              Room #{b.roomNumber} ({b.roomCategory})
                            </h4>
                            <p className="text-xs text-stone-600 font-medium">
                              Guest: {b.guest.fullName} ({b.guest.phone})
                            </p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                            Active Stay
                          </span>
                        </div>

                        <div className="bg-stone-50 p-3 rounded-xl text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-stone-500">Stay Duration:</span>
                            <span className="font-semibold text-stone-800">
                              {folio?.nights} nights ({formatCurrency(folio?.roomCharges)})
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500">Room Orders:</span>
                            <span className="font-semibold text-amber-700">
                              {folio?.orders.length} orders ({formatCurrency(folio?.totalOrdersAmount)})
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-stone-200 pt-1 font-bold">
                            <span>Balance Due:</span>
                            <span className="text-stone-900">
                              {formatCurrency(folio?.balanceDue)}
                            </span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="gold"
                          onClick={(e) => {
                            e.stopPropagation();
                            startCheckoutForBooking(b);
                          }}
                          className="w-full text-xs font-bold"
                        >
                          Calculate Folio & Checkout
                        </Button>
                      </div>
                    );
                  })}
              </div>

              {bookings.filter((b) => b.status === "checked_in").length === 0 && (
                <div className="p-8 text-center bg-stone-50 rounded-xl text-stone-500 text-xs">
                  No active checked-in rooms at the moment. Use the "3. Bookings" tab to check in a guest or register a walk-in!
                </div>
              )}
            </div>

            {/* Live Folio Calculation Card if Selected */}
            {selectedBookingForCheckout && checkoutFolio && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                  <div>
                    <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
                      Automated Checkout Bill Computation
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-display-luxury text-stone-900">
                      Room #{checkoutFolio.roomNumber} - {checkoutFolio.guest.fullName}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Folio breakdown for Booking {checkoutFolio.booking.bookingId}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block uppercase font-bold">
                      Calculated Balance Due
                    </span>
                    <span className="text-2xl font-black text-amber-700 font-display-luxury">
                      {formatCurrency(
                        Math.max(
                          0,
                          checkoutFolio.subtotal +
                            Number(checkoutForm.extraCharges) -
                            Number(checkoutForm.discount) +
                            Math.round(
                              ((checkoutFolio.subtotal +
                                Number(checkoutForm.extraCharges) -
                                Number(checkoutForm.discount)) *
                                checkoutFolio.taxRate) /
                                100
                            ) -
                            checkoutFolio.advancePaid
                        )
                      )}
                    </span>
                  </div>
                </div>

                {/* Itemized Breakdown Table */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Itemized Expenses Aggregation:
                  </h4>

                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 divide-y divide-stone-200/80 text-xs">
                    {/* Room tariff */}
                    <div className="py-2.5 flex justify-between items-center">
                      <div>
                        <strong className="text-stone-900 block">
                          Room Tariff ({checkoutFolio.roomCategory})
                        </strong>
                        <span className="text-stone-500">
                          {checkoutFolio.nights} nights × {formatCurrency(checkoutFolio.roomRate)}
                        </span>
                      </div>
                      <span className="font-bold text-stone-900 text-sm">
                        {formatCurrency(checkoutFolio.roomCharges)}
                      </span>
                    </div>

                    {/* Dining orders */}
                    {checkoutFolio.orders.map((ord, idx) => (
                      <div key={idx} className="py-2.5 flex justify-between items-center">
                        <div>
                          <strong className="text-stone-900 block">
                            Room Service {ord.orderNumber}
                          </strong>
                          <span className="text-stone-500">
                            {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                          </span>
                        </div>
                        <span className="font-bold text-stone-900 text-sm">
                          {formatCurrency(ord.totalAmount)}
                        </span>
                      </div>
                    ))}

                    {/* Extras Input */}
                    <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <label className="text-[11px] font-bold text-stone-600 block mb-1">
                          Extra Charges Description (Laundry, Damage, Minibar):
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Laundry service 2 shirts"
                          value={checkoutForm.extraChargesDescription}
                          onChange={(e) =>
                            setCheckoutForm({
                              ...checkoutForm,
                              extraChargesDescription: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-stone-600 block mb-1">
                          Extra Charges Amount (NPR):
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={checkoutForm.extraCharges}
                          onChange={(e) =>
                            setCheckoutForm({
                              ...checkoutForm,
                              extraCharges: Math.max(0, Number(e.target.value)),
                            })
                          }
                          className="w-full bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900"
                        />
                      </div>
                    </div>

                    {/* Discount Input */}
                    <div className="py-2.5 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <label className="text-stone-700 font-bold">
                          Special Discount (NPR):
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={checkoutForm.discount}
                          onChange={(e) =>
                            setCheckoutForm({
                              ...checkoutForm,
                              discount: Math.max(0, Number(e.target.value)),
                            })
                          }
                          className="w-28 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-900 font-semibold"
                        />
                      </div>
                      <span className="text-rose-600 font-semibold">
                        - {formatCurrency(checkoutForm.discount)}
                      </span>
                    </div>

                    {/* Tax & Totals */}
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="text-stone-600">
                        Subtotal (Room + Dining + Extras - Discount):
                      </span>
                      <span className="font-semibold text-stone-900">
                        {formatCurrency(
                          Math.max(
                            0,
                            checkoutFolio.subtotal +
                              Number(checkoutForm.extraCharges) -
                              Number(checkoutForm.discount)
                          )
                        )}
                      </span>
                    </div>

                    <div className="py-2.5 flex justify-between items-center">
                      <span className="text-stone-600">
                        VAT ({HOTEL_INFO.vatRate}% Government Tax):
                      </span>
                      <span className="font-semibold text-stone-900">
                        {formatCurrency(
                          Math.round(
                            (Math.max(
                              0,
                              checkoutFolio.subtotal +
                                Number(checkoutForm.extraCharges) -
                                Number(checkoutForm.discount)
                            ) *
                              HOTEL_INFO.vatRate) /
                              100
                          )
                        )}
                      </span>
                    </div>

                    {checkoutFolio.advancePaid > 0 && (
                      <div className="py-2.5 flex justify-between items-center text-emerald-700 font-semibold">
                        <span>Advance / Online Payment Deducted:</span>
                        <span>- {formatCurrency(checkoutFolio.advancePaid)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Finalize Checkout Form */}
                <form
                  onSubmit={handleFinalizeCheckout}
                  className="bg-stone-900 text-stone-100 p-6 rounded-2xl space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-amber-400 block mb-1">
                        Settlement Payment Method:
                      </label>
                      <select
                        value={checkoutForm.paymentMethod}
                        onChange={(e) =>
                          setCheckoutForm({
                            ...checkoutForm,
                            paymentMethod: e.target.value,
                          })
                        }
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="cash">Cash at Front Desk</option>
                        <option value="esewa">eSewa QR / Wallet</option>
                        <option value="khalti">Khalti Pay</option>
                        <option value="card">Credit / Debit Card</option>
                        <option value="bank_transfer">Bank QR Transfer</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-amber-400 block mb-1">
                        Amount Collected Now (NPR):
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={checkoutForm.amountPaid}
                        onChange={(e) =>
                          setCheckoutForm({
                            ...checkoutForm,
                            amountPaid: Number(e.target.value),
                          })
                        }
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      className="w-full sm:w-auto text-xs uppercase tracking-wider font-bold py-3.5"
                    >
                      Complete Checkout & Generate Official Invoice
                    </Button>
                    <button
                      type="button"
                      onClick={() => setSelectedBookingForCheckout(null)}
                      className="text-xs text-stone-400 hover:text-white px-4 py-2"
                    >
                      Cancel Selection
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Past Invoices History Table */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-bold text-stone-900 text-base">
                Completed Checkout Invoices History
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Booking Ref</th>
                      <th className="py-3 px-4">Guest</th>
                      <th className="py-3 px-4">Room #</th>
                      <th className="py-3 px-4">Stay Charges</th>
                      <th className="py-3 px-4">Dining Orders</th>
                      <th className="py-3 px-4">Grand Total</th>
                      <th className="py-3 px-4 text-right">View / Print</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {bills.map((bill) => (
                      <tr key={bill.id} className="hover:bg-stone-50/70">
                        <td className="py-3 px-4 font-black text-amber-800">
                          {bill.billNumber}
                          <span className="text-[10px] text-stone-400 block font-normal">
                            {formatDate(bill.createdAt)}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-500">
                          {bill.bookingId}
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900">
                          {bill.guest.fullName}
                        </td>
                        <td className="py-3 px-4">
                          Room #{bill.roomNumber} ({bill.nights} nights)
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {formatCurrency(bill.roomCharges)}
                        </td>
                        <td className="py-3 px-4 font-medium text-amber-700">
                          {formatCurrency(bill.totalOrdersAmount)}
                        </td>
                        <td className="py-3 px-4 font-black text-stone-900 text-sm">
                          {formatCurrency(bill.grandTotal)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            size="sm"
                            variant="secondary"
                            icon={Printer}
                            onClick={() => setActiveInvoice(bill)}
                          >
                            Invoice
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CATEGORY & PRICE SETTING (FEATURE 1)                               */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : "Create Room Category"}
        subtitle="Feature 1: Room Category & Cost Price Setting"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Super Deluxe"
            required
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
          />

          <Input
            label="Base Cost / Price per Night (NPR)"
            type="number"
            min={500}
            required
            value={categoryForm.basePrice}
            onChange={(e) => setCategoryForm({ ...categoryForm, basePrice: e.target.value })}
          />

          <Input
            label="Default Bed Type"
            placeholder="e.g. King Bed + Single Bed"
            value={categoryForm.bedType}
            onChange={(e) => setCategoryForm({ ...categoryForm, bedType: e.target.value })}
          />

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1 uppercase">
              Description
            </label>
            <textarea
              rows={2}
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, description: e.target.value })
              }
              className="w-full bg-white border border-stone-200 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
            />
          </div>

          {editingCategory && (
            <label className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={categoryForm.updateExistingRooms}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    updateExistingRooms: e.target.checked,
                  })
                }
                className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-amber-900">
                Update tariff across all existing rooms in this category
              </span>
            </label>
          )}

          <Button type="submit" variant="gold" size="md" className="w-full font-bold">
            {editingCategory ? "Update Category & Pricing" : "Save New Category"}
          </Button>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL: ROOM REGISTRATION & MEDIA (FEATURE 2)                              */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        title={editingRoom ? `Edit Room #${editingRoom.roomNumber}` : "Register New Room"}
        subtitle="Feature 2: Registration of room details with images, videos & descriptions"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveRoom} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Room Number"
              placeholder="e.g. 105"
              required
              value={roomForm.roomNumber}
              onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
            />

            <div>
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wide block mb-1.5">
                Category
              </label>
              <select
                value={roomForm.category}
                onChange={(e) => {
                  const cat = categories.find((c) => c.name === e.target.value);
                  setRoomForm({
                    ...roomForm,
                    category: e.target.value,
                    pricePerNight: cat ? cat.basePrice : roomForm.pricePerNight,
                  });
                }}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 font-semibold focus:outline-none focus:border-amber-600"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} (Rs. {c.basePrice})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Price per Night (NPR)"
              type="number"
              required
              value={roomForm.pricePerNight}
              onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Floor Number"
              type="number"
              value={roomForm.floor}
              onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
            />

            <Input
              label="Bed Arrangement"
              placeholder="e.g. 1 King Bed"
              value={roomForm.bedType}
              onChange={(e) => setRoomForm({ ...roomForm, bedType: e.target.value })}
            />

            <Input
              label="Room Size"
              placeholder="e.g. 320 sq.ft"
              value={roomForm.roomSize}
              onChange={(e) => setRoomForm({ ...roomForm, roomSize: e.target.value })}
            />
          </div>

          <Input
            label="Room Photo Image URL"
            placeholder="e.g. /images/room2.jpeg or web URL"
            required
            value={roomForm.images}
            onChange={(e) => setRoomForm({ ...roomForm, images: e.target.value })}
            helperText="Can use /images/room1.jpeg, /images/room2.jpeg, /images/room3.jpeg or any online image"
          />

          <Input
            label="Video Tour Embed URL (YouTube or MP4)"
            placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
            value={roomForm.videoUrl}
            onChange={(e) => setRoomForm({ ...roomForm, videoUrl: e.target.value })}
            helperText="Provides guests with a 360°/video walkthrough of the room"
          />

          <Input
            label="Amenities (Comma Separated)"
            placeholder="High-speed Wi-Fi, Air Conditioning, TV, Attached Bathroom"
            value={roomForm.amenities}
            onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
          />

          <div>
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wide block mb-1.5">
              Room Description & House Notes
            </label>
            <textarea
              rows={2}
              value={roomForm.description}
              onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
              className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
            />
          </div>

          <Button type="submit" variant="gold" size="md" className="w-full font-bold">
            {editingRoom ? "Save Room Changes" : "Register Room to Inventory"}
          </Button>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL: OFFLINE WALK-IN BOOKING (FEATURE 3)                                */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isWalkinModalOpen}
        onClose={() => setIsWalkinModalOpen(false)}
        title="Reception Walk-in Guest Registration"
        subtitle="Feature 3: Offline Room Booking & Front Desk Check-in"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveWalkin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 uppercase block mb-1">
              Assign Available Room
            </label>
            <select
              value={walkinForm.roomId}
              onChange={(e) => setWalkinForm({ ...walkinForm, roomId: e.target.value })}
              className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 font-bold focus:outline-none focus:border-amber-600"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Room #{r.roomNumber} - {r.category} ({formatCurrency(r.pricePerNight)}/night) - [{r.status.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Guest Full Name"
              placeholder="e.g. Birendra Thapa"
              required
              value={walkinForm.fullName}
              onChange={(e) => setWalkinForm({ ...walkinForm, fullName: e.target.value })}
            />

            <Input
              label="Mobile Number"
              placeholder="e.g. 9800000000"
              required
              value={walkinForm.phone}
              onChange={(e) => setWalkinForm({ ...walkinForm, phone: e.target.value })}
            />

            <Input
              label="Citizenship / ID Card Number"
              placeholder="e.g. 14-02-75-00123"
              value={walkinForm.idCardNumber}
              onChange={(e) => setWalkinForm({ ...walkinForm, idCardNumber: e.target.value })}
            />

            <Input
              label="Permanent City / Address"
              placeholder="e.g. Dharan-8"
              value={walkinForm.address}
              onChange={(e) => setWalkinForm({ ...walkinForm, address: e.target.value })}
            />

            <Input
              label="Check-in Date"
              type="date"
              value={walkinForm.checkInDate}
              onChange={(e) => setWalkinForm({ ...walkinForm, checkInDate: e.target.value })}
            />

            <Input
              label="Check-out Date"
              type="date"
              value={walkinForm.checkOutDate}
              onChange={(e) => setWalkinForm({ ...walkinForm, checkOutDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 uppercase block mb-1">
                Payment Method Collected
              </label>
              <select
                value={walkinForm.paymentMethod}
                onChange={(e) =>
                  setWalkinForm({ ...walkinForm, paymentMethod: e.target.value })
                }
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs font-bold text-stone-900"
              >
                <option value="cash">Cash at Front Desk</option>
                <option value="esewa">eSewa QR</option>
                <option value="khalti">Khalti QR</option>
                <option value="card">POS Card Machine</option>
              </select>
            </div>

            <Input
              label="Advance Amount Collected (NPR)"
              type="number"
              value={walkinForm.advancePaid}
              onChange={(e) =>
                setWalkinForm({ ...walkinForm, advancePaid: Number(e.target.value) })
              }
            />
          </div>

          <Button type="submit" variant="gold" size="md" className="w-full font-bold">
            Instantly Check In Walk-in Guest & Occupy Room
          </Button>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL: CREATE ROOM SERVICE ORDER (FEATURE 4)                              */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        title="Create Room Service Order"
        subtitle="Feature 4: Room-to-Hotel Order Tracking POS"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveRoomOrder} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 uppercase block mb-1">
              Select Destination Room
            </label>
            <select
              value={orderForm.roomNumber}
              onChange={(e) => setOrderForm({ ...orderForm, roomNumber: e.target.value })}
              className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 font-bold"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.roomNumber}>
                  Room #{r.roomNumber} ({r.category} - {r.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 uppercase block mb-1">
              Menu Item
            </label>
            <select
              value={orderForm.foodItemId}
              onChange={(e) => setOrderForm({ ...orderForm, foodItemId: e.target.value })}
              className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 font-medium"
            >
              {foodItems.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.category}) - {formatCurrency(f.price)}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Quantity"
            type="number"
            min={1}
            value={orderForm.quantity}
            onChange={(e) =>
              setOrderForm({ ...orderForm, quantity: Math.max(1, Number(e.target.value)) })
            }
          />

          <Input
            label="Kitchen Preparation Instructions"
            placeholder="e.g. Extra spicy, serve warm"
            value={orderForm.specialInstructions}
            onChange={(e) =>
              setOrderForm({ ...orderForm, specialInstructions: e.target.value })
            }
          />

          <Button type="submit" variant="gold" size="md" className="w-full font-bold">
            Send Order to Kitchen & Bill to Room
          </Button>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL: OFFICIAL PRINTABLE INVOICE / RECEIPT (FEATURE 5)                   */}
      {/* ========================================================================= */}
      {activeInvoice && (
        <Modal
          isOpen={Boolean(activeInvoice)}
          onClose={() => setActiveInvoice(null)}
          title={`Official Invoice: ${activeInvoice.billNumber}`}
          subtitle="Automatic Itemized Customer Billing Receipt"
          maxWidth="max-w-2xl"
        >
          <div id="printable-invoice" className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 text-stone-900 space-y-6">
            {/* Header matching Photo 2 notes */}
            <div className="flex justify-between items-start pb-6 border-b-2 border-stone-900">
              <div>
                <h2 className="text-2xl font-bold font-display-luxury text-stone-900">
                  {HOTEL_INFO.name}
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  {HOTEL_INFO.address}
                </p>
                <p className="text-xs text-stone-800 font-bold">
                  Ph: {HOTEL_INFO.phone} • PAN/VAT: {HOTEL_INFO.panNumber}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block">
                  Tax Invoice / Receipt
                </span>
                <span className="text-lg font-black text-stone-900 block">
                  {activeInvoice.billNumber}
                </span>
                <span className="text-[11px] text-stone-500 block">
                  Date: {formatDate(activeInvoice.createdAt)}
                </span>
              </div>
            </div>

            {/* Guest & Stay Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-xl">
              <div>
                <strong className="text-stone-400 uppercase block text-[10px]">
                  Billed To Guest:
                </strong>
                <span className="text-sm font-bold text-stone-900">
                  {activeInvoice.guest.fullName}
                </span>
                <span className="block text-stone-600">Phone: {activeInvoice.guest.phone}</span>
                {activeInvoice.guest.idCardNumber && (
                  <span className="block text-stone-600">ID: {activeInvoice.guest.idCardNumber}</span>
                )}
              </div>
              <div className="text-right">
                <strong className="text-stone-400 uppercase block text-[10px]">
                  Room & Dates:
                </strong>
                <span className="text-sm font-bold text-stone-900">
                  Room #{activeInvoice.roomNumber} ({activeInvoice.roomCategory})
                </span>
                <span className="block text-stone-600">
                  Duration: {activeInvoice.nights} Nights ({formatDate(activeInvoice.checkInDate)} to {formatDate(activeInvoice.checkOutDate)})
                </span>
              </div>
            </div>

            {/* Itemized Table */}
            <div>
              <table className="w-full text-left text-xs border border-stone-200">
                <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5 text-center">Qty / Nights</th>
                    <th className="p-2.5 text-right">Unit Rate</th>
                    <th className="p-2.5 text-right">Amount (NPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  <tr>
                    <td className="p-2.5">
                      <strong>Room Accommodation Charge</strong>
                      <span className="block text-[11px] text-stone-500">
                        {activeInvoice.roomCategory} Stay
                      </span>
                    </td>
                    <td className="p-2.5 text-center">{activeInvoice.nights}</td>
                    <td className="p-2.5 text-right">{formatCurrency(activeInvoice.roomRate)}</td>
                    <td className="p-2.5 text-right font-bold">
                      {formatCurrency(activeInvoice.roomCharges)}
                    </td>
                  </tr>

                  {/* Orders */}
                  {activeInvoice.orders.map((ord, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5">
                        <strong>Room Service ({ord.orderNumber})</strong>
                        <span className="block text-[11px] text-stone-500">
                          {ord.itemsSummary}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">1</td>
                      <td className="p-2.5 text-right">{formatCurrency(ord.amount)}</td>
                      <td className="p-2.5 text-right font-bold">
                        {formatCurrency(ord.amount)}
                      </td>
                    </tr>
                  ))}

                  {/* Extra charges */}
                  {activeInvoice.extraCharges > 0 && (
                    <tr>
                      <td className="p-2.5">
                        <strong>Extra Services</strong>
                        <span className="block text-[11px] text-stone-500">
                          {activeInvoice.extraChargesDescription || "Miscellaneous hotel service"}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">1</td>
                      <td className="p-2.5 text-right">{formatCurrency(activeInvoice.extraCharges)}</td>
                      <td className="p-2.5 text-right font-bold">
                        {formatCurrency(activeInvoice.extraCharges)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-1.5 border-t border-stone-300 pt-3">
                <div className="flex justify-between">
                  <span className="text-stone-600">Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(activeInvoice.subtotal)}</span>
                </div>
                {activeInvoice.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount:</span>
                    <span>- {formatCurrency(activeInvoice.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-600">VAT ({activeInvoice.taxRate}%):</span>
                  <span className="font-semibold">{formatCurrency(activeInvoice.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-black border-t-2 border-stone-900 pt-1">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(activeInvoice.grandTotal)}</span>
                </div>
                {activeInvoice.advancePaid > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Advance Payment Deducted:</span>
                    <span>- {formatCurrency(activeInvoice.advancePaid)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-stone-800 border-t border-stone-200 pt-1">
                  <span>Settled via {activeInvoice.paymentMethod.toUpperCase()}:</span>
                  <span>{formatCurrency(activeInvoice.amountPaidAtCheckout)}</span>
                </div>
              </div>
            </div>

            {/* Footer remarks */}
            <div className="border-t border-stone-200 pt-4 text-center text-xs text-stone-500 space-y-1">
              <p className="font-semibold text-stone-800">
                Thank you for choosing {HOTEL_INFO.name}, Itahari!
              </p>
              <p className="text-[10px]">
                This is a computer generated guest house billing invoice.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 no-print">
            <Button
              variant="gold"
              size="md"
              icon={Printer}
              onClick={() => window.print()}
            >
              Print / Save PDF
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => setActiveInvoice(null)}
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboardPage;
