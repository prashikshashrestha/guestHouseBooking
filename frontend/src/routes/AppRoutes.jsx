import React from "react";
import { Routes, Route } from "react-router-dom";
import ClientLayout from "../components/layout/ClientLayout";
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
import AdminDashboardPage from "../pages/AdminDashboardPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";

export const AppRoutes = () => {
  return (
    <Routes>
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
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
