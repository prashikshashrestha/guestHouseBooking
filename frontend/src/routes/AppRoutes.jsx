import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ClientLayout from "../components/layout/ClientLayout";
import ProtectedRoute from "./ProtectedRoute";

// Client Pages
import HomePage from "../pages/HomePage";
import RoomsPage from "../pages/RoomsPage";
import RoomDetailsPage from "../pages/RoomDetailsPage";
import DiningPage from "../pages/DiningPage";
import GalleryPage from "../pages/GalleryPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import CheckoutPage from "../pages/CheckoutPage";
import BookingSuccessPage from "../pages/BookingSuccessPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";

// Admin System
import AdminLayout from "../layouts/AdminLayout";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboardView from "../pages/admin/AdminDashboardView";
import AdminBookingsView from "../pages/admin/AdminBookingsView";
import AdminRoomsView from "../pages/admin/AdminRoomsView";
import AdminCustomersView from "../pages/admin/AdminCustomersView";
import AdminAvailabilityView from "../pages/admin/AdminAvailabilityView";
import AdminDiningView from "../pages/admin/AdminDiningView";
import AdminGalleryView from "../pages/admin/AdminGalleryView";
import AdminReportsView from "../pages/admin/AdminReportsView";
import AdminSettingsView from "../pages/admin/AdminSettingsView";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= ADMIN AUTHENTICATION ================= */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* ================= ADMIN MANAGEMENT CONSOLE (PROTECTED) ================= */}
      <Route element={<ProtectedRoute requireAdmin={true} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardView />} />
          <Route path="bookings" element={<AdminBookingsView />} />
          <Route path="bookings/:id" element={<AdminBookingsView />} />
          <Route path="rooms" element={<AdminRoomsView />} />
          <Route path="rooms/add" element={<AdminRoomsView />} />
          <Route path="rooms/edit/:id" element={<AdminRoomsView />} />
          <Route path="customers" element={<AdminCustomersView />} />
          <Route path="customers/:id" element={<AdminCustomersView />} />
          <Route path="availability" element={<AdminAvailabilityView />} />
          <Route path="dining" element={<AdminDiningView />} />
          <Route path="gallery" element={<AdminGalleryView />} />
          <Route path="reports" element={<AdminReportsView />} />
          <Route path="settings" element={<AdminSettingsView />} />
        </Route>
      </Route>

      {/* ================= PUBLIC CLIENT WEBSITE ================= */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooms/:id" element={<RoomDetailsPage />} />
        <Route path="/dining" element={<DiningPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/booking-success" element={<BookingSuccessPage />} />
        <Route path="/booking-success/:id" element={<BookingSuccessPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
