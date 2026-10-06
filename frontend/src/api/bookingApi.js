import axiosInstance from "./axiosInstance";

export const bookingApi = {
  getAllBookings: (params) => axiosInstance.get("/bookings", { params }),
  getBookingById: (id) => axiosInstance.get(`/bookings/${id}`),
  createBooking: (bookingData) => axiosInstance.post("/bookings", bookingData),
  checkInGuest: (id) => axiosInstance.patch(`/bookings/${id}/checkin`),
  cancelBooking: (id) => axiosInstance.patch(`/bookings/${id}/cancel`),
  getOrders: (params) => axiosInstance.get("/orders", { params }),
  createOrder: (orderData) => axiosInstance.post("/orders", orderData),
  updateOrderStatus: (id, status) => axiosInstance.patch(`/orders/${id}/status`, { status }),
  getCheckoutFolio: (bookingId) => axiosInstance.get(`/billing/preview/${bookingId}`),
  finalizeCheckout: (checkoutData) => axiosInstance.post("/billing/checkout", checkoutData),
  getBills: () => axiosInstance.get("/billing"),
};

export default bookingApi;
