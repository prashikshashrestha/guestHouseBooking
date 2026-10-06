import React from 'react';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  const stats = [
    { label: 'Rooms & Suites', value: '45+' },
    { label: 'Happy Guests', value: '12,000+' },
    { label: 'Customer Rating', value: '4.8 / 5' },
    { label: 'Years of Service', value: '8+' },
  ];

  const values = [
    {
      title: 'Comfort First',
      description: 'Handcrafted beds, premium linens, and quiet spaces designed for deep relaxation.',
      icon: (
        <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      title: 'Seamless Booking',
      description: 'Real-time room availability, instant confirmation, and flexible cancellations without hassle.',
      icon: (
        <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Dedicated Hospitality',
      description: 'Our reception and concierge team are available around the clock to support your journey.',
      icon: (
        <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* Hero Section */}
      <section className="relative py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-widest text-sky-600 font-bold bg-sky-50 px-3 py-1.5 rounded-full inline-block mb-4">
            Our Story & Vision
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-2xl mx-auto leading-tight">
            Crafting Unforgettable Stays With Modern Comfort
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Welcome to Client Portal, your premier destination for effortless reservations, 
            thoughtfully designed rooms, and warm hospitality tailored to every traveler.
          </p>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center p-3">
              <p className="text-3xl sm:text-4xl font-extrabold text-sky-600">{stat.value}</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Narrative Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Where Simple Bookings Meet High Standards
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Founded with the goal of eliminating the complexity of traditional hotel booking, 
              our guest reservation platform unites live room inventory management with 
              instant confirmations.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Whether you are visiting for a weekend escape, business trip, or family holiday, 
              we ensure clear pricing with no hidden charges, clean accommodations, and personal assistance.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-slate-200">
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80" 
              alt="Resort and Pool" 
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Why Guests Choose Us</h2>
            <p className="text-sm text-slate-500 mt-2">Every detail is designed to make your journey calm and straightforward.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100/80 hover:shadow-md transition">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-6">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-sky-600 rounded-2xl py-12 px-6 text-white shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Plan Your Next Stay?</h2>
          <p className="text-sky-100 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Browse our range of deluxe suites and garden rooms with real-time rate discounts.
          </p>
          <Link
            to="/rooms"
            className="inline-block px-7 py-3 rounded-lg text-sm font-semibold bg-white text-sky-700 hover:bg-slate-100 shadow transition"
          >
            Explore Rooms
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;