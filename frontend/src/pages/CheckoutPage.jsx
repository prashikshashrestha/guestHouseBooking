import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  CreditCard,
  Wallet,
  CheckCircle,
  AlertCircle,
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
import { calculateNights } from "../utils/calculateNights";
import { validatePhone, validateRequired } from "../utils/validateForm";
import { formatCurrency } from "../utils/formatDate";
import { HOTEL_INFO } from "../utils/initialData";

export const CheckoutPage = () => {
  const [urlParams] = useSearchParams();
  const navigate = useNavigate();
  const { rooms, selectedRoomForBooking, createBooking, searchParams } = useBooking();

  const initialRoomId = urlParams.get("roomId") || selectedRoomForBooking?.id || rooms[0]?.id;
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId);

  const room = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  // Booking Type (Online vs Offline Walk-in - Professor Req 3)
  const [bookingType, setBookingType] = useState("online"); // "online" or "offline_walkin"

  // Dates
  const [checkIn, setCheckIn] = useState(searchParams.checkIn || new Date().toISOString().split("T")[0]);
  const [checkOut, setCheckOut] = useState(
    searchParams.checkOut || new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [guests, setGuests] = useState(searchParams.guests || 2);

  const nights = calculateNights(checkIn, checkOut);

  // Guest Details
  const [guest, setGuest] = useState({
    fullName: "",
    phone: "",
    email: "",
    idCardNumber: "",
    address: "",
  });

  const [specialRequests, setSpecialRequests] = useState("");

  // Payment Integration (eSewa, Khalti, Card, Pay at Hotel - Professor Req 3)
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
    if (paymentMethod === "pay_at_hotel") return 0;
    if (advancePaymentOption === "full") return grandTotal;
    if (advancePaymentOption === "partial") return Math.round(grandTotal / 2);
    return 0;
  };

  const advancePaid = calculateAdvance();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!validateRequired(guest.fullName)) newErrors.fullName = "Guest full name is required";
    if (!validateRequired(guest.phone)) newErrors.phone = "Phone number is required";
    else if (!validatePhone(guest.phone)) newErrors.phone = "Enter a valid 10-digit phone number";

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
        paymentStatus: paymentMethod === "pay_at_hotel" ? "pending" : "paid",
        advancePaid,
        specialRequests,
        autoCheckIn: bookingType === "offline_walkin" || autoCheckIn,
      });

      setIsProcessing(false);
      navigate(`/booking-success?id=${newBooking.bookingId}`);
    }, 1200);
  };

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to rooms</span>
          </Link>
          <span className="text-xs text-stone-500 font-medium">
            Step 2 of 2: Guest Details & Payment Integration
          </span>
        </div>

        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
            Feature 3: Online / Offline Room Booking & Payment Integration
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-display-luxury text-stone-900 mt-1">
            Complete Your Reservation
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Book online with eSewa/Khalti/Card or register an offline walk-in guest at Kalika Hotel & Lodge.
          </p>
        </div>

        {/* Booking Type Switcher (Online vs Walk-in) */}
        <div className="bg-white p-2 rounded-2xl border border-stone-200/90 shadow-sm mb-8 max-w-md flex">
          <button
            type="button"
            onClick={() => setBookingType("online")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              bookingType === "online"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Online Guest Booking
          </button>
          <button
            type="button"
            onClick={() => setBookingType("offline_walkin")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              bookingType === "offline_walkin"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Building className="w-4 h-4" />
            Offline Walk-in (Front Desk)
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
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 font-semibold focus:outline-none focus:border-amber-600"
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
                </div>
              </div>

              {/* Guest Information Card */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  2. Guest Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="e.g. Ramesh Karki"
                    required
                    value={guest.fullName}
                    onChange={(e) => setGuest({ ...guest, fullName: e.target.value })}
                    error={errors.fullName}
                  />

                  <Input
                    label="Mobile Phone Number"
                    placeholder="e.g. 9842042150"
                    required
                    value={guest.phone}
                    onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                    error={errors.phone}
                  />

                  <Input
                    label="Email Address (Optional)"
                    type="email"
                    placeholder="guest@example.com"
                    value={guest.email}
                    onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                  />

                  <Input
                    label="ID / Citizenship / Passport No."
                    placeholder="e.g. 12-01-76-00431"
                    value={guest.idCardNumber}
                    onChange={(e) => setGuest({ ...guest, idCardNumber: e.target.value })}
                    helperText="Recommended for front desk verification"
                  />

                  <div className="sm:col-span-2">
                    <Input
                      label="Home / Permanent Address"
                      placeholder="e.g. Biratnagar-4, Morang"
                      value={guest.address}
                      onChange={(e) => setGuest({ ...guest, address: e.target.value })}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-stone-700 tracking-wide uppercase block mb-1">
                      Special Requests / Buspark Pickup Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Extra blanket, arriving around 3 PM by bus, quiet room..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm text-stone-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Integration Card (Professor Feature 3) */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    3. Payment Integration (Online & Offline)
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
                    <span className="text-[10px] text-stone-500 font-semibold">Offline Booking</span>
                  </label>
                </div>

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

                {/* Walk-in instant check-in checkbox */}
                {bookingType === "offline_walkin" && (
                  <label className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoCheckIn}
                      onChange={(e) => setAutoCheckIn(e.target.checked)}
                      className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-xs font-bold text-amber-900">
                      Instantly Check-in Guest & Mark Room #{room.roomNumber} as Occupied
                    </span>
                  </label>
                )}
              </div>

              {/* Submit CTA Button */}
              <Button
                type="submit"
                variant="gold"
                size="lg"
                disabled={isProcessing}
                className="w-full text-sm font-bold uppercase tracking-wider py-4"
              >
                {isProcessing
                  ? "Processing Reservation & Gateway..."
                  : `Confirm & Book Room #${room.roomNumber} (${formatCurrency(advancePaid > 0 ? advancePaid : grandTotal)})`}
              </Button>
            </form>
          </div>

          {/* Right Summary Sidebar */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
