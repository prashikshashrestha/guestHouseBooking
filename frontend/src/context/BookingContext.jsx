import React, { createContext, useContext, useState, useEffect } from "react";
import {
  HOTEL_INFO,
  INITIAL_CATEGORIES,
  INITIAL_ROOMS,
  INITIAL_FOOD_ITEMS,
  INITIAL_BOOKINGS,
  INITIAL_ORDERS,
  INITIAL_BILLS,
} from "../utils/initialData";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  // Load from localStorage or initial defaults
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("kalika_categories");
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem("kalika_rooms");
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [foodItems, setFoodItems] = useState(() => {
    const saved = localStorage.getItem("kalika_food_items_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const oldSaved = localStorage.getItem("kalika_food_items");
    let items = INITIAL_FOOD_ITEMS;
    if (oldSaved) {
      try {
        const parsed = JSON.parse(oldSaved);
        items = parsed.map((item) => {
          const match = INITIAL_FOOD_ITEMS.find((init) => init.id === item.id);
          if (match && match.image.startsWith("/images/")) {
            return {
              ...item,
              name: match.name,
              image: match.image,
              description: match.description,
              price: match.price || item.price,
            };
          }
          return item;
        });
      } catch (e) {}
    }
    localStorage.setItem("kalika_food_items_v2", JSON.stringify(items));
    localStorage.setItem("kalika_food_items", JSON.stringify(items));
    return items;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("kalika_bookings");
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("kalika_orders");
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem("kalika_bills");
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  // Search & Filter state for guest booking
  const [searchParams, setSearchParams] = useState({
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    guests: 2,
    category: "All",
  });

  // Selected room for active checkout flow
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("kalika_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("kalika_rooms", JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem("kalika_food_items", JSON.stringify(foodItems));
    localStorage.setItem("kalika_food_items_v2", JSON.stringify(foodItems));
  }, [foodItems]);

  // Ensure newly added local food images are applied even if old state is cached
  useEffect(() => {
    setFoodItems((prev) => {
      let changed = false;
      const updated = prev.map((item) => {
        const match = INITIAL_FOOD_ITEMS.find((init) => init.id === item.id);
        if (
          match &&
          match.image.startsWith("/images/") &&
          item.image !== match.image
        ) {
          changed = true;
          return {
            ...item,
            name: match.name,
            image: match.image,
            description: match.description,
            price: match.price || item.price,
          };
        }
        return item;
      });
      return changed ? updated : prev;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("kalika_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("kalika_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("kalika_bills", JSON.stringify(bills));
  }, [bills]);

  // FEATURE 1: Category & Price Setting
  const updateCategory = (id, updatedData, updateAllRooms = true) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updatedData } : cat))
    );

    if (updateAllRooms && updatedData.basePrice !== undefined) {
      const targetCat = categories.find((c) => c.id === id);
      if (targetCat) {
        setRooms((prev) =>
          prev.map((r) =>
            r.category === targetCat.name
              ? { ...r, pricePerNight: Number(updatedData.basePrice) }
              : r
          )
        );
      }
    }
  };

  const addCategory = (categoryData) => {
    const newCat = {
      ...categoryData,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  // FEATURE 2: Room Registration with Images & Videos & Description
  const addRoom = (roomData) => {
    const newRoom = {
      ...roomData,
      id: `room-${Date.now()}`,
      roomNumber: String(roomData.roomNumber),
      pricePerNight: Number(roomData.pricePerNight),
      status: roomData.status || "available",
      images: Array.isArray(roomData.images)
        ? roomData.images
        : [roomData.images || "/images/room1.jpeg"],
      videoUrl: roomData.videoUrl || "",
      amenities: Array.isArray(roomData.amenities)
        ? roomData.amenities
        : (roomData.amenities || "").split(",").map((s) => s.trim()),
      rating: 4.8,
    };
    setRooms((prev) => [newRoom, ...prev]);
    return newRoom;
  };

  const updateRoom = (id, updatedData) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
    );
  };

  const deleteRoom = (id) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRoomStatus = (id, status) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  // FEATURE 3: Online & Offline Room Booking & Payment Integration
  const createBooking = (bookingData) => {
    const start = new Date(bookingData.checkInDate);
    const end = new Date(bookingData.checkOutDate);
    const diffTime = Math.abs(end - start);
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const room = rooms.find((r) => r.id === bookingData.roomId || r.roomNumber === bookingData.roomNumber);
    const roomRate = room ? room.pricePerNight : Number(bookingData.roomRatePerNight || 2500);
    const totalRoomCharge = roomRate * nights;

    const isAutoCheckIn =
      bookingData.bookingType === "offline_walkin" || bookingData.autoCheckIn;

    const randId = Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id: `book-${Date.now()}`,
      bookingId: `KB-${new Date().getFullYear()}-${randId}`,
      roomId: room ? room.id : bookingData.roomId,
      roomNumber: room ? room.roomNumber : bookingData.roomNumber,
      roomCategory: room ? room.category : bookingData.roomCategory,
      guest: {
        fullName: bookingData.guest.fullName,
        phone: bookingData.guest.phone,
        email: bookingData.guest.email || "",
        idCardNumber: bookingData.guest.idCardNumber || "",
        address: bookingData.guest.address || "",
      },
      bookingType: bookingData.bookingType || "online",
      checkInDate: bookingData.checkInDate,
      checkOutDate: bookingData.checkOutDate,
      actualCheckIn: isAutoCheckIn ? new Date().toISOString() : null,
      actualCheckOut: null,
      totalNights: nights,
      roomRatePerNight: roomRate,
      totalRoomCharge,
      advancePaid: Number(bookingData.advancePaid) || 0,
      paymentMethod: bookingData.paymentMethod || "pay_at_hotel",
      paymentStatus: bookingData.paymentStatus || (bookingData.paymentMethod === "pay_at_hotel" ? "pending" : "paid"),
      status: isAutoCheckIn ? "checked_in" : "confirmed",
      specialRequests: bookingData.specialRequests || "",
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // If checked in, set room to occupied
    if (isAutoCheckIn && room) {
      updateRoomStatus(room.id, "occupied");
    }

    return newBooking;
  };

  const checkInGuest = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId || b.bookingId === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? { ...b, status: "checked_in", actualCheckIn: new Date().toISOString() }
          : b
      )
    );

    const room = rooms.find((r) => r.roomNumber === booking.roomNumber);
    if (room) {
      updateRoomStatus(room.id, "occupied");
    }
  };

  const cancelBooking = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId || b.bookingId === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, status: "cancelled" } : b))
    );

    const room = rooms.find((r) => r.roomNumber === booking.roomNumber);
    if (room && room.status === "occupied") {
      updateRoomStatus(room.id, "available");
    }
  };

  // FEATURE 4: Room to Hotel Order Tracking
  const placeOrder = ({ roomNumber, items, specialInstructions, guestName }) => {
    const activeBooking = bookings.find(
      (b) => b.roomNumber === roomNumber && b.status === "checked_in"
    );

    const calculatedTotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const randNum = Math.floor(100 + Math.random() * 900);
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${randNum}`,
      roomNumber,
      bookingId: activeBooking ? activeBooking.bookingId : null,
      guestName: guestName || (activeBooking ? activeBooking.guest.fullName : `Guest Room ${roomNumber}`),
      items: items.map((i) => ({
        ...i,
        itemTotal: Number(i.price) * Number(i.quantity),
      })),
      totalAmount: calculatedTotal,
      specialInstructions: specialInstructions || "",
      status: "pending", // pending -> preparing -> delivered -> cancelled
      isBilledToRoom: true,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  // FEATURE 5: Automatic Billing of Customer Expenses Upon Checkout
  const calculateCheckoutFolio = (bookingOrId) => {
    const booking =
      typeof bookingOrId === "string"
        ? bookings.find((b) => b.id === bookingOrId || b.bookingId === bookingOrId)
        : bookingOrId;

    if (!booking) return null;

    const start = new Date(booking.checkInDate);
    const end = new Date(booking.checkOutDate);
    const nights = Math.max(1, booking.totalNights || 1);
    const roomCharges = nights * booking.roomRatePerNight;

    // Associated room orders that are billed to room and not cancelled
    const roomOrders = orders.filter(
      (o) =>
        (o.roomNumber === booking.roomNumber || o.bookingId === booking.bookingId) &&
        o.isBilledToRoom &&
        o.status !== "cancelled"
    );

    const totalOrdersAmount = roomOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const subtotal = roomCharges + totalOrdersAmount;
    const taxRate = HOTEL_INFO.vatRate; // 13% VAT
    const taxAmount = Math.round((subtotal * taxRate) / 100);
    const grandTotal = subtotal + taxAmount;
    const advancePaid = booking.advancePaid || 0;
    const balanceDue = Math.max(0, grandTotal - advancePaid);

    return {
      booking,
      roomNumber: booking.roomNumber,
      roomCategory: booking.roomCategory,
      guest: booking.guest,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      nights,
      roomRate: booking.roomRatePerNight,
      roomCharges,
      orders: roomOrders,
      totalOrdersAmount,
      subtotal,
      taxRate,
      taxAmount,
      grandTotal,
      advancePaid,
      balanceDue,
    };
  };

  const finalizeCheckout = ({
    bookingId,
    extraCharges = 0,
    extraChargesDescription = "",
    discount = 0,
    paymentMethod = "cash",
    amountPaidAtCheckout,
    notes = "",
  }) => {
    const booking = bookings.find((b) => b.id === bookingId || b.bookingId === bookingId);
    if (!booking) return null;

    const folio = calculateCheckoutFolio(booking);
    const extraNum = Number(extraCharges) || 0;
    const discountNum = Number(discount) || 0;
    const subtotal = Math.max(0, folio.subtotal + extraNum - discountNum);
    const taxAmount = Math.round((subtotal * folio.taxRate) / 100);
    const grandTotal = subtotal + taxAmount;
    const balanceDue = Math.max(0, grandTotal - folio.advancePaid);
    const paidNow = amountPaidAtCheckout !== undefined ? Number(amountPaidAtCheckout) : balanceDue;

    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newBill = {
      id: `bill-${Date.now()}`,
      billNumber: `INV-${new Date().getFullYear()}-${randNum}`,
      bookingId: booking.bookingId,
      roomNumber: booking.roomNumber,
      roomCategory: booking.roomCategory,
      guest: booking.guest,
      checkInDate: booking.checkInDate,
      checkOutDate: new Date().toISOString().split("T")[0],
      nights: folio.nights,
      roomRate: booking.roomRatePerNight,
      roomCharges: folio.roomCharges,
      orders: folio.orders.map((o) => ({
        orderNumber: o.orderNumber,
        itemsSummary: o.items.map((i) => `${i.name} (x${i.quantity})`).join(", "),
        amount: o.totalAmount,
      })),
      totalOrdersAmount: folio.totalOrdersAmount,
      extraCharges: extraNum,
      extraChargesDescription,
      subtotal,
      discount: discountNum,
      taxRate: folio.taxRate,
      taxAmount,
      serviceChargeRate: 0,
      serviceChargeAmount: 0,
      grandTotal,
      advancePaid: folio.advancePaid,
      balanceDue,
      amountPaidAtCheckout: paidNow,
      paymentMethod,
      paymentStatus: paidNow >= balanceDue ? "paid" : "credit",
      notes: notes || "Thank you for staying at Kalika Hotel & Lodge!",
      createdAt: new Date().toISOString(),
    };

    setBills((prev) => [newBill, ...prev]);

    // Update booking status
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? {
              ...b,
              status: "checked_out",
              actualCheckOut: new Date().toISOString(),
              paymentStatus: "paid",
            }
          : b
      )
    );

    // Free room and set status to cleaning
    const room = rooms.find((r) => r.roomNumber === booking.roomNumber);
    if (room) {
      updateRoomStatus(room.id, "cleaning");
    }

    return newBill;
  };

  // Helper reset demo data
  const resetDemoData = () => {
    setCategories(INITIAL_CATEGORIES);
    setRooms(INITIAL_ROOMS);
    setFoodItems(INITIAL_FOOD_ITEMS);
    setBookings(INITIAL_BOOKINGS);
    setOrders(INITIAL_ORDERS);
    setBills(INITIAL_BILLS);
    localStorage.clear();
  };

  return (
    <BookingContext.Provider
      value={{
        hotelInfo: HOTEL_INFO,
        categories,
        rooms,
        foodItems,
        bookings,
        orders,
        bills,
        searchParams,
        setSearchParams,
        selectedRoomForBooking,
        setSelectedRoomForBooking,
        // Methods
        updateCategory,
        addCategory,
        addRoom,
        updateRoom,
        deleteRoom,
        updateRoomStatus,
        createBooking,
        checkInGuest,
        cancelBooking,
        placeOrder,
        updateOrderStatus,
        calculateCheckoutFolio,
        finalizeCheckout,
        resetDemoData,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
