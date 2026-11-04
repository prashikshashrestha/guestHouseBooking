import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  HOTEL_INFO,
  HOTEL_GALLERY,
  INITIAL_CATEGORIES,
  INITIAL_ROOMS,
  INITIAL_FOOD_ITEMS,
  INITIAL_BOOKINGS,
  INITIAL_ORDERS,
  INITIAL_BILLS,
} from "../utils/initialData";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  // 1. Hotel Information (Editable via Settings)
  const [hotelInfo, setHotelInfo] = useState(() => {
    try {
      const saved = localStorage.getItem("kalika_hotel_info");
      return saved ? JSON.parse(saved) : HOTEL_INFO;
    } catch {
      return HOTEL_INFO;
    }
  });

  // 2. Room Categories
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem("kalika_categories");
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // 3. Rooms Inventory
  const [rooms, setRooms] = useState(() => {
    try {
      const saved = localStorage.getItem("kalika_rooms");
      return saved ? JSON.parse(saved) : INITIAL_ROOMS;
    } catch {
      return INITIAL_ROOMS;
    }
  });

  // 4. Dining Food Items
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
    try {
      localStorage.setItem("kalika_food_items_v2", JSON.stringify(items));
      localStorage.setItem("kalika_food_items", JSON.stringify(items));
    } catch {}
    return items;
  });

  // 5. Bookings
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem("kalika_bookings");
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  // 6. Kitchen Orders
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("kalika_orders");
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // 7. Bills & Invoices
  const [bills, setBills] = useState(() => {
    try {
      const saved = localStorage.getItem("kalika_bills");
      return saved ? JSON.parse(saved) : INITIAL_BILLS;
    } catch {
      return INITIAL_BILLS;
    }
  });

  // 8. Gallery Photos
  const [gallery, setGallery] = useState(() => {
    try {
      const saved = localStorage.getItem("kalika_gallery");
      return saved ? JSON.parse(saved) : HOTEL_GALLERY;
    } catch {
      return HOTEL_GALLERY;
    }
  });

  // 9. Read/Dismissed Notification IDs
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState(() => {
    try {
      const saved = localStorage.getItem("kalika_dismissed_notifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Search & Filter state for guest booking
  const [searchParams, setSearchParams] = useState({
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    guests: 2,
    category: "All",
  });

  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("kalika_hotel_info", JSON.stringify(hotelInfo));
  }, [hotelInfo]);

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

  useEffect(() => {
    localStorage.setItem("kalika_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("kalika_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("kalika_bills", JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem("kalika_gallery", JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem("kalika_dismissed_notifications", JSON.stringify(dismissedNotificationIds));
  }, [dismissedNotificationIds]);

  // Hotel Info Updater
  const updateHotelInfo = (newInfo) => {
    setHotelInfo((prev) => ({
      ...prev,
      ...newInfo,
    }));
  };

  // Category Management
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

  // Room Management
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
        : (roomData.amenities || "").split(",").map((s) => s.trim()).filter(Boolean),
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
    const targetRoom = rooms.find((r) => r.id === id);
    if (!targetRoom) return { success: false, message: "Room not found" };

    // Prevent deletion if room is occupied
    if (targetRoom.status === "occupied") {
      return {
        success: false,
        message: `Cannot delete Room #${targetRoom.roomNumber} while it is currently occupied by a guest.`,
      };
    }

    setRooms((prev) => prev.filter((r) => r.id !== id));
    return { success: true };
  };

  const updateRoomStatus = (id, status) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const blockRoomForMaintenance = (roomId, reason = "Maintenance & inspection", startDate = null, endDate = null) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              status: "maintenance",
              maintenanceReason: reason,
              maintenanceStartDate: startDate || new Date().toISOString().split("T")[0],
              maintenanceEndDate: endDate || "",
            }
          : r
      )
    );
  };

  const unblockRoom = (roomId) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              status: "available",
              maintenanceReason: null,
              maintenanceStartDate: null,
              maintenanceEndDate: null,
            }
          : r
      )
    );
  };

  // Booking Operations
  const createBooking = (bookingData) => {
    const start = new Date(bookingData.checkInDate);
    const end = new Date(bookingData.checkOutDate);
    const diffTime = Math.abs(end - start);
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const room = rooms.find(
      (r) => r.id === bookingData.roomId || r.roomNumber === bookingData.roomNumber
    );
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
      paymentStatus:
        bookingData.paymentStatus ||
        (bookingData.paymentMethod === "pay_at_hotel" ? "pending" : "paid"),
      status: isAutoCheckIn ? "checked_in" : (bookingData.status || "confirmed"),
      specialRequests: bookingData.specialRequests || "",
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    if (isAutoCheckIn && room) {
      updateRoomStatus(room.id, "occupied");
    }

    return newBooking;
  };

  const confirmBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId || b.bookingId === bookingId
          ? { ...b, status: "confirmed" }
          : b
      )
    );
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

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId || b.bookingId === bookingId
          ? { ...b, status: newStatus }
          : b
      )
    );
  };

  const updateBookingPaymentStatus = (bookingId, paymentStatus) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId || b.bookingId === bookingId
          ? { ...b, paymentStatus }
          : b
      )
    );
  };

  // Kitchen Order Operations
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

  // Dining Food Items Operations
  const addFoodItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: `food-${Date.now()}`,
      price: Number(itemData.price),
      isAvailable: itemData.isAvailable !== undefined ? itemData.isAvailable : true,
      isVeg: itemData.isVeg !== undefined ? itemData.isVeg : false,
      image: itemData.image || "/images/sekuwa.jpeg",
    };
    setFoodItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateFoodItem = (id, updatedData) => {
    setFoodItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const deleteFoodItem = (id) => {
    setFoodItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFoodItemAvailability = (id) => {
    setFoodItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  // Gallery Operations
  const addGalleryItem = (photoData) => {
    const newPhoto = {
      ...photoData,
      id: `gal-${Date.now()}`,
      image: photoData.image || "/images/hero.jpg",
      category: photoData.category || "Rooms",
      title: photoData.title || "Kalika Hotel Photo",
      description: photoData.description || "",
    };
    setGallery((prev) => [newPhoto, ...prev]);
    return newPhoto;
  };

  const updateGalleryItem = (id, updatedData) => {
    setGallery((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const deleteGalleryItem = (id) => {
    setGallery((prev) => prev.filter((item) => item.id !== id));
  };

  // Billing & Folio Settlement
  const calculateCheckoutFolio = (bookingOrId) => {
    const booking =
      typeof bookingOrId === "string"
        ? bookings.find((b) => b.id === bookingOrId || b.bookingId === bookingOrId)
        : bookingOrId;

    if (!booking) return null;

    const nights = Math.max(1, booking.totalNights || 1);
    const roomCharges = nights * booking.roomRatePerNight;

    const roomOrders = orders.filter(
      (o) =>
        (o.roomNumber === booking.roomNumber || o.bookingId === booking.bookingId) &&
        o.isBilledToRoom &&
        o.status !== "cancelled"
    );

    const totalOrdersAmount = roomOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const subtotal = roomCharges + totalOrdersAmount;
    const taxRate = hotelInfo.vatRate || 13;
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

    // Update booking status to checked_out
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

  // Customers Directory (Aggregated from bookings)
  const customers = useMemo(() => {
    const customerMap = new Map();

    bookings.forEach((b) => {
      const email = b.guest?.email?.trim().toLowerCase() || "";
      const phone = b.guest?.phone?.trim() || "";
      const key = email || phone || b.guest?.fullName?.trim().toLowerCase() || b.id;

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: `cust-${key.replace(/[^a-zA-Z0-9]/g, "-")}`,
          fullName: b.guest?.fullName || "Guest",
          email: b.guest?.email || "—",
          phone: b.guest?.phone || "—",
          address: b.guest?.address || "Nepal",
          idCardNumber: b.guest?.idCardNumber || "—",
          totalBookings: 0,
          totalSpent: 0,
          lastBookingDate: b.checkInDate || b.createdAt,
          bookings: [],
          status: "Active",
        });
      }

      const record = customerMap.get(key);
      record.totalBookings += 1;
      record.totalSpent += Number(b.totalRoomCharge || 0);
      record.bookings.push(b);

      if (b.checkInDate && b.checkInDate > record.lastBookingDate) {
        record.lastBookingDate = b.checkInDate;
      }
    });

    return Array.from(customerMap.values());
  }, [bookings]);

  // Dynamic Notifications based on Hotel Operations
  const notifications = useMemo(() => {
    const list = [];
    const today = new Date().toISOString().split("T")[0];

    // 1. Pending bookings needing review
    const pendingBookings = bookings.filter((b) => b.status === "pending");
    pendingBookings.forEach((b) => {
      list.push({
        id: `notif-pending-${b.id}`,
        type: "pending_booking",
        title: "New Pending Reservation",
        message: `${b.guest.fullName} requested ${b.roomCategory} (#${b.roomNumber}) for ${b.checkInDate}.`,
        time: b.createdAt,
        severity: "warning",
        link: "/admin/bookings",
        bookingId: b.bookingId,
      });
    });

    // 2. Arrivals / Check-ins today
    const todayArrivals = bookings.filter(
      (b) => b.checkInDate === today && (b.status === "confirmed" || b.status === "pending")
    );
    todayArrivals.forEach((b) => {
      list.push({
        id: `notif-checkin-${b.id}`,
        type: "today_arrival",
        title: "Guest Arrival Scheduled Today",
        message: `${b.guest.fullName} is arriving today for Room #${b.roomNumber}.`,
        time: new Date().toISOString(),
        severity: "info",
        link: "/admin/bookings",
        bookingId: b.bookingId,
      });
    });

    // 3. Departures / Check-outs today
    const todayDepartures = bookings.filter(
      (b) => b.checkOutDate === today && b.status === "checked_in"
    );
    todayDepartures.forEach((b) => {
      list.push({
        id: `notif-checkout-${b.id}`,
        type: "today_departure",
        title: "Guest Check-out Due Today",
        message: `${b.guest.fullName} in Room #${b.roomNumber} is scheduled for check-out.`,
        time: new Date().toISOString(),
        severity: "info",
        link: "/admin/bookings",
        bookingId: b.bookingId,
      });
    });

    // 4. Rooms in Maintenance
    const maintenanceRooms = rooms.filter((r) => r.status === "maintenance");
    maintenanceRooms.forEach((r) => {
      list.push({
        id: `notif-maint-${r.id}`,
        type: "maintenance",
        title: "Room Under Maintenance",
        message: `Room #${r.roomNumber} (${r.category}) is currently blocked: ${r.maintenanceReason || "Inspection"}.`,
        time: r.maintenanceStartDate || new Date().toISOString(),
        severity: "error",
        link: "/admin/availability",
      });
    });

    // 5. Pending Room Service Orders
    const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "preparing");
    if (pendingOrders.length > 0) {
      list.push({
        id: `notif-orders-${today}`,
        type: "kitchen_orders",
        title: "Active Kitchen Orders",
        message: `${pendingOrders.length} food order(s) currently being prepared for guest rooms.`,
        time: new Date().toISOString(),
        severity: "info",
        link: "/admin/dining",
      });
    }

    // Filter out dismissed
    return list.filter((n) => !dismissedNotificationIds.includes(n.id));
  }, [bookings, rooms, orders, dismissedNotificationIds]);

  const dismissNotification = (id) => {
    setDismissedNotificationIds((prev) => [...prev, id]);
  };

  const clearAllNotifications = () => {
    const allIds = notifications.map((n) => n.id);
    setDismissedNotificationIds((prev) => [...new Set([...prev, ...allIds])]);
  };

  // Helper reset demo data
  const resetDemoData = () => {
    setHotelInfo(HOTEL_INFO);
    setCategories(INITIAL_CATEGORIES);
    setRooms(INITIAL_ROOMS);
    setFoodItems(INITIAL_FOOD_ITEMS);
    setBookings(INITIAL_BOOKINGS);
    setOrders(INITIAL_ORDERS);
    setBills(INITIAL_BILLS);
    setGallery(HOTEL_GALLERY);
    setDismissedNotificationIds([]);
    localStorage.clear();
  };

  return (
    <BookingContext.Provider
      value={{
        hotelInfo,
        updateHotelInfo,
        categories,
        rooms,
        foodItems,
        bookings,
        orders,
        bills,
        gallery,
        customers,
        notifications,
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
        blockRoomForMaintenance,
        unblockRoom,
        createBooking,
        confirmBooking,
        checkInGuest,
        cancelBooking,
        updateBookingStatus,
        updateBookingPaymentStatus,
        placeOrder,
        updateOrderStatus,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        toggleFoodItemAvailability,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        calculateCheckoutFolio,
        finalizeCheckout,
        dismissNotification,
        clearAllNotifications,
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

export default BookingContext;
