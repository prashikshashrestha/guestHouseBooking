import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  Wallet,
  Building,
  UserCheck,
  Calendar,
  Lock,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import BookingSummaryCard from "../components/booking/BookingSummaryCard";
import DateRangePicker from "../components/booking/DateRangePicker";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";
import { calculateNights } from "../utils/calculateNights";
import { validatePhone, validateRequired, validateEmail } from "../utils/validateForm";
import { formatCurrency } from "../utils/formatDate";
import { HOTEL_INFO } from "../utils/initialData";

export const CheckoutPage = () => {
  const [urlParams] = useSearchParams();
  const navigate = useNavigate();
  const { rooms, selectedRoomForBooking, createBooking, searchParams } = useBooking();
  const { user } = useAuth();

  const initialRoomId = urlParams.get("roomId") || selectedRoomForBooking?.id || rooms[0]?.id;
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId);

  const room = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  // Booking Type (Online vs Offline Walk-in)
  const [bookingType, setBookingType] = useState("online"); // "online" or "offline_walkin"

  // Dates
  const [checkIn, setCheckIn] = useState(
    urlParams.get("checkIn") || searchParams.checkIn || new Date().toISOString().split("T")[0]
  );
  const [checkOut, setCheckOut] = useState(
    urlParams.get("checkOut") || searchParams.checkOut || new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [guests, setGuests] = useState(
    Number(urlParams.get("guests")) || searchParams.guests || 2
  );

  const nights = calculateNights(checkIn, checkOut);

  // Guest Details (auto-populate if logged in)
  const [guest, setGuest] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    idCardNumber: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setGuest((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  const [specialRequests, setSpecialRequests] = useState("");

  // Payment Integration (eSewa, Khalti, Card, Pay at Hotel)
  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [advancePaymentOption, setAdvancePaymentOption] = useState("full"); // full, partial, none
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto Check-in for walk-in front desk
  const [autoCheckIn, setAutoCheckIn] = useState(bookingType === "offline_walkin");

  useEffect(() => {
    if (bookingType === "offline_walkin") {
      setAutoCheckIn(true);
      setPaymentMethod("cash");
    } else {
      setAutoCheckIn(false);
      setPaymentMethod("esewa");
    }
  }, [bookingType]);

  const roomTotal = (room?.pricePerNight || 0) * nights;
  const vatAmount = Math.round((roomTotal * HOTEL_INFO.vatRate) / 100);
  const grandTotal = roomTotal + vatAmount;

  const calculateAdvance = () => {
    if (paymentMethod === "pay_at_hotel" || paymentMethod === "cash") return 0;
    if (advancePaymentOption === "full") return grandTotal;
    if (advancePaymentOption === "partial") return Math.round(grandTotal / 2);
    return 0;
  };

  const advancePaid = calculateAdvance();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!validateRequired(guest.fullName)) newErrors.fullName = "Guest full name is required";
    if (!validateRequired(guest.phone)) newErrors.phone = "Mobile phone number is required";
    else if (!validatePhone(guest.phone)) newErrors.phone = "Enter a valid 10-digit phone number";

    if (guest.email && !validateEmail(guest.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (checkOut <= checkIn) {
      newErrors.dates = "Check-out date must be after check-in date";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsProcessing(true);

    // Simulate payment gateway interaction for eSewa / Khalti / Card
    setTimeout(() => {
      const newBooking = createBooking({
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomCategory: room.category,
        guest,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        bookingType,
        paymentMethod,
        paymentStatus: paymentMethod === "pay_at_hotel" || paymentMethod === "cash" ? "pending" : "paid",
        advancePaid,
        specialRequests,
        autoCheckIn: bookingType === "offline_walkin" || autoCheckIn,
      });

      setIsProcessing(false);
      navigate(`/booking-success/${newBooking.bookingId}`);
    }, 1000);
  };

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to room listings</span>
          </Link>
          <span className="text-xs text-stone-500 font-medium">
            {HOTEL_INFO.name} Reservation Desk
          </span>
        </div>

        {/* 5-Step Customer Booking Progress Indicator (Section 11) */}
        <div className="mb-8 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px]">
                ✓
              </span>
              <span className="truncate">1. Stay Dates</span>
            </div>

            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px]">
                ✓
              </span>
              <span className="truncate">2. Select Room</span>
            </div>

            <div className="flex items-center gap-2 text-amber-700 font-extrabold">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-[11px] shadow-sm">
                3
              </span>
              <span className="truncate">3. Guest Info</span>
            </div>

            <div className="flex items-center gap-2 text-stone-400 font-medium">
              <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center text-[11px]">
                4
              </span>
              <span className="truncate">4. Review & Pay</span>
            </div>

            <div className="flex items-center gap-2 text-stone-400 font-medium col-span-2 sm:col-span-1 justify-center sm:justify-start">
              <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center text-[11px]">
                5
              </span>
              <span className="truncate">5. Confirmation</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">
            Hotel Reservation Checkout
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-display-luxury text-stone-900 mt-1">
            Confirm Your Reservation
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Instant digital confirmation via eSewa, Khalti, Card, or Pay upon arrival at {HOTEL_INFO.name}.
          </p>
        </div>

        {/* Booking Type Switcher */}
        <div className="bg-white p-1.5 rounded-2xl border border-stone-200/90 shadow-sm mb-8 max-w-md flex">
          <button
            type="button"
            onClick={() => setBookingType("online")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              bookingType === "online"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Online Guest Booking
          </button>
          <button
            type="button"
            onClick={() => setBookingType("offline_walkin")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              bookingType === "offline_walkin"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            Walk-in Desk Reservation
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Room & Stay Details Card */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  1. Room & Stay Dates
                </h2>

                <div className="space-y-4">
                  {/* Select Room */}
                  <div>
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wide block mb-1.5">
                      Selected Room
                    </label>
                    <select
                      value={selectedRoomId}
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 font-semibold focus:outline-none focus:border-amber-600"
                    >
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          Room #{r.roomNumber} - {r.category} ({formatCurrency(r.pricePerNight)}/night) - Status: {r.status.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dates */}
                  <DateRangePicker
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onCheckInChange={setCheckIn}
                    onCheckOutChange={setCheckOut}
                    guests={guests}
                    onGuestsChange={setGuests}
                    nights={nights}
                  />

                  {errors.dates && (
                    <p className="text-xs text-rose-600 font-medium">{errors.dates}</p>
                  )}
                </div>
              </div>

              {/* Guest Information Card (Section 12) */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-600" />
                    2. Guest Information
                  </h2>
                  {user && (
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      Auto-filled from account
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="e.g. Ramesh Karki"
                    required
                    value={guest.fullName}
                    onChange={(e) => {
                      setGuest({ ...guest, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: "" });
                    }}
                    error={errors.fullName}
                  />

                  <Input
                    label="Mobile Phone Number"
                    placeholder="e.g. 9842042150"
                    required
                    value={guest.phone}
                    onChange={(e) => {
                      setGuest({ ...guest, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: "" });
                    }}
                    error={errors.phone}
                    helperText="Required for reservation SMS voucher"
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="guest@example.com"
                    value={guest.email}
                    onChange={(e) => {
                      setGuest({ ...guest, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    error={errors.email}
                  />

                  <Input
                    label="Citizenship / ID No. (Optional)"
                    placeholder="e.g. 12-01-76-00431"
                    value={guest.idCardNumber}
                    onChange={(e) => setGuest({ ...guest, idCardNumber: e.target.value })}
                    helperText="Helpful for quick front desk check-in"
                  />

                  <div className="sm:col-span-2">
                    <Input
                      label="Home / Permanent City or Address"
                      placeholder="e.g. Biratnagar-4, Morang"
                      value={guest.address}
                      onChange={(e) => setGuest({ ...guest, address: e.target.value })}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-stone-700 tracking-wide uppercase block mb-1">
                      Special Requests / Arrival Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Arriving on 3 PM bus, quiet floor, extra blanket..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl p-3 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Integration Card */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    3. Payment Integration
                  </h2>
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
                  </span>
                </div>

                {/* Payment Methods Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* eSewa */}
                  <label
                    className={`relative p-3.5 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 transition-all ${
                      paymentMethod === "esewa"
                        ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="esewa"
                      checked={paymentMethod === "esewa"}
                      onChange={() => setPaymentMethod("esewa")}
                      className="sr-only"
                    />
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                      e
                    </div>
                    <span className="text-xs font-bold text-stone-900">eSewa</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Nepal Digital Wallet</span>
                  </label>

                  {/* Khalti */}
                  <label
                    className={`relative p-3.5 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 transition-all ${
                      paymentMethod === "khalti"
                        ? "border-purple-600 bg-purple-50/50 shadow-sm"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="khalti"
                      checked={paymentMethod === "khalti"}
                      onChange={() => setPaymentMethod("khalti")}
                      className="sr-only"
                    />
                    <div className="w-7 h-7 rounded-full bg-purple-700 text-white font-black text-xs flex items-center justify-center">
                      K
                    </div>
                    <span className="text-xs font-bold text-stone-900">Khalti</span>
                    <span className="text-[10px] text-purple-700 font-semibold">Instant Pay</span>
                  </label>

                  {/* Credit / Debit Card */}
                  <label
                    className={`relative p-3.5 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 transition-all ${
                      paymentMethod === "card"
                        ? "border-amber-600 bg-amber-50/50 shadow-sm"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="sr-only"
                    />
                    <CreditCard className="w-6 h-6 text-amber-700" />
                    <span className="text-xs font-bold text-stone-900">Card</span>
                    <span className="text-[10px] text-stone-500 font-semibold">Visa / Mastercard</span>
                  </label>

                  {/* Offline / Pay at Hotel */}
                  <label
                    className={`relative p-3.5 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 transition-all ${
                      paymentMethod === "cash" || paymentMethod === "pay_at_hotel"
                        ? "border-stone-800 bg-stone-100 shadow-sm"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={bookingType === "offline_walkin" ? "cash" : "pay_at_hotel"}
                      checked={paymentMethod === "cash" || paymentMethod === "pay_at_hotel"}
                      onChange={() =>
                        setPaymentMethod(bookingType === "offline_walkin" ? "cash" : "pay_at_hotel")
                      }
                      className="sr-only"
                    />
                    <Wallet className="w-6 h-6 text-stone-700" />
                    <span className="text-xs font-bold text-stone-900">
                      {bookingType === "offline_walkin" ? "Cash at Desk" : "Pay at Hotel"}
                    </span>
                    <span className="text-[10px] text-stone-500 font-semibold">Offline Pay</span>
                  </label>
                </div>

                {paymentMethod !== "cash" && paymentMethod !== "pay_at_hotel" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAdvancePaymentOption("full")}
                      className={`flex-1 py-2 px-3 text-xs rounded-lg border font-medium transition-all ${
                        advancePaymentOption === "full"
                          ? "border-amber-600 bg-amber-50 text-amber-900 font-semibold"
                          : "border-stone-200 text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      Pay Full ({formatCurrency(grandTotal)})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdvancePaymentOption("partial")}
                      className={`flex-1 py-2 px-3 text-xs rounded-lg border font-medium transition-all ${
                        advancePaymentOption === "partial"
                          ? "border-amber-600 bg-amber-50 text-amber-900 font-semibold"
                          : "border-stone-200 text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      Pay 50% Advance ({formatCurrency(Math.round(grandTotal / 2))})
                    </button>
                  </div>
                )}

                {/* Gateway Detail Note */}
                <div className="bg-stone-50 rounded-xl p-3.5 text-xs text-stone-600">
                  {paymentMethod === "esewa" && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>
                        eSewa Nepal gateway selected. Your advance amount of <strong>{formatCurrency(advancePaid)}</strong> will be processed instantly.
                      </span>
                    </div>
                  )}
                  {paymentMethod === "khalti" && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>
                        Khalti Digital Wallet selected. Instant confirmation voucher issued upon checkout.
                      </span>
                    </div>
                  )}
                  {paymentMethod === "card" && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>
                        International & SCT/Nepali Debit/Credit Cards accepted. Secured by 3D-Secure.
                      </span>
                    </div>
                  )}
                  {(paymentMethod === "cash" || paymentMethod === "pay_at_hotel") && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-stone-500" />
                      <span>
                        Offline reservation selected. No online payment required right now. Total bill payable at front desk.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit CTA Button */}
              <Button
                type="submit"
                variant="gold"
                size="lg"
                disabled={isProcessing}
                className="w-full text-xs font-bold uppercase tracking-wider py-4"
              >
                {isProcessing
                  ? "Processing Reservation & Voucher..."
                  : `Confirm & Reserve Room #${room.roomNumber} (${formatCurrency(advancePaid > 0 ? advancePaid : grandTotal)})`}
              </Button>
            </form>
          </div>

          {/* Right Summary Sidebar (Section 14) */}
          <div className="lg:col-span-5 space-y-6">
            <BookingSummaryCard
              room={room}
              checkIn={checkIn}
              checkOut={checkOut}
              nights={nights}
              advancePaid={advancePaid}
            />

            {/* Hotel contact badge */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 text-xs text-stone-600 space-y-2">
              <h4 className="font-bold text-stone-900">{HOTEL_INFO.name}</h4>
              <p>{HOTEL_INFO.address}</p>
              <p className="font-bold text-amber-700">Phone: {HOTEL_INFO.phone}</p>
              <p className="text-[11px] text-stone-400">PAN/VAT No: {HOTEL_INFO.panNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
