import axiosInstance from "./axiosInstance";

export const roomApi = {
  getAllRooms: (params) => axiosInstance.get("/rooms", { params }),
  getRoomById: (id) => axiosInstance.get(`/rooms/${id}`),
  createRoom: (roomData) => axiosInstance.post("/rooms", roomData),
  updateRoom: (id, roomData) => axiosInstance.put(`/rooms/${id}`, roomData),
  updateRoomStatus: (id, status) => axiosInstance.patch(`/rooms/${id}/status`, { status }),
  deleteRoom: (id) => axiosInstance.delete(`/rooms/${id}`),
  getCategories: () => axiosInstance.get("/categories"),
  updateCategoryPrice: (id, data) => axiosInstance.put(`/categories/${id}`, data),
};

export default roomApi;
