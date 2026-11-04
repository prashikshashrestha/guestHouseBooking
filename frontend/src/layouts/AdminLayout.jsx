import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  Users,
  CalendarDays,
  UtensilsCrossed,
  Image as ImageIcon,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building,
  User,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const {
    hotelInfo,
    notifications,
    dismissNotification,
    clearAllNotifications,
  } = useBooking();

  const location = useLocation();
  const navigate = useNavigate();

  // Responsive state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dropdown states
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
    setIsNotificationOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Handle outside click for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Bookings", path: "/admin/bookings", icon: CalendarCheck },
    { name: "Rooms", path: "/admin/rooms", icon: BedDouble },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Availability", path: "/admin/availability", icon: CalendarDays },
    { name: "Dining Management", path: "/admin/dining", icon: UtensilsCrossed },
    { name: "Gallery Management", path: "/admin/gallery", icon: ImageIcon },
    { name: "Reports & Analytics", path: "/admin/reports", icon: BarChart3 },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  // Derive current page title from path
  const currentNav = navItems.find((item) =>
    location.pathname.startsWith(item.path)
  ) || { name: "Admin Portal", path: "/admin/dashboard" };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/admin/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    navigate(`/admin/bookings?search=${encodeURIComponent(globalSearch.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-stone-900 flex font-sans antialiased">
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#0c2317] text-white flex flex-col transition-all duration-300 ease-in-out border-r border-[#1a3828] shadow-xl ${
          mobileSidebarOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0 " +
              (isSidebarCollapsed ? "w-20" : "w-68")
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-4 flex items-center justify-between border-b border-[#1b3d2b] bg-[#091b12]">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 overflow-hidden text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-bold text-xl shadow-md shrink-0">
              K
            </div>
            {(!isSidebarCollapsed || mobileSidebarOpen) && (
              <div className="transition-opacity duration-200">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block leading-none">
                  Kalika Hotel
                </span>
                <span className="text-sm font-semibold text-stone-100 tracking-tight block mt-0.5">
                  Admin System
                </span>
              </div>
            )}
          </Link>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-stone-400 hover:text-white hover:bg-[#163826] transition-colors"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile close toggle */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#163826]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Hotel Identity Tagline */}
        {(!isSidebarCollapsed || mobileSidebarOpen) && (
          <div className="px-4 py-2.5 bg-[#0a2015] border-b border-[#163625] flex items-center justify-between text-[11px] text-amber-200/80">
            <span className="flex items-center gap-1.5 font-medium truncate">
              <Building size={12} className="text-amber-400 shrink-0" />
              {hotelInfo.address?.split(",")[0] || "Itahari-9"}, Nepal
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
              Active
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive: navActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                    navActive || isActive
                      ? "bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border border-amber-500/40 shadow-sm"
                      : "text-stone-300 hover:text-white hover:bg-[#143322]"
                  }`
                }
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <Icon
                  size={19}
                  className={`shrink-0 transition-colors ${
                    isActive ? "text-amber-400" : "text-stone-400 group-hover:text-amber-300"
                  }`}
                />
                {(!isSidebarCollapsed || mobileSidebarOpen) && (
                  <span className="truncate">{item.name}</span>
                )}

                {/* Active Indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-amber-400 rounded-r-full" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Area: Logout */}
        <div className="p-3 border-t border-[#1b3d2b] bg-[#091b12]">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:text-white hover:bg-rose-900/40 border border-transparent hover:border-rose-500/30 transition-all"
            title="Logout from Admin Dashboard"
          >
            <LogOut size={18} className="text-rose-400 shrink-0" />
            {(!isSidebarCollapsed || mobileSidebarOpen) && (
              <span className="truncate">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-68"
        }`}
      >
        {/* ================= TOP NAVIGATION BAR ================= */}
        <header className="sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile hamburger + Breadcrumbs / Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                <span>Kalika Admin</span>
                <span>/</span>
                <span className="text-amber-800 font-semibold">{currentNav.name}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight leading-tight">
                {currentNav.name}
              </h1>
            </div>
          </div>

          {/* Right: Search, Website Link, Notifications, Admin Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Bar (Quick booking finder) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center relative"
            >
              <Search
                size={16}
                className="absolute left-3 text-stone-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search bookings or guests..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-56 lg:w-72 pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-stone-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0c2317]/20 focus:border-[#0c2317] transition-all"
              />
            </form>

            {/* View Public Website */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-colors border border-stone-200/80"
              title="Open Public Customer Site in New Tab"
            >
              <ExternalLink size={13} className="text-stone-500" />
              <span>Public Site</span>
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Drawer Popover */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 bg-[#0c2317] text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell size={16} className="text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Operational Alerts ({notifications.length})
                      </span>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-amber-300 hover:text-white underline underline-offset-2"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center px-4">
                        <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                        <p className="text-xs font-semibold text-stone-800">
                          All operational tasks are clear!
                        </p>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          No pending approvals or immediate alerts right now.
                        </p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-3.5 hover:bg-stone-50 transition-colors flex items-start gap-3 text-left"
                        >
                          <div
                            className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                              notif.severity === "warning"
                                ? "bg-amber-100 text-amber-800"
                                : notif.severity === "error"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            <AlertTriangle size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-stone-900 leading-snug">
                              {notif.title}
                            </p>
                            <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                              {notif.message}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <Link
                                to={notif.link}
                                onClick={() => setIsNotificationOpen(false)}
                                className="text-[11px] font-semibold text-amber-800 hover:underline"
                              >
                                Review details &rarr;
                              </Link>
                              <button
                                onClick={() => dismissNotification(notif.id)}
                                className="text-[10px] text-stone-400 hover:text-stone-700"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-stone-100 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0c2317] to-[#1a442e] text-amber-300 font-bold flex items-center justify-center shadow-xs text-sm border border-amber-500/30">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="hidden sm:block">
                  <span className="text-xs font-bold text-stone-900 block leading-tight truncate max-w-[120px]">
                    {user?.name || "Receptionist Admin"}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-semibold block uppercase tracking-wider">
                    Hotel Administrator
                  </span>
                </div>
                <ChevronDown size={14} className="text-stone-400 hidden sm:block" />
              </button>

              {/* Profile Menu Popover */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 bg-stone-50 border-b border-stone-200">
                    <p className="text-xs font-bold text-stone-900">
                      {user?.name || "Receptionist Admin"}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">
                      {user?.email || "admin@kalikahotel.com"}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                      Administrator Access
                    </span>
                  </div>

                  <div className="p-1 text-xs font-medium text-stone-700">
                    <Link
                      to="/admin/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-800 transition-colors"
                    >
                      <Settings size={15} className="text-stone-500" />
                      <span>Hotel & Account Settings</span>
                    </Link>

                    <Link
                      to="/"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-800 transition-colors"
                    >
                      <User size={15} className="text-stone-500" />
                      <span>Switch to Guest View</span>
                    </Link>
                  </div>

                  <div className="p-1 border-t border-stone-100">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut size={15} className="text-rose-600" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================= MAIN OUTLET ================= */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1700px] w-full mx-auto">
          <Outlet />
        </main>

        {/* Admin Footer */}
        <footer className="py-4 px-6 border-t border-stone-200 text-center text-xs text-stone-500 bg-white">
          <span>&copy; {new Date().getFullYear()} {hotelInfo.name} — Hotel Management Console. All rights reserved.</span>
        </footer>
      </div>

      {/* ================= LOGOUT CONFIRMATION MODAL ================= */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogOut size={24} />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Sign Out of Admin Console?</h3>
            <p className="text-xs text-stone-600 mt-2">
              Are you sure you want to log out from the Kalika Hotel & Lodge administration system?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
