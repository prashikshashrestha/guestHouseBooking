import React from "react";

export const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-3 text-stone-500">
      <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-medium tracking-wide">{text}</p>
    </div>
  );
};

export default Loader;
