import React, { useState, useMemo } from "react";
import {
  UtensilsCrossed,
  PlusCircle,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Leaf,
  DollarSign,
  AlertTriangle,
  ChefHat,
  Bell,
  Eye,
} from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { formatCurrency, formatDateTime } from "../../utils/formatDate";

export const AdminDiningView = () => {
  const {
    foodItems,
    orders,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    toggleFoodItemAvailability,
    updateOrderStatus,
  } = useBooking();

  // Active view tab: menu | orders
  const [activeTab, setActiveTab] = useState("menu"); // menu | orders

  // Menu Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modals state
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form State
  const [foodForm, setFoodForm] = useState({
    name: "",
    category: "Snacks & Sekuwa",
    price: 350,
    description: "",
    image: "/images/sekuwa.jpeg",
    isVeg: false,
    isAvailable: true,
  });

  const categories = [
    "All",
    "Breakfast",
    "Mains & Thali",
    "Snacks & Sekuwa",
    "Beverages",
    "Dessert",
  ];

  // Filtered food items
  const filteredFoodItems = useMemo(() => {
    return foodItems.filter((item) => {
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [foodItems, selectedCategory, searchTerm]);

  // Open Add Modal
  const handleOpenAddFood = () => {
    setEditingItem(null);
    setFoodForm({
      name: "",
      category: "Snacks & Sekuwa",
      price: 350,
      description: "Freshly prepared in our Kalika kitchen using authentic local spices.",
      image: "/images/sekuwa.jpeg",
      isVeg: false,
      isAvailable: true,
    });
    setIsFoodModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditFood = (item) => {
    setEditingItem(item);
    setFoodForm({
      name: item.name,
      category: item.category || "Mains & Thali",
      price: item.price,
      description: item.description || "",
      image: item.image || "/images/sekuwa.jpeg",
      isVeg: item.isVeg || false,
      isAvailable: item.isAvailable !== false,
    });
    setIsFoodModalOpen(true);
  };

  // Submit Menu Form
  const handleSubmitFood = (e) => {
    e.preventDefault();
    if (!foodForm.name || !foodForm.price) {
      alert("Please provide item name and price.");
      return;
    }

    if (editingItem) {
      updateFoodItem(editingItem.id, foodForm);
    } else {
      addFoodItem(foodForm);
    }

    setIsFoodModalOpen(false);
  };

  // Delete Menu Item
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    deleteFoodItem(itemToDelete.id);
    setItemToDelete(null);
  };

  // Orders sorting (pending/preparing first)
  const activeKitchenOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const orderWeight = { pending: 1, preparing: 2, delivered: 3, cancelled: 4 };
      return (orderWeight[a.status] || 5) - (orderWeight[b.status] || 5);
    });
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <UtensilsCrossed size={22} className="text-amber-600" />
            <span>Dining & Room Service Management</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage menu items, toggle ingredient availability, and track live in-room kitchen orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sub-tabs toggle */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab("menu")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "menu" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-500"
              }`}
            >
              Menu Items ({foodItems.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "orders" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-500"
              }`}
            >
              <ChefHat size={14} className="text-amber-600" />
              <span>Kitchen Orders ({orders.filter((o) => o.status !== "delivered").length})</span>
            </button>
          </div>

          {activeTab === "menu" && (
            <button
              onClick={handleOpenAddFood}
              className="px-4 py-2 rounded-xl bg-[#0c2317] hover:bg-[#143825] text-amber-300 font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
            >
              <PlusCircle size={15} className="text-amber-400" />
              <span>Add Dish</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= TAB 1: MENU ITEMS MANAGER ================= */}
      {activeTab === "menu" && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search food by name or recipe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#0c2317] text-xs"
              />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-[#0c2317] text-amber-300 shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Food Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFoodItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border shadow-xs overflow-hidden flex flex-col justify-between transition-all group ${
                  item.isAvailable
                    ? "border-stone-200/90 hover:border-amber-400"
                    : "border-stone-300 opacity-60 bg-stone-50"
                }`}
              >
                <div>
                  <div className="relative h-36 overflow-hidden bg-stone-100">
                    <img
                      src={item.image || "/images/sekuwa.jpeg"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-stone-900/80 backdrop-blur-md text-amber-300">
                        {item.category}
                      </span>
                      {item.isVeg && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-emerald-600/90 backdrop-blur-md text-white flex items-center gap-0.5">
                          <Leaf size={10} /> Veg
                        </span>
                      )}
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          item.isAvailable
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {item.isAvailable ? "In Stock" : "Unavailable"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-stone-900 leading-snug">
                        {item.name}
                      </h4>
                      <span className="font-bold text-sm text-stone-950 shrink-0">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                      {item.description || "Authentic Nepalese preparation freshly made on order."}
                    </p>
                  </div>
                </div>

                {/* Operations Footer */}
                <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                  {/* Availability Toggle */}
                  <button
                    onClick={() => toggleFoodItemAvailability(item.id)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      item.isAvailable
                        ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                        : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200"
                    }`}
                  >
                    {item.isAvailable ? "Set Sold Out" : "Set Available"}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditFood(item)}
                      className="p-1.5 text-stone-600 hover:text-amber-800 hover:bg-stone-200 rounded-lg"
                      title="Edit Dish"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => setItemToDelete(item)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete Dish"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: ACTIVE KITCHEN ORDERS ================= */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <ChefHat size={18} className="text-amber-600" />
              <span>Live Room Service Kitchen Queue</span>
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              Orders automatically charge to guest room folio
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 sm:px-6">Order ID</th>
                  <th className="py-3 px-4">Room & Guest</th>
                  <th className="py-3 px-4">Ordered Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Special Instructions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right sm:pr-6">Update Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {activeKitchenOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-stone-500">
                      No active room service orders in kitchen queue.
                    </td>
                  </tr>
                ) : (
                  activeKitchenOrders.map((ord) => {
                    const statusColors = {
                      pending: "bg-orange-100 text-orange-800 border-orange-200",
                      preparing: "bg-amber-100 text-amber-900 border-amber-300 font-bold",
                      delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
                      cancelled: "bg-rose-100 text-rose-800 border-rose-200",
                    };

                    return (
                      <tr key={ord.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-4 sm:px-6 font-mono font-bold text-stone-900">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-stone-900 block">
                            Room #{ord.roomNumber}
                          </span>
                          <span className="text-[11px] text-stone-500 block">
                            {ord.guestName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            {ord.items.map((i, idx) => (
                              <div key={idx} className="text-stone-800">
                                <strong>{i.name}</strong> &times; {i.quantity}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-950">
                          {formatCurrency(ord.totalAmount)}
                        </td>
                        <td className="py-3 px-4 text-stone-600 max-w-xs">
                          {ord.specialInstructions || "—"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${
                              statusColors[ord.status] || "bg-stone-100 text-stone-700"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right sm:pr-6">
                          <div className="flex items-center justify-end gap-1.5">
                            {ord.status === "pending" && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, "preparing")}
                                className="px-2.5 py-1 text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg shadow-xs"
                              >
                                Start Cooking
                              </button>
                            )}
                            {ord.status === "preparing" && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, "delivered")}
                                className="px-2.5 py-1 text-[10px] font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-xs"
                              >
                                Mark Delivered
                              </button>
                            )}
                            {ord.status === "delivered" && (
                              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle2 size={12} /> Billed to Room
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= ADD / EDIT DISH MODAL ================= */}
      {isFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                {editingItem ? "Edit Menu Dish" : "Add New Dish to Menu"}
              </h3>
              <button
                onClick={() => setIsFoodModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitFood} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Charcoal Jheer Sekuwa"
                  value={foodForm.name}
                  onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={foodForm.category}
                    onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-semibold focus:outline-none focus:border-[#0c2317]"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Mains & Thali">Mains & Thali</option>
                    <option value="Snacks & Sekuwa">Snacks & Sekuwa</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Price (NPR) *
                  </label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={foodForm.price}
                    onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Image URL / Asset Path
                </label>
                <input
                  type="text"
                  placeholder="/images/sekuwa.jpeg or https://..."
                  value={foodForm.image}
                  onChange={(e) => setFoodForm({ ...foodForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                />
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-stone-500">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setFoodForm({ ...foodForm, image: "/images/sekuwa.jpeg" })}
                    className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-700"
                  >
                    Sekuwa
                  </button>
                  <button
                    type="button"
                    onClick={() => setFoodForm({ ...foodForm, image: "/images/thakali.jpeg" })}
                    className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-700"
                  >
                    Thakali
                  </button>
                  <button
                    type="button"
                    onClick={() => setFoodForm({ ...foodForm, image: "/images/Momo.jpeg" })}
                    className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-700"
                  >
                    Momo
                  </button>
                  <button
                    type="button"
                    onClick={() => setFoodForm({ ...foodForm, image: "/images/dessert.jpeg" })}
                    className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-700"
                  >
                    Brownie
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={foodForm.isVeg}
                    onChange={(e) => setFoodForm({ ...foodForm, isVeg: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Vegetarian Dish</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={foodForm.isAvailable}
                    onChange={(e) => setFoodForm({ ...foodForm, isAvailable: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Available in Kitchen</span>
                </label>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Description & Ingredients
                </label>
                <textarea
                  rows={2}
                  value={foodForm.description}
                  onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0c2317]"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFoodModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#0c2317] hover:bg-[#143825] text-amber-300 rounded-xl shadow-md cursor-pointer"
                >
                  {editingItem ? "Save Changes" : "Add to Menu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-bold text-stone-900">Delete Dish?</h3>
            <p className="text-xs text-stone-600 mt-2">
              Are you sure you want to remove <strong>{itemToDelete.name}</strong> from the dining menu?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDiningView;
