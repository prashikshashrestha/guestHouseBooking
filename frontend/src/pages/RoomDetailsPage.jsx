import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Bed,
  Users,
  Maximize2,
  Video,
  ShieldCheck,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Share2,
  Clock,
  Sparkles,
} from "lucide-react";
import AmenityTag from "../components/rooms/AmenityTag";
import RatingStars from "../components/common/RatingStars";
import Button from "../components/common/Button";
import { useBooking } from "../context/BookingContext";
import { formatCurrency } from "../utils/formatDate";
import { HOTEL_INFO } from "../utils/initialData";

export const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, setSelectedRoomForBooking, searchParams, setSearchParams } = useBooking();

  const room = rooms.find((r) => r.id === id || r.roomNumber === id);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!room) {
    return (
      <div className="pt-32 pb-20 text-center max-w-md mx-auto px-4">
        <h2 className="text-xl font-bold text-stone-900 mb-2">Room Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">
          The requested room does not exist or has been removed.
        </p>
        <Link to="/rooms">
          <Button variant="primary" size="md">
            Back to All Rooms
          </Button>
        </Link>
      </div>
    );
  }

  const images = room.images && room.images.length > 0 ? room.images : ["/images/room1.jpeg"];
  const isAvailable = room.status === "available";

  const handleBookNow = () => {
    setSelectedRoomForBooking(room);
    navigate(`/checkout?roomId=${room.id}`);
  };

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to listings</span>
          </button>
          <span className="text-xs font-medium text-stone-500">
            {HOTEL_INFO.name} • Room #{room.roomNumber}
          </span>
        </div>

        {/* Room Header Info */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                {room.category}
              </span>
              <span className="text-xs text-stone-500">• Floor {room.floor}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display-luxury text-stone-900">
              Room #{room.roomNumber} - {room.category}
            </h1>
            <p className="text-xs text-stone-500 mt-1">{room.view} • {HOTEL_INFO.address}</p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs text-stone-500 block">Tariff per night:</span>
            <div className="text-2xl sm:text-3xl font-bold font-display-luxury text-stone-900">
              {formatCurrency(room.pricePerNight)}
              <span className="text-xs font-normal text-stone-500 ml-1">/ night + VAT</span>
            </div>
          </div>
        </div>

        {/* Photo Gallery & Video Tour */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Photo Gallery */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-md">
              <img
                src={images[selectedImage] || images[0]}
                alt={`Room ${room.roomNumber}`}
                className="w-full h-full object-cover transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.src = "/images/room1.jpeg";
                }}
              />
              <div className="absolute top-4 right-4 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white">
                Photo {selectedImage + 1} of {images.length}
              </div>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === idx
                        ? "border-amber-600 scale-105 shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/room1.jpeg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Video Tour Embed (Professor Req 2) */}
            {room.videoUrl && (
              <div className="mt-8 bg-white border border-stone-200 rounded-2xl p-5 text-stone-900 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Video className="w-5 h-5 text-amber-700" />
                  <h3 className="text-sm font-bold tracking-wider uppercase text-stone-900">
                    360° / High-Definition Video Tour
                  </h3>
                </div>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-stone-950 shadow-inner">
                  <iframe
                    src={room.videoUrl}
                    title={`Video tour of Room ${room.roomNumber}`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-2">
                  Take a walkthrough tour of this room before booking.
                </p>
              </div>
            )}
          </div>

          {/* Sticky Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <span className="text-xs text-stone-400 block uppercase font-bold tracking-wider">
                    Starting from
                  </span>
                  <span className="text-2xl font-bold font-display-luxury text-stone-900">
                    {formatCurrency(room.pricePerNight)}
                  </span>
                  <span className="text-xs text-stone-500"> / night</span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isAvailable
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {room.status}
                </span>
              </div>

              {/* Date selection inside sidebar */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1">
                    Check-in Date:
                  </label>
                  <input
                    type="date"
                    value={searchParams.checkIn}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, checkIn: e.target.value })
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1">
                    Check-out Date:
                  </label>
                  <input
                    type="date"
                    value={searchParams.checkOut}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, checkOut: e.target.value })
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* CTA button */}
              <Button
                variant="gold"
                size="lg"
                disabled={!isAvailable}
                onClick={handleBookNow}
                className="w-full text-sm font-bold uppercase tracking-wider"
              >
                {isAvailable ? "Proceed to Reservation" : "Room Currently Occupied"}
              </Button>

              <div className="bg-stone-50 rounded-xl p-3 text-xs text-stone-600 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant booking confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>24/7 Front desk check-in</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pay via eSewa, Khalti, Card, or Cash</span>
                </div>
              </div>

              <div className="text-center pt-2">
                <a
                  href={`tel:${HOTEL_INFO.phone}`}
                  className="text-xs text-amber-700 hover:underline font-semibold"
                >
                  Call front desk for inquiry: {HOTEL_INFO.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Room Specifications & Amenities Section */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-sm space-y-8 mb-12">
          {/* Key Specs */}
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-display-luxury mb-4">
              Room Overview & Dimensions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 flex items-center gap-3">
                <Bed className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="text-[11px] text-stone-500 block uppercase font-bold">
                    Bed Arrangement
                  </span>
                  <span className="text-xs font-semibold text-stone-900">
                    {room.bedType}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 flex items-center gap-3">
                <Users className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="text-[11px] text-stone-500 block uppercase font-bold">
                    Occupancy
                  </span>
                  <span className="text-xs font-semibold text-stone-900">
                    Up to {room.maxGuests} Guests
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 flex items-center gap-3">
                <Maximize2 className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="text-[11px] text-stone-500 block uppercase font-bold">
                    Room Area
                  </span>
                  <span className="text-xs font-semibold text-stone-900">
                    {room.roomSize}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="text-[11px] text-stone-500 block uppercase font-bold">
                    Window View
                  </span>
                  <span className="text-xs font-semibold text-stone-900">
                    {room.view}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-stone-100 pt-6">
            <h3 className="text-lg font-bold text-stone-900 font-display-luxury mb-3">
              Room Description
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* All Amenities */}
          <div className="border-t border-stone-100 pt-6">
            <h3 className="text-lg font-bold text-stone-900 font-display-luxury mb-4">
              Included Amenities & Perks
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {room.amenities.map((amenity, idx) => (
                <AmenityTag key={idx} amenity={amenity} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
