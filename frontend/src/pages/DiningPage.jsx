import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  UtensilsCrossed,
  Clock,
  Coffee,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Flame,
  Search,
  ChevronRight,
  Sun,
  Leaf,
  Layers,
  MapPin,
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { formatCurrency } from "../utils/formatDate";
import { HOTEL_INFO } from "../utils/initialData";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";

export const DINING_SPACES = [
  {
    id: "garden-restaurant",
    name: "The Garden Pavilion Restaurant",
    badge: "Main Dining Hall • Air Conditioned",
    image: "/images/dining-main.jpg",
    shortDesc:
      "A sunlit, expansive restaurant hall with floor-to-ceiling sliding glass doors opening directly onto our courtyard garden. Features artisan timber dining suites, woven pendant lighting, and full climate control.",
    details:
      "Whether gathering for a hearty family breakfast or an evening celebratory feast, our main pavilion brings nature indoors. Enjoy attentive table service, freshly brewed mountain tea, and our authentic multi-dish Thakali Thali dinners in relaxed comfort.",
    highlights: [
      "Courtyard Garden View",
      "Full Climate Control (AC)",
      "Artisan Teak Timber Tables",
      "Family & Group Seating",
    ],
    hours: "07:00 AM – 10:30 PM",
  },
  {
    id: "terrace-kitchen",
    name: "Paddy-View Open Terrace Kitchen",
    badge: "Open-Air Deck • Farm Panorama",
    image: "/images/dining-terrace.jpg",
    shortDesc:
      "An airy open-concept terrace kitchen and dining counter overlooking peaceful green paddy fields. Enjoy fresh morning daylight, gentle countryside breezes, and live hot cookery.",
    details:
      "Perched over looking the expansive rural fields of Itahari, this open-air terrace is the perfect morning breakfast nook. Watch our chefs prepare steaming sel-roti, fresh eggs, and spiced tea while taking in the endless Eastern Nepal greenery.",
    highlights: [
      "Scenic Paddy Field Panorama",
      "Gentle Morning Breeze",
      "Live Khaja & Tea Counter",
      "Natural Sunlight Deck",
    ],
    hours: "06:30 AM – 09:00 PM",
  },
  {
    id: "timber-lounge",
    name: "Mezzanine Timber Lounge & Bar",
    badge: "Second Floor • Cozy Rustic Loft",
    image: "/images/dining-lounge.jpg",
    shortDesc:
      "A warm wooden mezzanine loft featuring exposed timber beams, handwoven lanterns, plush sectional couches, and artisan coffee tables for evening drinks, snacks, and casual meetings.",
    details:
      "Unwind after a journey from the nearby Buspark or a long travel day across Sunsari. With high-speed optical Wi-Fi, low acoustic noise, and comfy sofas, it is an inviting retreat for reading, remote work, or evening conversation over hot snacks.",
    highlights: [
      "Exposed Hardwood Beams",
      "Plush Sectional Sofas",
      "Warm Lantern Ambience",
      "High-Speed Wi-Fi & Lounge Bar",
    ],
    hours: "11:00 AM – 11:00 PM",
  },
  {
    id: "garden-veranda",
    name: "Veranda & Porch Garden Dining",
    badge: "Covered Porch • Garden Retreat",
    image: "/images/dining-veranda.jpg",
    shortDesc:
      "A covered outdoor wooden porch surrounded by lush hanging Boston ferns and potted flora. Furnished with heavy round log tables, timber benches, and relaxing rocking chairs.",
    details:
      "Step out onto the sheltered porch where the scent of rain and greenery fills the air. Perfect for enjoying charcoal grilled sekuwa with chiura, sipping a chilled beverage, or sharing laughter with friends in nature.",
    highlights: [
      "Sheltered Outdoor Veranda",
      "Hanging Ferns & Greenery",
      "Rustic Solid Log Furniture",
      "Peaceful Garden Atmosphere",
    ],
    hours: "07:00 AM – 10:00 PM",
  },
];

export const DiningPage = () => {
  const { foodItems, rooms, placeOrder } = useBooking();

  // Category filter for food items
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Room Order Modal
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [orderRoomNumber, setOrderRoomNumber] = useState("102");
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNotes, setOrderNotes] = useState("");
  const [orderSuccessMsg, setOrderSuccessMsg] = useState("");

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(foodItems.map((item) => item.category))];
    return cats;
  }, [foodItems]);

  const filteredItems = useMemo(() => {
    return foodItems.filter((item) => {
      const matchCat =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchSearch =
        searchTerm.trim() === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [foodItems, selectedCategory, searchTerm]);

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

    setOrderSuccessMsg(
      `Order placed for Room #${orderRoomNumber}! Added to your room bill.`
    );
    setTimeout(() => {
      setOrderSuccessMsg("");
      setIsOrderModalOpen(false);
      setSelectedFoodItem(null);
      setOrderNotes("");
    }, 1800);
  };

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      {/* ======================================================================= */}
      {/* 1. Header Banner                                                        */}
      {/* ======================================================================= */}
      <div className="bg-gradient-to-r from-amber-50 via-stone-100/80 to-amber-100/50 text-stone-900 py-14 mb-12 border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Kalika Culinary & Dining Experience</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display-luxury text-stone-900 mt-1">
            Dining, Lounges & Room Service
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-stone-600 max-w-2xl mx-auto mt-3 leading-relaxed">
            From our sunlit garden pavilion and open-air terrace overlooking green
            paddy fields to cozy timber lounges and 24/7 in-room delivery, enjoy
            heartwarming Nepalese hospitality.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs font-semibold">
            <a
              href="#spaces"
              className="px-4 py-2 rounded-full bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition-colors"
            >
              Explore Dining Spaces
            </a>
            <a
              href="#menu"
              className="px-4 py-2 rounded-full bg-white text-stone-800 border border-stone-200 hover:border-amber-400 hover:bg-amber-50 shadow-xs transition-colors"
            >
              Browse Food Menu
            </a>
            <Link
              to="/admin"
              className="px-4 py-2 rounded-full bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors inline-flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Kitchen Order Tracking</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* ===================================================================== */}
        {/* 2. Dining Spaces Showcase (User's 4 Photos)                           */}
        {/* ===================================================================== */}
        <section id="spaces" className="space-y-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">
              Curated Ambience
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display-luxury text-stone-900 mt-1">
              Our Dining Spaces & Atmosphere
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Each space is thoughtfully designed with natural woods, open daylight,
              and verdant garden views to offer a serene dining retreat.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {DINING_SPACES.map((space) => (
              <div
                key={space.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all flex flex-col group"
              >
                {/* Photo container */}
                <div className="relative aspect-[16/11] overflow-hidden bg-stone-100">
                  <img
                    src={space.image}
                    alt={space.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-800 border border-amber-200 shadow-xs">
                    {space.badge}
                  </div>
                  {/* Hours */}
                  <div className="absolute top-4 right-4 bg-stone-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white shadow-xs flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{space.hours}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-bold font-display-luxury text-stone-900 group-hover:text-amber-800 transition-colors">
                      {space.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {space.shortDesc}
                    </p>
                    <p className="text-xs text-stone-500 leading-relaxed pt-1">
                      {space.details}
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="pt-4 border-t border-stone-100">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2.5">
                      Space Highlights:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs text-stone-700">
                      {space.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-medium">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 3. In-Room Dining Banner Callout (Feature 4 Requirement)              */}
        {/* ===================================================================== */}
        <section className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold tracking-widest text-amber-200 uppercase">
              Feature 4 • Room-to-Hotel Service
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display-luxury">
              Staying in Our Rooms? Order Directly to Your Door
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl leading-relaxed">
              Guests can order meals, hot tea, and evening snacks straight to their room.
              All orders are digitally tracked to your room folio and billed automatically upon checkout.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="#menu"
              className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-stone-900 hover:bg-stone-100 shadow-md transition-all font-sans"
            >
              Order Food Now
            </a>
            <a
              href={`tel:${HOTEL_INFO.phone}`}
              className="px-5 py-3 rounded-full text-xs font-semibold text-white bg-amber-900/60 hover:bg-amber-900/80 border border-white/20 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Front Desk Dial</span>
            </a>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 4. Complete Food & Beverage Menu                                      */}
        {/* ===================================================================== */}
        <section id="menu" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">
                Chef's Selections
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display-luxury text-stone-900 mt-1">
                Food & Beverage Menu
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Freshly cooked to order with local Himalayan spices and sanitized ingredients.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search food, momo, sekuwa..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-xs"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-white text-stone-600 border border-stone-200 hover:border-amber-300 hover:text-amber-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
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

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-stone-900 text-sm group-hover:text-amber-700 transition-colors">
                        {item.name}
                      </h3>
                      {item.isVeg && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded font-semibold shrink-0">
                          VEG
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
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

          {filteredItems.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500">
              <UtensilsCrossed className="w-10 h-10 mx-auto text-stone-400 mb-3" />
              <p className="text-sm font-semibold">No food items found matching your filter.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchTerm("");
                }}
                className="mt-3 text-xs font-bold text-amber-700 hover:underline"
              >
                Reset Menu Filters
              </button>
            </div>
          )}
        </section>

        {/* ===================================================================== */}
        {/* 5. Culinary Standards & Dining Hours Info                             */}
        {/* ===================================================================== */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-stone-900 text-base">
              Fresh Local Ingredients
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              We source organic mountain lentils, local basmati rice, seasonal greens,
              and authentic Jimbu herbs directly from Eastern Nepal farmers.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-stone-900 text-base">
              24-Hour Room Service
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Arriving late from the Buspark or catching an early morning vehicle? Our kitchen operates
              hot tea, quick snacks, and in-room dining round the clock.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-stone-900 text-base">
              Hygiene & RO Water
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every dish is prepared under strict hygiene standards using multistage RO purified water
              and sanitized stainless steel equipment.
            </p>
          </div>
        </section>
      </div>

      {/* ======================================================================= */}
      {/* 6. Room Order Modal (Feature 4)                                         */}
      {/* ======================================================================= */}
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
              <p className="text-xs text-stone-500">
                The kitchen has started preparing your order.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePlaceRoomOrder} className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
                <img
                  src={selectedFoodItem.image}
                  alt={selectedFoodItem.name}
                  className="w-16 h-14 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    {selectedFoodItem.name}
                  </h4>
                  <p className="text-xs text-amber-700 font-semibold">
                    {formatCurrency(selectedFoodItem.price)} each
                  </p>
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
                  onChange={(e) =>
                    setOrderQuantity(Math.max(1, Number(e.target.value)))
                  }
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

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full font-bold"
              >
                Confirm Order to Room #{orderRoomNumber}
              </Button>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default DiningPage;
