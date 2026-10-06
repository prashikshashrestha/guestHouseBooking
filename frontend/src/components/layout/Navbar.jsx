import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { HOTEL_INFO } from "../../utils/initialData";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ROOMS", path: "/rooms" },
    { name: "DINING", path: "/dining" },
    { name: "FACILITIES", path: "/#facilities" },
    { name: "ABOUT US", path: "/#about" },
    { name: "CONTACT", path: "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled || !isHome
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/90 text-stone-800 py-3"
          : "bg-white/90 backdrop-blur-md shadow-xs border-b border-stone-200/70 text-stone-800 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-amber-500/40 bg-amber-50 flex items-center justify-center p-2 group-hover:border-amber-600 group-hover:bg-amber-100 transition-colors shadow-xs">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="w-6 h-6 text-amber-700"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display-luxury text-lg tracking-[0.2em] font-bold text-stone-900 uppercase leading-none">
                KALIKA
              </span>
              <span className="text-[10px] tracking-[0.22em] text-amber-800 uppercase font-semibold mt-0.5">
                Hotel & Lodge • Itahari
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-semibold tracking-wider">
            {navLinks.map((link) =>
              link.path.startsWith("/#") ? (
                <a
                  key={link.name}
                  href={link.path}
                  className="text-stone-700 hover:text-amber-700 transition-colors py-1 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-200 group-hover:w-full" />
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`py-1 relative group transition-colors ${
                    location.pathname === link.path
                      ? "text-amber-700 font-bold"
                      : "text-stone-700 hover:text-amber-700"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-amber-600 transition-all duration-200 ${
                      location.pathname === link.path
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              )
            )}
          </nav>

          {/* Right Action: Phone, Discreet Staff Access, BOOK NOW Button */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href={`tel:${HOTEL_INFO.phone}`}
              className="hidden xl:flex items-center gap-1.5 text-xs text-stone-600 hover:text-amber-800 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>{HOTEL_INFO.phone}</span>
            </a>

            {/* Discreet Staff Access Link moved neatly to right utility area */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-amber-800 bg-stone-100/90 hover:bg-amber-50 border border-stone-200/90 hover:border-amber-300 transition-all shadow-xs"
              title="Staff Portal: Category Pricing, Room Details, Order Tracking, Auto-Billing"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Staff Access</span>
            </Link>

            <Link
              to="/rooms"
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-600 text-white hover:bg-amber-700 transition-all duration-200 shadow-sm hover:shadow font-sans"
            >
              BOOK NOW
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 py-4 px-4 bg-white border border-stone-200 rounded-2xl shadow-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) =>
              link.path.startsWith("/#") ? (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm font-semibold tracking-wide text-stone-700 hover:text-amber-700 hover:bg-amber-50/60 rounded-xl transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 text-sm font-semibold tracking-wide rounded-xl transition-colors ${
                    location.pathname === link.path
                      ? "text-amber-800 bg-amber-50 font-bold"
                      : "text-stone-700 hover:text-amber-700 hover:bg-amber-50/60"
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
            <div className="pt-3 border-t border-stone-100 space-y-2.5">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-amber-900 bg-amber-50/80 border border-amber-200/80 rounded-xl hover:bg-amber-100 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Staff & Management Portal</span>
              </Link>
              <Link
                to="/rooms"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 text-xs font-bold uppercase tracking-wider bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm"
              >
                BOOK NOW
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
