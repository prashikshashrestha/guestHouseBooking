import { useState, useEffect, useCallback } from "react";
import roomApi from "../api/roomApi";
import { useBooking } from "../context/BookingContext";

export const useFetchRooms = (filterParams = {}) => {
  const { rooms: contextRooms } = useBooking();
  const [rooms, setRooms] = useState(contextRooms);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await roomApi.getAllRooms(filterParams);
      if (response.data && Array.isArray(response.data)) {
        setRooms(response.data);
      } else {
        setRooms(contextRooms);
      }
    } catch (err) {
      // Graceful fallback to local context rooms
      setRooms(contextRooms);
      // Non-blocking error record
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [filterParams, contextRooms]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, loading, error, refetch: fetchRooms };
};

export default useFetchRooms;
