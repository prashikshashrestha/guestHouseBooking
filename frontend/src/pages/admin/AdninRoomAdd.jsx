import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Snowflake, Droplets, Bath, Tv, Flame, Refrigerator, CupSoda, Laptop, ShieldCheck, DoorOpen, Mountain, Coffee, ConciergeBell, WashingMachine, Car, Waves, Dumbbell } from 'lucide-react';

const AdminRoomAdd = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center p-6 font-sans">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
    
    {/* Modal Header */}
    <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 flex-shrink-0">
      <div>
        <h3 className="text-base font-bold text-white">Add New Room</h3>
        <p className="text-xs text-slate-400">Configure room specifications, complete amenities, and photos</p>
      </div>
      <button onClick={() => navigate('/admin/rooms')} className="text-slate-400 hover:text-white text-sm font-semibold cursor-pointer">✕</button>
    </div>

    {/* Form Content (Scrollable) */}
    <div class="p-6 space-y-5 text-xs overflow-y-auto custom-scrollbar">
      
      {/* Basic Details Grid */}
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="text-slate-400 block mb-1">Room Number</label>
          <input type="text" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500" placeholder="e.g. 302" />
        </div>
        <div>
          <label class="text-slate-400 block mb-1">Room Type</label>
          <select class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500">
            <option value="">Select Room Type</option>
            <option>Single Room</option>
            <option>Double Room</option>
            <option>Twin Room</option>
            <option>Triple Room</option>
            <option>Family Room</option>
            <option>Deluxe Room</option>
            <option>Super Deluxe Room</option>
            <option>Suite Room</option>
            <option>Dormitory</option>
          </select>
        </div>
        <div>
          <label class="text-slate-400 block mb-1">Floor</label>
          <input type="text" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500" placeholder="3rd Floor" />
        </div>
      </div>

      {/* Pricing & Capacity */}
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-slate-400 block mb-1">Price Per Night (Rs)</label>
          <input type="number" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500" placeholder="80" />
        </div>
        <div>
          <label class="text-slate-400 block mb-1">Max Guests (Capacity)</label>
          <input type="number" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500" placeholder="2 Adults" />
        </div>
      </div>

      {/* Full Amenities Section */}
      <div>
        <label class="text-sky-400 block mb-2 font-bold uppercase tracking-wider text-[11px]">Select Amenities</label>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
          {/* Essentials */}
          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" checked class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <Wifi size={14} className="text-sky-400" />
            <span>Free Wi-Fi</span>
          </label>

          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" checked class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <Snowflake size={14} className="text-sky-400" />
            <span>Air Conditioning</span>
          </label>

          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" checked class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <Droplets size={14} className="text-sky-400" />
            <span>Hot Water</span>
          </label>

          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" checked class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <Bath size={14} className="text-sky-400" />
            <span>Attached Bathroom</span>
          </label>

          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <Tv size={14} className="text-sky-400" />
            <span>TV</span>
          </label>

          {/* Comfort & Convenience */}
          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <Flame size={14} className="text-sky-400" />
            <span>Room Heater</span>
          </label>

          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <Refrigerator size={14} className="text-sky-400" />
            <span>Mini Refrigerator</span>
          </label>

          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <CupSoda size={14} className="text-sky-400" />
            <span>Electric Kettle</span>
          </label>

          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <Laptop size={14} className="text-sky-400" />
            <span>Work Desk</span>
          </label>

          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <ShieldCheck size={14} className="text-sky-400" />
            <span>In-room Safe</span>
          </label>

          {/* Room Features */}
          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <DoorOpen size={14} className="text-sky-400" />
            <span>Balcony</span>
          </label>

          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <Mountain size={14} className="text-sky-400" />
            <span>Mountain View</span>
          </label>

          {/* Hotel Services */}
          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <Coffee size={14} className="text-sky-400" />
            <span>Breakfast Included</span>
          </label>

          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <ConciergeBell size={14} className="text-sky-400" />
            <span>Room Service</span>
          </label>

          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <WashingMachine size={14} className="text-sky-400" />
            <span>Laundry Service</span>
          </label>

          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <Car size={14} className="text-sky-400" />
            <span>Free Parking</span>
          </label>

          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <Waves size={14} className="text-sky-400" />
            <span>Swimming Pool</span>
          </label>

          <label class="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer">
            <input type="checkbox" class="rounded border-slate-700 text-sky-500 focus:ring-0" />
            <Dumbbell size={14} className="text-sky-400" />
            <span>Gym Access</span>
          </label>

        </div>
      </div>

      {/* Image Upload Area */}
      <div>
        <label class="text-slate-400 block mb-1">Upload Room Photos</label>
        <div class="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center bg-slate-800/40 hover:border-sky-500 transition cursor-pointer">
          <svg class="mx-auto h-7 w-7 text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-slate-300 font-medium">Click to upload photos or drag and drop</p>
          <p class="text-[10px] text-slate-500 mt-0.5">PNG, JPG up to 10MB</p>
        </div>
      </div>

      {/* Room Description */}
      <div>
        <label class="text-slate-400 block mb-1">Room Description</label>
        <textarea rows="2" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500" placeholder="Briefly describe room features, view, and unique perks..."></textarea>
      </div>

    </div>

    {/* Actions */}
    <div class="flex justify-end gap-3 px-6 py-4 bg-slate-900 border-t border-slate-800 flex-shrink-0">
      <button onClick={() => navigate('/admin/rooms')} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg border border-slate-700 hover:bg-slate-800 transition cursor-pointer">
        Cancel
      </button>
      <button class="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition shadow-md">
        Save & Publish Room
      </button>
      </div>
    </div>
    </div>
  );
};

export default AdminRoomAdd;
