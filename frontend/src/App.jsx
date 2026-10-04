import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import AdminSidebar from './components/admin/AdminSidebar';

// Guest Pages
import HomePage from './pages/guest/HomePage';
import RoomsPage from './pages/guest/RoomsPage';
import RoomDetailsPage from './pages/guest/RoomDetailsPage';
import CheckoutPage from './pages/guest/CheckoutPage';
import BookingSuccessPage from './pages/guest/BookingSuccessPage';
import MyBookingsPage from './pages/guest/MyBookingsPage';
import AboutUsPage from './pages/guest/AboutUsPage';
import ContactPage from './pages/guest/ContactPage';
import LoginPage from './pages/guest/LoginPage';
import RegisterPage from './pages/guest/RegisterPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminRoomsPage from './pages/admin/AdminRoomsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminGuestsPage from './pages/admin/AdminGuestsPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Common
import NotFoundPage from './pages/NotFoundPage';

// Client Layout (with Navbar)
const ClientLayout = () => (
  <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
  </div>
);

// Admin Layout (without Client Navbar, separate design)
const AdminLayout = () => (
  <div className="min-h-screen flex bg-slate-100 text-slate-800">
    <AdminSidebar />
    <main className="flex-grow p-6 h-screen overflow-y-auto">
      <Outlet />
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Client Routes */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/booking-success" element={<BookingSuccessPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="rooms" element={<AdminRoomsPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="guests" element={<AdminGuestsPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;