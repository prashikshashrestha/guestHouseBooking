import React, { useState } from "react";
import {
  Settings,
  Building,
  User,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";

export const AdminSettingsView = () => {
  const { hotelInfo, updateHotelInfo, resetDemoData } = useBooking();
  const { user, updateProfile, changePassword } = useAuth();

  const [activeTab, setActiveTab] = useState("hotel"); // hotel | account | system

  // Hotel Info Form State
  const [hotelForm, setHotelForm] = useState({
    name: hotelInfo.name || "Kalika Hotel & Lodge",
    subtitle: hotelInfo.subtitle || "Guest House & Boutique Lodge",
    tagline: hotelInfo.tagline || "",
    address: hotelInfo.address || "",
    phone: hotelInfo.phone || "9842042150",
    altPhone: hotelInfo.altPhone || "",
    email: hotelInfo.email || "",
    panNumber: hotelInfo.panNumber || "",
    vatRate: hotelInfo.vatRate || 13,
    checkInTime: hotelInfo.checkInTime || "12:00 PM",
    checkOutTime: hotelInfo.checkOutTime || "11:00 AM",
  });

  // Account Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "Receptionist Admin",
    email: user?.email || "admin@kalikahotel.com",
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Toast / Feedback states
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const showNotification = (msg, isErr = false) => {
    if (isErr) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(""), 4000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  // Handle Save Hotel Info
  const handleSaveHotel = (e) => {
    e.preventDefault();
    updateHotelInfo(hotelForm);
    showNotification("Hotel identity and policies updated successfully!");
  };

  // Handle Save Profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: profileForm.name,
      email: profileForm.email,
    });
    showNotification("Admin profile information saved successfully!");
  };

  // Handle Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification("New passwords do not match.", true);
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showNotification("Administrative password updated successfully!");
    } catch (err) {
      showNotification(err.message || "Failed to update password.", true);
    }
  };

  // Handle Reset System Demo Data
  const handleConfirmReset = () => {
    resetDemoData();
    setIsResetConfirmOpen(false);
    showNotification("Demonstration database reset to factory state.");
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Settings size={22} className="text-amber-600" />
            <span>Hotel Policies & Administration Settings</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure hotel property information, fiscal tax rates, front desk credentials, and system options.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setActiveTab("hotel")}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "hotel" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-500"
            }`}
          >
            <Building size={14} className="text-amber-600" />
            <span>Hotel Profile</span>
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "account" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-500"
            }`}
          >
            <User size={14} className="text-amber-600" />
            <span>Account & Security</span>
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "system" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-500"
            }`}
          >
            <RefreshCw size={14} className="text-amber-600" />
            <span>System Reset</span>
          </button>
        </div>
      </div>

      {/* Global Toast Feedback */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-semibold animate-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800 font-semibold animate-in slide-in-from-top-2">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ================= TAB 1: HOTEL PROFILE ================= */}
      {activeTab === "hotel" && (
        <form onSubmit={handleSaveHotel} className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-5 text-xs">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-stone-900">Hotel Information & Fiscal Registration</h3>
            <p className="text-stone-500 text-[11px] mt-0.5">
              These details appear on customer invoices, reservation emails, website footers, and vouchers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Hotel Legal / Trade Name *
              </label>
              <input
                type="text"
                required
                value={hotelForm.name}
                onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Subtitle / Business Classification
              </label>
              <input
                type="text"
                value={hotelForm.subtitle}
                onChange={(e) => setHotelForm({ ...hotelForm, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Promotional Tagline
              </label>
              <input
                type="text"
                value={hotelForm.tagline}
                onChange={(e) => setHotelForm({ ...hotelForm, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Property Address (City & Province) *
              </label>
              <input
                type="text"
                required
                value={hotelForm.address}
                onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Primary Front Desk Phone *
              </label>
              <input
                type="text"
                required
                value={hotelForm.phone}
                onChange={(e) => setHotelForm({ ...hotelForm, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Secondary Landline / Helpline
              </label>
              <input
                type="text"
                value={hotelForm.altPhone}
                onChange={(e) => setHotelForm({ ...hotelForm, altPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Official Reservations Email *
              </label>
              <input
                type="email"
                required
                value={hotelForm.email}
                onChange={(e) => setHotelForm({ ...hotelForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                PAN / VAT Registration Number
              </label>
              <input
                type="text"
                value={hotelForm.panNumber}
                onChange={(e) => setHotelForm({ ...hotelForm, panNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                VAT Rate Percentage (%)
              </label>
              <input
                type="number"
                min="0"
                max="25"
                value={hotelForm.vatRate}
                onChange={(e) => setHotelForm({ ...hotelForm, vatRate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Check-in Time
                </label>
                <input
                  type="text"
                  value={hotelForm.checkInTime}
                  onChange={(e) => setHotelForm({ ...hotelForm, checkInTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Check-out Time
                </label>
                <input
                  type="text"
                  value={hotelForm.checkOutTime}
                  onChange={(e) => setHotelForm({ ...hotelForm, checkOutTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0c2317] hover:bg-[#143825] text-amber-300 font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Save size={15} className="text-amber-400" />
              <span>Save Hotel Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* ================= TAB 2: ACCOUNT & SECURITY ================= */}
      {activeTab === "account" && (
        <div className="space-y-6">
          {/* Admin Profile */}
          <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4 text-xs">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">Administrator Profile</h3>
              <p className="text-stone-500 text-[11px] mt-0.5">
                Front desk receptionist identity and staff display profile.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Admin Login Email *
                </label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>

          {/* Change Password */}
          <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4 text-xs">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">Change Admin Password</h3>
              <p className="text-stone-500 text-[11px] mt-0.5">
                Ensure strong administrative password protection for hotel room records.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  New Password (min 6 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TAB 3: SYSTEM RESET ================= */}
      {activeTab === "system" && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4 text-xs">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-stone-900">Demonstration Database Maintenance</h3>
            <p className="text-stone-500 text-[11px] mt-0.5">
              Reset cached browser storage to original seed data for clean demonstrations.
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-stone-700 leading-relaxed">
            <span className="font-bold text-amber-950 block text-xs mb-1">Factory Reset Preview</span>
            This action restores all initial room definitions, categories, menus, and clean mock reservations back to the Kalika Hotel & Lodge default setup. Any test bookings or folios created in this session will be refreshed.
          </div>

          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Restore Default Demo Data</span>
          </button>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw size={24} />
            </div>
            <h3 className="text-base font-bold text-stone-900">Reset Demo Database?</h3>
            <p className="text-xs text-stone-600 mt-2">
              This will restore original initial rooms, menus, and clear test reservations.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsView;
