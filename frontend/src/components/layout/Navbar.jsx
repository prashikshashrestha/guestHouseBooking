import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Phone,
  ShieldCheck,
  User,
  LogOut,
  Calendar,
  LogIn,
  UserPlus,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { HOTEL_INFO } from "../../utils/initialData";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

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

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ROOMS", path: "/rooms" },
    { name: "DINING", path: "/dining" },
    { name: "GALLERY", path: "/gallery" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate("/");
  };

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
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13px] font-semibold tracking-wider">
            {navLinks.map((link) => (
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
            ))}

            {/* Authenticated My Bookings Link in desktop nav */}
            {isAuthenticated && (
              <Link
                to="/my-bookings"
                className={`py-1 relative group transition-colors ${
                  location.pathname === "/my-bookings"
                    ? "text-amber-700 font-bold"
                    : "text-stone-700 hover:text-amber-700"
                }`}
              >
                MY BOOKINGS
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-amber-600 transition-all duration-200 ${
                    location.pathname === "/my-bookings"
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            )}
          </nav>

          {/* Right Action: Auth States, Phone, Discreet Staff, BOOK NOW */}
          <div className="hidden sm:flex items-center gap-3 xl:gap-4">
            <a
              href={`tel:${HOTEL_INFO.phone}`}
              className="hidden 2xl:flex items-center gap-1.5 text-xs text-stone-600 hover:text-amber-800 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>{HOTEL_INFO.phone}</span>
            </a>

            {/* Authenticated user dropdown vs Unauthenticated Login/Register */}
            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-amber-50 hover:text-amber-800 border border-stone-200 hover:border-amber-300 transition-all shadow-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold uppercase">
                    {user?.name ? user.name[0] : "U"}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name || "Account"}</span>
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2.5 border-b border-stone-100">
                      <p className="font-bold text-stone-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                        {user?.role === "admin" ? "Staff / Admin" : "Guest Member"}
                      </span>
                    </div>

                    <Link
                      to="/my-bookings"
                      className="flex items-center gap-2 px-4 py-2.5 text-stone-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>My Bookings</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-amber-900 hover:bg-amber-50 font-semibold transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Staff Management Portal</span>
                      </Link>
                    )}

                    <div className="border-t border-stone-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-700 hover:text-amber-800 hover:bg-amber-50 border border-stone-200/90 hover:border-amber-300 transition-all shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-stone-500" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-600" />
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* Direct Book Now Button */}
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
            {navLinks.map((link) => (
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
            ))}

            {/* Auth Section in Mobile Menu */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 bg-stone-50 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-stone-900">{user?.name}</p>
                      <p className="text-[10px] text-stone-500">{user?.email}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {user?.role}
                    </span>
                  </div>

                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-amber-50 rounded-xl"
                  >
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>My Bookings</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-amber-900 bg-amber-50/80 border border-amber-200/80 rounded-xl hover:bg-amber-100"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>Staff & Management Portal</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-600" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-100 text-xs font-bold text-stone-800 hover:bg-stone-200"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-amber-600" />
                    <span>Register</span>
                  </Link>
                </div>
              )}

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
