import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Navigation,
} from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { HOTEL_INFO } from "../utils/initialData";
import { validateRequired, validateEmail, validatePhone } from "../utils/validateForm";

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Room Reservation Inquiry",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");

    const newErrors = {};
    if (!validateRequired(formData.name)) {
      newErrors.name = "Full name is required";
    }
    if (!validateRequired(formData.email)) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!validateRequired(formData.message)) {
      newErrors.message = "Message cannot be empty";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate sending contact inquiry to hotel management
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Room Reservation Inquiry",
        message: "",
      });
    }, 1000);
  };

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-stone-100/90 to-amber-100/50 text-stone-900 py-12 mb-10 border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold tracking-widest text-amber-800 uppercase">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display-luxury text-stone-900 mt-1">
            Contact & Directions
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto mt-2">
            Have questions about room availability, banquet dining, or transit buspark assistance? Our 24/7 reception desk is here for you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details & Map Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Cards */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold font-display-luxury text-stone-900 border-b border-stone-100 pb-3">
                Hotel Location & Desk
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 font-bold mb-0.5">Physical Address</strong>
                    <span className="text-stone-600 leading-relaxed block">
                      {HOTEL_INFO.name}
                      <br />
                      {HOTEL_INFO.address}
                    </span>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-amber-700">
                      Located adjacent to Itahari-9 Buspark entrance
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 font-bold mb-0.5">Direct Telephones</strong>
                    <div className="space-y-0.5">
                      <a
                        href={`tel:${HOTEL_INFO.phone}`}
                        className="text-amber-700 hover:underline font-bold block"
                      >
                        {HOTEL_INFO.phone} (Primary Front Desk)
                      </a>
                      <a
                        href={`tel:${HOTEL_INFO.altPhone}`}
                        className="text-stone-600 hover:text-amber-700 block"
                      >
                        {HOTEL_INFO.altPhone} (Landline)
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 font-bold mb-0.5">Email Inquiries</strong>
                    <a
                      href={`mailto:${HOTEL_INFO.email}`}
                      className="text-amber-700 hover:underline font-medium block"
                    >
                      {HOTEL_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 font-bold mb-0.5">Reception Hours</strong>
                    <span className="text-stone-600 block">
                      Open 24 Hours / 7 Days a Week
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      Check-in: {HOTEL_INFO.checkInTime} • Check-out: {HOTEL_INFO.checkOutTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/rooms">
                  <Button variant="gold" size="md" className="w-full font-bold">
                    Book Room Online Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-amber-600" /> Itahari Buspark Map
                </span>
                <a
                  href="https://maps.google.com/?q=Itahari+Buspark+Sunsari+Nepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-amber-700 hover:underline"
                >
                  Open in Google Maps ↗
                </a>
              </div>
              <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
                <iframe
                  title="Kalika Hotel Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14264.441407335198!2d87.2657385489729!3d26.666998982885973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6e885c2921ad%3A0xc3f6a297926b4887!2sItahari%20Bus%20Park!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Contact Message Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">
                  Send A Message
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display-luxury text-stone-900 mt-1">
                  How Can We Assist You?
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Leave a message for room reservations, bulk guest bookings, dining inquiries, or buspark assistance.
                </p>
              </div>

              {submitSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-lg font-bold font-display-luxury text-emerald-950">
                    Message Received!
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to <strong>{HOTEL_INFO.name}</strong>. Our front desk staff will review your message and respond shortly. For urgent inquiries, call <strong>{HOTEL_INFO.phone}</strong>.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-2"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="e.g. Ramesh Karki"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      error={errors.name}
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="e.g. ramesh@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      error={errors.email}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Mobile Phone Number"
                      placeholder="e.g. 9842042150"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      error={errors.phone}
                      helperText="Optional for callback"
                    />

                    <div>
                      <label className="text-xs font-semibold text-stone-700 tracking-wide uppercase block mb-1.5">
                        Inquiry Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-900 focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
                      >
                        <option value="Room Reservation Inquiry">Room Reservation Inquiry</option>
                        <option value="Group / Family Booking">Group / Family Booking</option>
                        <option value="Dining & Banquet Inquiries">Dining & Banquet Inquiries</option>
                        <option value="Buspark Arrival & Pickup">Buspark Arrival & Pickup</option>
                        <option value="Feedback & General Questions">Feedback & General Questions</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 tracking-wide uppercase block mb-1.5">
                      Your Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Write your message, expected check-in dates, or questions here..."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className={`w-full bg-stone-50 border rounded-xl p-3 text-sm text-stone-900 focus:outline-none focus:bg-white transition-colors ${
                        errors.message
                          ? "border-rose-400 focus:border-rose-500"
                          : "border-stone-200 focus:border-amber-600"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    icon={Send}
                    disabled={isSubmitting}
                    className="w-full text-xs font-bold uppercase tracking-wider py-3.5"
                  >
                    {isSubmitting ? "Sending Message..." : "Send Message to Front Desk"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
