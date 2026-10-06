import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Bed,
  Maximize2,
  Video,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import AmenityTag from "./AmenityTag";
import RatingStars from "../common/RatingStars";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatDate";
import { useBooking } from "../../context/BookingContext";

export const RoomCard = ({ room }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const navigate = useNavigate();
  const { setSelectedRoomForBooking } = useBooking();

  const isAvailable = room.status === "available";

  const getStatusBadge = () => {
    switch (room.status) {
      case "available":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Available
          </span>
        );
      case "occupied":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-white shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Occupied
          </span>
        );
      case "cleaning":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500 text-white shadow-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Cleaning
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-stone-500 text-white">
            {room.status}
          </span>
        );
    }
  };

  const handleBookNow = () => {
    setSelectedRoomForBooking(room);
    navigate(`/checkout?roomId=${room.id}`);
  };

  const currentImage =
    room.images && room.images.length > 0
      ? room.images[activeImageIndex] || room.images[0]
      : "/images/room1.jpeg";

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
        {/* Room Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
          <img
            src={currentImage}
            alt={`Room ${room.roomNumber} - ${room.category}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = "/images/room1.jpeg";
            }}
          />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {getStatusBadge()}
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-stone-900/80 backdrop-blur-md text-amber-300 border border-amber-400/30">
              Room #{room.roomNumber}
            </span>
          </div>

          {/* Video tour button trigger */}
          {room.videoUrl && (
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-400 hover:text-white hover:bg-amber-600 transition-colors shadow-md group/video"
              title="Watch Room Video Tour"
            >
              <Video className="w-4 h-4" />
            </button>
          )}

          {/* Bottom gradient with category and price */}
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-stone-950/90 via-stone-950/50 to-transparent flex items-end justify-between text-white">
            <div>
              <p className="text-xs font-medium text-amber-300 tracking-wider uppercase">
                {room.category}
              </p>
              <p className="text-xs text-stone-300">{room.view}</p>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-white font-display-luxury">
                {formatCurrency(room.pricePerNight)}
              </span>
              <span className="text-[10px] text-stone-300 ml-1">/ night</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            {/* Specs row */}
            <div className="flex items-center gap-4 text-xs text-stone-600 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4 text-stone-400" />
                <span>{room.bedType}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-stone-400" />
                <span>Max {room.maxGuests} Guests</span>
              </div>
              <div className="flex items-center gap-1">
                <Maximize2 className="w-4 h-4 text-stone-400" />
                <span>{room.roomSize}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-stone-600 line-clamp-2 mt-3 leading-relaxed">
              {room.description}
            </p>

            {/* Amenities preview */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {room.amenities.slice(0, 3).map((amenity, idx) => (
                <AmenityTag key={idx} amenity={amenity} />
              ))}
              {room.amenities.length > 3 && (
                <span className="text-[11px] text-stone-400 self-center ml-1 font-medium">
                  +{room.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
            <Link
              to={`/rooms/${room.id}`}
              className="flex-1 py-2 px-3 text-center rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              Details
            </Link>
            <Button
              variant="primary"
              size="sm"
              disabled={!isAvailable}
              onClick={handleBookNow}
              className="flex-1"
            >
              {isAvailable ? "Book Room" : "Unavailable"}
            </Button>
          </div>
        </div>
      </div>

      {/* Video Tour Modal (Feature 2: Images & Videos) */}
      <Modal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title={`Video Tour: Room #${room.roomNumber} (${room.category})`}
        subtitle="Experience the room ambience and amenities in video"
        maxWidth="max-w-3xl"
      >
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
          {room.videoUrl ? (
            <iframe
              src={room.videoUrl}
              title={`Video tour of Room ${room.roomNumber}`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-6 text-center">
              <Video className="w-12 h-12 text-stone-600 mb-2" />
              <p className="text-sm font-medium">Video preview loading or direct video tour</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
          <p>
            Category: <strong>{room.category}</strong> • Bed: {room.bedType} • Rate: {formatCurrency(room.pricePerNight)}
          </p>
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              setIsVideoModalOpen(false);
              handleBookNow();
            }}
          >
            Proceed to Book
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default RoomCard;
