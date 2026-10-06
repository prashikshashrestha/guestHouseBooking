import React from "react";

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = "",
  containerClassName = "",
  id,
  required,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-stone-700 tracking-wide uppercase">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-stone-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-white border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors duration-150 ${
            Icon ? "pl-10" : ""
          } ${error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-500 mt-0.5">{error}</p>}
      {helperText && !error && <p className="text-xs text-stone-500 mt-0.5">{helperText}</p>}
    </div>
  );
};

export default Input;
