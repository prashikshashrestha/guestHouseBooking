import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from "lucide-react";
import { HOTEL_INFO } from "../../utils/initialData";

export const Footer = () => {
  return (
    <footer className="bg-stone-100/90 text-stone-700 pt-16 pb-12 border-t border-stone-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Note info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-amber-500/40 bg-amber-50 flex items-center justify-center p-2 shadow-xs">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="w-5 h-5 text-amber-700"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display-luxury text-lg tracking-widest text-stone-900 font-bold uppercase">
                  KALIKA
                </h3>
                <p className="text-[10px] tracking-widest text-amber-800 uppercase font-semibold">
                  Hotel & Lodge
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Premier guest house and lodge accommodation situated conveniently at Itahari-9, right beside the main Buspark hub. Providing exceptional comfort, dining, and hospitality.
            </p>
            <div className="pt-2">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 text-xs text-amber-800 hover:text-amber-900 transition-colors font-semibold border border-amber-300/80 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                Staff Dashboard & Billing
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-stone-600 hover:text-amber-700 transition-colors">
                  Home & Overview
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-stone-600 hover:text-amber-700 transition-colors">
                  Our Rooms & Suites
                </Link>
              </li>
              <li>
                <Link to="/dining" className="text-stone-600 hover:text-amber-700 transition-colors">
                  Dining & Room Service
                </Link>
              </li>
              <li>
                <a href="/#facilities" className="text-stone-600 hover:text-amber-700 transition-colors">
                  Amenities & Facilities
                </a>
              </li>
              <li>
                <a href="/#about" className="text-stone-600 hover:text-amber-700 transition-colors">
                  About Kalika Hotel
                </a>
              </li>
              <li>
                <Link to="/my-bookings" className="text-stone-600 hover:text-amber-700 transition-colors">
                  Lookup My Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Room Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Room Categories
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex justify-between">
                <span>Standard Room</span>
                <span className="text-amber-800 font-bold">Rs. 1,800/night</span>
              </li>
              <li className="flex justify-between">
                <span>Deluxe Room (AC)</span>
                <span className="text-amber-800 font-bold">Rs. 2,800/night</span>
              </li>
              <li className="flex justify-between">
                <span>Super Deluxe (Balcony)</span>
                <span className="text-amber-800 font-bold">Rs. 3,800/night</span>
              </li>
              <li className="flex justify-between">
                <span>Executive Suite</span>
                <span className="text-amber-800 font-bold">Rs. 5,500/night</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Location & Contact
            </h4>
            <div className="space-y-2.5 text-xs text-stone-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-stone-900">Kalika Hotel & Lodge</strong>
                  <br />
                  {HOTEL_INFO.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-700 shrink-0" />
                <a href={`tel:${HOTEL_INFO.phone}`} className="hover:text-amber-800 font-medium">
                  {HOTEL_INFO.phone} / {HOTEL_INFO.altPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-700 shrink-0" />
                <a href={`mailto:${HOTEL_INFO.email}`} className="hover:text-amber-800">
                  {HOTEL_INFO.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Front Desk: 24 Hours / 7 Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-stone-200/90 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>
            © {new Date().getFullYear()} {HOTEL_INFO.name}. All rights reserved. Registered under VAT/PAN: {HOTEL_INFO.panNumber}.
          </p>
          <div className="flex items-center gap-2">
            <span>Guest House Booking System Project</span>
            <span>•</span>
            <span className="text-amber-700 font-semibold">MERN Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
