import React from "react";
import {
  Wifi,
  Tv,
  Wind,
  Bath,
  Coffee,
  CheckCircle2,
  Maximize,
  Sparkles,
} from "lucide-react";

export const AmenityTag = ({ amenity }) => {
  const getIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("wi-fi") || lower.includes("wifi")) return <Wifi className="w-3.5 h-3.5" />;
    if (lower.includes("tv")) return <Tv className="w-3.5 h-3.5" />;
    if (lower.includes("ac") || lower.includes("air condition")) return <Wind className="w-3.5 h-3.5" />;
    if (lower.includes("bath") || lower.includes("shower")) return <Bath className="w-3.5 h-3.5" />;
    if (lower.includes("tea") || lower.includes("coffee")) return <Coffee className="w-3.5 h-3.5" />;
    if (lower.includes("balcony") || lower.includes("view")) return <Maximize className="w-3.5 h-3.5" />;
    return <Sparkles className="w-3.5 h-3.5" />;
  };

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200/80">
      <span className="text-amber-600">{getIcon(amenity)}</span>
      <span>{amenity}</span>
    </span>
  );
};

export default AmenityTag;
