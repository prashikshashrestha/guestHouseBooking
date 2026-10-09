import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  UtensilsCrossed,
  CheckCircle2,
  Sparkles,
  Phone,
  Car,
} from "lucide-react";
import { HOTEL_INFO, HOTEL_FACILITIES } from "../utils/initialData";
import Button from "../components/common/Button";

export const AboutPage = () => {
  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-stone-100/90 to-amber-100/50 text-stone-900 py-14 mb-12 border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold tracking-widest text-amber-800 uppercase">
            Nepalese Warmth & Contemporary Comfort
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display-luxury text-stone-900 mt-1">
            About Kalika Hotel & Lodge
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto mt-2 leading-relaxed">
            A tranquil hospitality destination located at <strong>Itahari-9 Buspark</strong>, providing restful stays, honest Nepalese warmth, and around-the-clock service.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Story & Introduction Section with Visuals */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">
                Our Story
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-display-luxury text-stone-900 mt-1 leading-snug">
                Restful Sanctuary at Eastern Nepal’s Bus Transit Gateway
              </h2>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              Kalika Hotel & Lodge was founded to offer weary long-distance travelers, business professionals, and visiting families a genuinely comfortable and trustworthy haven in Itahari.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              Positioned conveniently next to the <strong>Itahari-9 Buspark</strong>, our guests never have to navigate complicated transit routes or endure noisy streets. Step through our gates into a serene environment with clean air-conditioned rooms, quiet courtyard gardens, and freshly prepared local Thakali dishes.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm text-center">
                <span className="text-2xl sm:text-3xl font-black text-amber-700 font-display-luxury block">
                  24/7
                </span>
                <span className="text-[11px] font-bold text-stone-500 uppercase">
                  Front Desk Care
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm text-center">
                <span className="text-2xl sm:text-3xl font-black text-amber-700 font-display-luxury block">
                  100%
                </span>
                <span className="text-[11px] font-bold text-stone-500 uppercase">
                  Generator Backup
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm text-center col-span-2 sm:col-span-1">
                <span className="text-2xl sm:text-3xl font-black text-amber-700 font-display-luxury block">
                  13+
                </span>
                <span className="text-[11px] font-bold text-stone-500 uppercase">
                  Appointed Rooms
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-stone-200/80 shadow-2xl">
              <img
                src="/images/hero.jpg"
                alt="Kalika Hotel & Lodge Frontage and Lobby"
                className="w-full h-[380px] sm:h-[460px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/dining-main.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-6 sm:p-8">
                <div className="text-white">
                  <p className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                    Itahari-9 Buspark Hub
                  </p>
                  <p className="font-display-luxury text-xl sm:text-2xl font-bold mt-1">
                    Warm hospitality, genuine care, and dependable service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values: Why Choose Us */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">
              Our Hospitality Pillars
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display-luxury text-stone-900">
              Why Guests Choose Kalika Hotel & Lodge
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              We focus on the essential comforts that turn an ordinary transit stay into a rejuvenating retreat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Sanitized & Fresh</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hospital-grade linen hygiene, spotless attached bathrooms, and meticulous room turn-down service before each check-in.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Unbroken 24h Power</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Heavy-duty silent generator kicks in instantly, guaranteeing air conditioning, lights, and hot geysers at all hours.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">In-House Dining</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Taste fresh mountain Thakali Thali, grilled sekuwa, and breakfast cooked live, delivered right to your door with room order billing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Fenced Buspark Parking</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Guarded and monitored vehicle parking on-site. Walk to morning bus terminals in two minutes without rush or traffic.
              </p>
            </div>
          </div>
        </section>

        {/* Facilities Grid */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">
              Comprehensive Amenities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display-luxury text-stone-900">
              Modern Hotel Facilities
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Thoughtfully engineered facilities designed to support your work, rest, and travel needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOTEL_FACILITIES.map((fac) => (
              <div
                key={fac.id}
                className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">{fac.title}</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {fac.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Location & Contact Callout Banner */}
        <section className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Convenient Location
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display-luxury">
              Located at the Crossroads of Eastern Nepal
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {HOTEL_INFO.address}. Quick connections to Dharan, Biratnagar, Birtamod, and Koshi Tappu Wildlife Reserve.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold pt-1">
              <Phone className="w-4 h-4" />
              <span>Direct Phone: {HOTEL_INFO.phone} / {HOTEL_INFO.altPhone}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link to="/rooms" className="w-full sm:w-auto">
              <Button variant="gold" size="lg" className="w-full font-bold">
                Check Room Rates & Book
              </Button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full font-bold text-white border-white/20 hover:bg-white/10">
                View Location Map
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
