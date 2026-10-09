import React, { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Bed,
  Users,
  Maximize2,
  Video,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
  Clock,
  Sparkles,
  Maximize,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AmenityTag from "../components/rooms/AmenityTag";
import Button from "../components/common/Button";
import { useBooking } from "../context/BookingContext";
import { formatCurrency } from "../utils/formatDate";
import { calculateNights } from "../utils/calculateNights";
import { HOTEL_INFO } from "../utils/initialData";

export const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, bookings, setSelectedRoomForBooking, searchParams, setSearchParams } = useBooking();

  const room = rooms.find((r) => r.id === id || r.roomNumber === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Local stay dates state
  const [stayDates, setStayDates] = useState({
    checkIn: searchParams.checkIn || new Date().toISOString().split("T")[0],
    checkOut: searchParams.checkOut || new Date(Date.now() + 86400000).toISOString().split("T")[0],
    guests: searchParams.guests || 2,
  });

  const nights = calculateNights(stayDates.checkIn, stayDates.checkOut);

  // Check if room has conflicting bookings for these selected dates
  const isRoomBookedForDates = useMemo(() => {
    if (!room) return false;
    return bookings.some((b) => {
      if (b.status === "cancelled" || b.status === "checked_out") return false;
      if (b.roomId !== room.id && b.roomNumber !== room.roomNumber) return false;
      // Date overlap check
      return b.checkInDate < stayDates.checkOut && b.checkOutDate > stayDates.checkIn;
    });
  }, [bookings, room, stayDates]);

  if (!room) {
    return (
      <div className="pt-32 pb-20 text-center max-w-md mx-auto px-4">
        <h2 className="text-xl font-bold text-stone-900 mb-2 font-display-luxury">Room Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">
          The requested room does not exist or has been removed from {HOTEL_INFO.name}.
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
  const isCurrentlyAvailable = room.status === "available" && !isRoomBookedForDates;

  const estimatedRoomTotal = room.pricePerNight * nights;
  const estimatedVat = Math.round((estimatedRoomTotal * HOTEL_INFO.vatRate) / 100);
  const estimatedGrandTotal = estimatedRoomTotal + estimatedVat;

  const handleBookNow = () => {
    // Update global search params with these chosen dates
    setSearchParams((prev) => ({
      ...prev,
      checkIn: stayDates.checkIn,
      checkOut: stayDates.checkOut,
      guests: stayDates.guests,
    }));
    setSelectedRoomForBooking(room);
    navigate(`/checkout?roomId=${room.id}&checkIn=${stayDates.checkIn}&checkOut=${stayDates.checkOut}&guests=${stayDates.guests}`);
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
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
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                {room.category}
              </span>
              <span className="text-xs text-stone-500">• Floor {room.floor || 1}</span>
              <span className="text-xs text-stone-500">• Max {room.maxGuests} Guests</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display-luxury text-stone-900">
              Room #{room.roomNumber} — {room.category}
            </h1>
            <p className="text-xs text-stone-500 mt-1">{room.view} • {HOTEL_INFO.address}</p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs text-stone-500 block">Tariff per night:</span>
            <div className="text-2xl sm:text-3xl font-bold font-display-luxury text-stone-900">
              {formatCurrency(room.pricePerNight)}
              <span className="text-xs font-normal text-stone-500 ml-1">/ night + 13% VAT</span>
            </div>
          </div>
        </div>

        {/* Photo Gallery & Booking Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Photo Gallery */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-stone-900 border border-stone-200 shadow-md group">
              <img
                src={images[selectedImage] || images[0]}
                alt={`Room ${room.roomNumber}`}
                className="w-full h-full object-cover transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.src = "/images/room1.jpeg";
                }}
              />

              {/* Prev / Next overlay arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Top counter */}
              <div className="absolute top-4 right-4 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-2">
                <span>Photo {selectedImage + 1} of {images.length}</span>
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="hover:text-amber-300 transition-colors ml-1"
                  title="Expand Fullscreen"
                >
                  <Maximize className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
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
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/room1.jpeg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Video Tour Embed */}
            {room.videoUrl && (
              <div className="mt-8 bg-white border border-stone-200 rounded-3xl p-6 text-stone-900 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-amber-700" />
                  <h3 className="text-sm font-bold tracking-wider uppercase text-stone-900">
                    360° / High-Definition Video Tour
                  </h3>
                </div>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-stone-950 shadow-inner">
                  <iframe
                    src={room.videoUrl}
                    title={`Video tour of Room ${room.roomNumber}`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-[11px] text-stone-500">
                  Experience a virtual walkthrough of this room layout and interior ambience before making your reservation.
                </p>
              </div>
            )}
          </div>

          {/* Sticky Booking Sidebar with Live Date Check */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <span className="text-[11px] text-stone-400 block uppercase font-bold tracking-wider">
                    Tariff
                  </span>
                  <span className="text-2xl font-bold font-display-luxury text-stone-900">
                    {formatCurrency(room.pricePerNight)}
                  </span>
                  <span className="text-xs text-stone-500"> / night</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isCurrentlyAvailable
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {isCurrentlyAvailable ? "Available" : "Unavailable / Booked"}
                </span>
              </div>

              {/* Date selection inside sidebar */}
              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Check-in Date:
                  </label>
                  <input
                    type="date"
                    value={stayDates.checkIn}
                    onChange={(e) =>
                      setStayDates((prev) => ({ ...prev, checkIn: e.target.value }))
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Check-out Date:
                  </label>
                  <input
                    type="date"
                    value={stayDates.checkOut}
                    onChange={(e) =>
                      setStayDates((prev) => ({ ...prev, checkOut: e.target.value }))
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Number of Guests:
                  </label>
                  <select
                    value={stayDates.guests}
                    onChange={(e) =>
                      setStayDates((prev) => ({ ...prev, guests: Number(e.target.value) }))
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-600"
                  >
                    {[...Array(room.maxGuests || 2)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} Guest{i > 0 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Calculation breakdown */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>{formatCurrency(room.pricePerNight)} × {nights} night(s):</span>
                  <span>{formatCurrency(estimatedRoomTotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Govt VAT ({HOTEL_INFO.vatRate}%):</span>
                  <span>{formatCurrency(estimatedVat)}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 pt-1.5 border-t border-stone-200 text-sm">
                  <span>Estimated Total:</span>
                  <span className="text-amber-800">{formatCurrency(estimatedGrandTotal)}</span>
                </div>
              </div>

              {/* CTA button */}
              <Button
                variant="gold"
                size="lg"
                disabled={!isCurrentlyAvailable}
                onClick={handleBookNow}
                className="w-full text-xs font-bold uppercase tracking-wider py-3.5"
              >
                {isCurrentlyAvailable ? "Proceed to Reservation" : "Room Unavailable on Chosen Dates"}
              </Button>

              <div className="bg-stone-50 rounded-xl p-3 text-xs text-stone-600 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant confirmation with booking voucher</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>24/7 Front desk check-in at Itahari-9</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pay via eSewa, Khalti, Card, or at Hotel Desk</span>
                </div>
              </div>

              <div className="text-center pt-1">
                <a
                  href={`tel:${HOTEL_INFO.phone}`}
                  className="text-xs text-amber-700 hover:underline font-semibold"
                >
                  Front desk inquiry: {HOTEL_INFO.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Room Specifications & Amenities Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-sm space-y-8 mb-12">
          {/* Key Specs */}
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-display-luxury mb-4">
              Room Overview & Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-3">
                <Bed className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">
                    Bed Arrangement
                  </span>
                  <span className="text-xs font-semibold text-stone-900">
                    {room.bedType}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-3">
                <Users className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">
                    Max Capacity
                  </span>
                  <span className="text-xs font-semibold text-stone-900">
                    Up to {room.maxGuests} Guests
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-3">
                <Maximize2 className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">
                    Room Area
                  </span>
                  <span className="text-xs font-semibold text-stone-900">
                    {room.roomSize}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">
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
              Included Amenities & Hotel Services
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {room.amenities.map((amenity, idx) => (
                <AmenityTag key={idx} amenity={amenity} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevImage();
            }}
            className="absolute left-4 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
            className="absolute right-4 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-stone-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="bg-black flex items-center justify-center p-2 min-h-[350px]">
              <img
                src={images[selectedImage]}
                alt={`Room ${room.roomNumber}`}
                className="max-h-[75vh] w-auto max-w-full object-contain mx-auto"
              />
            </div>
            <div className="p-4 bg-stone-900 text-white flex items-center justify-between border-t border-white/10 text-xs">
              <span>
                Room #{room.roomNumber} ({room.category}) • Photo {selectedImage + 1} of {images.length}
              </span>
              <Button
                variant="gold"
                size="sm"
                onClick={() => {
                  setIsLightboxOpen(false);
                  handleBookNow();
                }}
              >
                Proceed to Book
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailsPage;
