import React from "react";

export const Button = ({
  children,
  variant = "primary", // primary, secondary, outline, danger, gold
  size = "md",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5 font-semibold",
    xl: "px-8 py-4 text-lg gap-3 font-semibold",
  };

  const variantStyles = {
    primary:
      "bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow-md shadow-amber-600/20",
    gold:
      "bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white hover:from-amber-600 hover:to-amber-800 shadow-md hover:shadow-lg shadow-amber-900/20 border border-amber-400/30",
    secondary:
      "bg-stone-800 hover:bg-stone-900 text-stone-100 hover:text-white border border-stone-700",
    outline:
      "bg-transparent border border-stone-300 dark:border-stone-700 text-stone-700 hover:bg-stone-100 hover:text-stone-900",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20",
    ghost:
      "bg-transparent hover:bg-stone-100 text-stone-600 hover:text-stone-900",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
};

export default Button;
