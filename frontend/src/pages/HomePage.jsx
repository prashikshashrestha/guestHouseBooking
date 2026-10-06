import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Search,
  ArrowRight,
  Wifi,
  Coffee,
  Tv,
  Wind,
  Shield,
  UtensilsCrossed,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  ChevronRight,
  Video,
  CheckCircle2,
  Car,
  Zap,
} from "lucide-react";
import RoomCard from "../components/rooms/RoomCard";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { useBooking } from "../context/BookingContext";
import { HOTEL_INFO } from "../utils/initialData";
import { formatCurrency } from "../utils/formatDate";
import { DINING_SPACES } from "./DiningPage";

export const HomePage = () => {
  const navigate = useNavigate();
  const { rooms, categories, foodItems, searchParams, setSearchParams, placeOrder, bookings } = useBooking();

  // Room Order Modal for In-Room Dining (Feature 4)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [orderRoomNumber, setOrderRoomNumber] = useState("102");
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNotes, setOrderNotes] = useState("");
  const [orderSuccessMsg, setOrderSuccessMsg] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/rooms?category=${searchParams.category}`);
  };

  const handlePlaceRoomOrder = (e) => {
    e.preventDefault();
    if (!selectedFoodItem) return;

    placeOrder({
      roomNumber: orderRoomNumber,
      items: [
        {
          foodItemId: selectedFoodItem.id,
          name: selectedFoodItem.name,
          price: selectedFoodItem.price,
          quantity: orderQuantity,
          notes: orderNotes,
        },
      ],
      specialInstructions: orderNotes,
    });

    setOrderSuccessMsg(`Order placed for Room #${orderRoomNumber}! Added to room bill.`);
    setTimeout(() => {
      setOrderSuccessMsg("");
      setIsOrderModalOpen(false);
      setSelectedFoodItem(null);
      setOrderNotes("");
    }, 1800);
  };

  // 4 Featured Rooms
  const featuredRooms = rooms.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* ========================================================================= */}
      {/* HERO SECTION - Welcoming, Bright Luxury Hospitality Feel                   */}
      {/* ========================================================================= */}
      <section className="relative min-h-[90vh] flex flex-col justify-between pt-28 pb-12 overflow-hidden bg-stone-900 text-white">
        {/* Hero Background Image - Bright, inviting reception & lounge */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="Kalika Hotel & Lodge Reception"
            className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.03] scale-105 animate-in fade-in duration-1000"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85";
            }}
          />
          {/* Natural luxury warm gradients (not pitch black) */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/35 to-stone-900/40" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-stone-950/15 to-stone-950/50" />
        </div>

        {/* Central Hero Titles */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center my-auto py-16">
          {/* Welcome subtitle in cursive/serif italic */}
          <p className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl text-amber-300 italic tracking-wide mb-3 animate-in fade-in slide-in-from-top-4 duration-700 drop-shadow-md">
            Welcome to Kalika Hotel & Lodge
          </p>

          {/* Grand title "ENJOY YOUR STAY" */}
          <h1 className="font-display-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.2em] sm:tracking-[0.25em] text-white uppercase drop-shadow-2xl mb-4 animate-in fade-in zoom-in-95 duration-1000">
            ENJOY YOUR STAY
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-stone-100 max-w-2xl mx-auto font-normal tracking-wider leading-relaxed mb-8 drop-shadow">
            Located conveniently at <strong>Itahari-9 Buspark</strong>. Experience authentic Nepalese hospitality, comfortable luxury rooms, and 24/7 dining services.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 text-stone-900 font-semibold shadow-sm">
              📞 Direct Front Desk: {HOTEL_INFO.phone}
            </span>
            <span className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 text-stone-900 font-semibold shadow-sm">
              📍 Itahari-9, Sunsari, Nepal
            </span>
            <span className="px-4 py-2 rounded-full bg-amber-500/95 backdrop-blur-md text-stone-950 font-bold shadow-sm">
              ⚡ 24hr Power & Hot Geyser
            </span>
          </div>
        </div>

        {/* Floating Availability Booking Engine Bar */}
        <div className="relative z-20 max-w-5xl mx-auto w-full px-4">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/40 text-stone-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
          >
            {/* Check In */}
            <div>
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Check-in
              </label>
              <input
                type="date"
                value={searchParams.checkIn}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, checkIn: e.target.value })
                }
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-600"
              />
            </div>

            {/* Check Out */}
            <div>
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Check-out
              </label>
              <input
                type="date"
                value={searchParams.checkOut}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, checkOut: e.target.value })
                }
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-600"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Category
              </label>
              <select
                value={searchParams.category}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, category: e.target.value })
                }
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-600"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name} (Rs. {cat.basePrice.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Guests */}
            <div>
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Guests
              </label>
              <select
                value={searchParams.guests}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    guests: Number(e.target.value),
                  })
                }
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-600"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4+ Guests (Family)</option>
              </select>
            </div>

            {/* CTA Button */}
            <div>
              <Button
                type="submit"
                variant="gold"
                size="md"
                className="w-full text-xs uppercase tracking-wider font-bold py-2.5"
              >
                Check Availability
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ROOM CATEGORIES & PRICING BAR (Professor Feature 1)                       */}
      {/* ========================================================================= */}
      <section className="py-16 bg-stone-100/60 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
              Room Categories & Cost Setting
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display-luxury text-stone-900 mt-1">
              Curated Accommodations
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              From transit standard rooms to executive luxury suites with balconies overlooking Itahari.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={cat.image || "/images/room1.jpeg"}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-300 border border-amber-400/30">
                    {formatCurrency(cat.basePrice)} <span className="text-[10px] font-normal text-stone-300">/ night</span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-stone-900 text-base">{cat.name}</h3>
                    <p className="text-xs text-stone-500 mt-1">{cat.bedType} • Max {cat.maxOccupancy.adults} Adults</p>
                    <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <Link
                    to={`/rooms?category=${cat.name}`}
                    className="inline-flex items-center justify-between text-xs font-bold text-amber-700 hover:text-amber-800 pt-2 border-t border-stone-100"
                  >
                    <span>View Available Rooms</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURED ROOMS SHOWCASE (Professor Feature 2: Images, Videos, Details)    */}
      {/* ========================================================================= */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
                Featured Stays
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display-luxury text-stone-900 mt-1">
                Explore Rooms & Video Tours
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Each room is equipped with modern comfort, sanitized bedding, and fast Wi-Fi.
              </p>
            </div>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider group"
            >
              <span>View All {rooms.length} Rooms</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* IN-ROOM DINING & ORDER TRACKING (Bright, Appetite-Appealing Showcase)     */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* IN-ROOM DINING & RESTAURANT SPACES (User Photos & Ambience)               */}
      {/* ========================================================================= */}
      <section id="dining" className="py-20 bg-gradient-to-b from-stone-100/90 via-amber-50/25 to-white text-stone-900 relative overflow-hidden border-t border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">
              Culinary & Hospitality Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display-luxury text-stone-900 mt-1">
              Dining, Lounges & Room Service
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Discover our serene dining atmospheres—from open-air terrace dining overlooking green paddy fields to our sunlit garden pavilion and rustic timber loft lounge.
            </p>
          </div>

          {/* Dining Spaces Atmosphere Cards (User's 4 Photos) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DINING_SPACES.map((space) => (
              <div
                key={space.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="relative aspect-[16/11] overflow-hidden bg-stone-100">
                  <img
                    src={space.image}
                    alt={space.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-800 border border-amber-200 shadow-xs">
                    {space.badge.split("•")[0]}
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-stone-900/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold text-white shadow-xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{space.hours.split("–")[0]}</span>
                  </div>
                </div>

                <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm group-hover:text-amber-700 transition-colors">
                      {space.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {space.shortDesc}
                    </p>
                  </div>

                  <Link
                    to="/dining"
                    className="inline-flex items-center justify-between text-xs font-bold text-amber-700 hover:text-amber-800 pt-2 border-t border-stone-100 group/link"
                  >
                    <span>View Space Details</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Food Items & In-Room Ordering */}
          <div className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">
                  Feature 4 • In-Room Dining Service
                </span>
                <h3 className="text-2xl font-bold font-display-luxury text-stone-900 mt-0.5">
                  Popular Kitchen Selections
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Staying in our lodge rooms? Tap below to order straight to your room with automated checkout billing.
                </p>
              </div>

              <Link
                to="/dining"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider shrink-0"
              >
                <span>Browse Full Menu ({foodItems.length} Items)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {foodItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-[16/11] overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-amber-800 border border-amber-200 shadow-xs">
                      {item.category}
                    </div>
                    <div className="absolute top-3 right-3 bg-stone-900/90 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-xs">
                      {formatCurrency(item.price)}
                    </div>
                  </div>

                  <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm group-hover:text-amber-700 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <Button
                      variant="gold"
                      size="sm"
                      icon={UtensilsCrossed}
                      onClick={() => {
                        setSelectedFoodItem(item);
                        setIsOrderModalOpen(true);
                      }}
                      className="w-full text-xs font-bold"
                    >
                      Order to Room
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/dining"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Explore All Dining Spaces & Full Menu</span>
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-xs text-amber-800 hover:text-amber-900 font-semibold border border-amber-300/80 px-5 py-3 rounded-full bg-white hover:bg-amber-50 transition-colors shadow-xs"
            >
              <Clock className="w-4 h-4 text-amber-600" />
              <span>View Kitchen Live Order Tracking in Staff Portal</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FACILITIES & AMENITIES                                                    */}
      {/* ========================================================================= */}
      <section id="facilities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
              Guest Amenities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display-luxury text-stone-900 mt-1">
              Thoughtfully Designed Facilities
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Everything you need for a restful stay right in the transport hub of Itahari.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1">
                Buspark Proximity & Parking
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Located at Itahari-9 right beside the Buspark. Convenient walking distance with secure parking for private cars, bikes, and transit vehicles.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1">
                24/7 Room Service & Dining
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Order authentic Thakali thali, grilled sekuwa, momo, and continental breakfast directly to your room with real-time tracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Wifi className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1">
                High-Speed Optical Wi-Fi
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                High-speed dual-band Wi-Fi throughout all rooms, lounges, and restaurant areas for uninterrupted work and streaming.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1">
                24-Hour Generator Power Backup
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Continuous unhindered power with silent heavy-duty generator backup ensuring ACs, lights, and hot geysers run 24 hours.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1">
                Safe & Secure Guest Environment
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                CCTV surveillance across common areas, 24/7 reception desk assistance, electronic key card access, and luggage storage.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1">
                Instant Check-in & Automated Billing
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Streamlined walk-in and online check-in. Itemized automated invoices with eSewa, Khalti, Card, or Cash payments upon checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ABOUT US & CONTACT (Photo 2 Information)                                  */}
      {/* ========================================================================= */}
      <section id="about" className="py-20 bg-stone-100/70 border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
                  Welcome to Itahari
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-display-luxury text-stone-900 mt-1">
                  About Kalika Hotel & Lodge
                </h2>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                Nestled at the bustling crossroads of Eastern Nepal in <strong>Itahari-9, Buspark</strong>, Kalika Hotel & Lodge offers a serene haven for business travelers, families, and travelers traversing the Koshi region.
              </p>
              <p className="text-sm text-stone-600 leading-relaxed">
                With a range of well-appointed Standard, Deluxe, and Executive Suite rooms, guests enjoy tailored amenities including high-speed optical Wi-Fi, air conditioning, 24-hour hot showers, and our renowned in-house Nepali and Thakali cuisine.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <span className="text-2xl font-bold text-amber-700 font-display-luxury">24/7</span>
                  <p className="text-xs text-stone-500 mt-1">Front Desk & Security</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <span className="text-2xl font-bold text-amber-700 font-display-luxury">100%</span>
                  <p className="text-xs text-stone-500 mt-1">Power Backup & Wi-Fi</p>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div id="contact" className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-stone-900 font-display-luxury">
                Direct Contact & Inquiries
              </h3>

              <div className="space-y-4 text-sm text-stone-700">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900">Address:</strong>
                    <span>{HOTEL_INFO.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900">Phone:</strong>
                    <a href={`tel:${HOTEL_INFO.phone}`} className="hover:text-amber-700 font-bold">
                      {HOTEL_INFO.phone} (Primary Front Desk)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900">Check-In / Out:</strong>
                    <span>Check-in: {HOTEL_INFO.checkInTime} • Check-out: {HOTEL_INFO.checkOutTime}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/rooms">
                  <Button variant="gold" size="lg" className="w-full">
                    Book Your Stay Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ROOM ORDER MODAL (FEATURE 4)                                              */}
      {/* ========================================================================= */}
      {selectedFoodItem && (
        <Modal
          isOpen={isOrderModalOpen}
          onClose={() => {
            setIsOrderModalOpen(false);
            setSelectedFoodItem(null);
          }}
          title={`Order ${selectedFoodItem.name} to Room`}
          subtitle="In-Room Dining Service • Automatically tracked to your room bill"
          maxWidth="max-w-md"
        >
          {orderSuccessMsg ? (
            <div className="p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <p className="text-sm font-bold text-stone-900">{orderSuccessMsg}</p>
              <p className="text-xs text-stone-500">The kitchen has started preparing your order.</p>
            </div>
          ) : (
            <form onSubmit={handlePlaceRoomOrder} className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
                <img
                  src={selectedFoodItem.image}
                  alt={selectedFoodItem.name}
                  className="w-16 h-14 object-cover rounded-lg"
                />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">{selectedFoodItem.name}</h4>
                  <p className="text-xs text-amber-700 font-semibold">{formatCurrency(selectedFoodItem.price)} each</p>
                </div>
              </div>

              {/* Room Selector */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Deliver to Room Number:
                </label>
                <select
                  value={orderRoomNumber}
                  onChange={(e) => setOrderRoomNumber(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-amber-600 font-medium"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.roomNumber}>
                      Room #{r.roomNumber} ({r.category} - {r.status.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Quantity:
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-amber-600 font-medium"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Special Kitchen Notes (e.g. less spicy, extra tea cup):
                </label>
                <input
                  type="text"
                  placeholder="e.g. deliver hot, no onion..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              {/* Total Calculation */}
              <div className="flex justify-between items-center text-sm font-bold border-t border-stone-100 pt-3">
                <span>Total Amount:</span>
                <span className="text-amber-700 text-base">
                  {formatCurrency(selectedFoodItem.price * orderQuantity)}
                </span>
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full font-bold">
                Confirm Order to Room #{orderRoomNumber}
              </Button>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default HomePage;
