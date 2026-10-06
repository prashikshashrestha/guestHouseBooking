import React from "react";
import { Star } from "lucide-react";

export const RatingStars = ({ rating = 5, size = "sm", count = 5 }) => {
  const sizeMap = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="flex items-center gap-0.5 text-amber-500">
      {[...Array(count)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeMap[size] || sizeMap.sm} ${
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i < rating
              ? "fill-amber-200 text-amber-400"
              : "text-stone-300"
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-stone-700">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingStars;
