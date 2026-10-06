import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRoomsPage = () => {
  const navigate = useNavigate();

  // Empty room data for now
  const rooms = [];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Occupied':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Maintenance':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="font-sans">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Rooms</h1>
          <p className="text-sm text-slate-400 mt-1">Manage all guest house rooms and their availability</p>
        </div>
        <button
          onClick={() => navigate('/admin/room/add')}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition shadow-lg shadow-sky-600/20 cursor-pointer"
        >
          Add New Room
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Total Rooms</p>
          <p className="text-2xl font-bold text-white mt-1">{rooms.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Available</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{rooms.filter(r => r.status === 'Available').length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Occupied</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{rooms.filter(r => r.status === 'Occupied').length}</p>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Room No.</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Floor</th>
                <th className="px-6 py-4">Price / Night</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                  <td className="px-6 py-4 font-semibold text-white">#{room.number}</td>
                  <td className="px-6 py-4 text-slate-300">{room.type}</td>
                  <td className="px-6 py-4 text-slate-400">{room.floor}</td>
                  <td className="px-6 py-4 text-white font-medium">Rs {room.price}</td>
                  <td className="px-6 py-4 text-slate-400">{room.capacity} {room.capacity > 1 ? 'Guests' : 'Guest'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(room.status)}`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition" title="Edit">
                        
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition" title="Delete">
                       
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRoomsPage;
