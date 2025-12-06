import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { 
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiPackage, FiCalendar, FiDollarSign, FiCheckCircle, FiXCircle, FiX, FiZap 
} from "react-icons/fi";

const AdminBatteryPackages = () => {
  // === DATA STATES ===
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // === PAGINATION & FILTER ===
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // === MODAL STATES ===
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    packageName: "", description: "", price: "", durationType: "MONTHLY",
    swapLimit: "", startDate: "", endDate: "", isActive: true,
    // Thêm các trường cần thiết khác nếu có
  });

  // --- FETCH DATA ---
  const fetchPackages = async () => {
    try {
      setLoading(true);
      // Lưu ý: API trong Controller của bạn là /subscription-plans, không phải /battery-packages
      // Cần sửa lại endpoint cho đúng với Controller Backend
      const res = await api.get("/subscription-plans", {
        headers: { "X-User-Role": "ROLE_ADMIN" },
      });
      setPackages(res.data);
      setFilteredPackages(res.data);
    } catch (error) {
      console.error("Lỗi tải danh sách gói:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPackages(); }, []);

  // --- SEARCH LOGIC ---
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const results = packages.filter(p => 
        (p.name || p.packageName || "").toLowerCase().includes(lowerSearch) || // Chú ý: Backend DTO dùng 'name', code cũ dùng 'packageName'
        (p.description || "").toLowerCase().includes(lowerSearch)
    );
    setFilteredPackages(results);
    setCurrentPage(1);
  }, [search, packages]);

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPackages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

  // --- HANDLERS ---
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa gói này?")) return;
    try {
      await api.delete(`/subscription-plans/${id}`, {
        headers: { "X-User-Role": "ROLE_ADMIN" },
      });
      setPackages(prev => prev.filter(p => p.id !== id));
      alert("Đã xóa thành công!");
    } catch (error) {
      alert("Lỗi xóa: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Chuẩn hóa dữ liệu trước khi gửi (map fields cho khớp DTO Backend)
      const payload = {
          name: formData.packageName, // Map packageName -> name
          description: formData.description,
          priceMonthly: formData.durationType === 'MONTHLY' ? formData.price : 0, // Giả sử DTO có priceMonthly/Yearly
          priceYearly: formData.durationType === 'YEARLY' ? formData.price : 0,
          swapLimit: formData.swapLimit,
          isActive: formData.isActive
      };

      if (isEditing) {
        await api.put(`/subscription-plans/${formData.id}`, payload, { headers: { "X-User-Role": "ROLE_ADMIN" } });
        alert("Cập nhật thành công!");
      } else {
        await api.post("/subscription-plans", payload, { headers: { "X-User-Role": "ROLE_ADMIN" } });
        alert("Thêm mới thành công!");
      }
      
      setShowModal(false);
      fetchPackages();
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Lỗi lưu dữ liệu: " + (error.response?.data?.message || "Unknown Error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddModal = () => {
      resetForm();
      setIsEditing(false);
      setShowModal(true);
  };

  const openEditModal = (pkg) => {
      // Map dữ liệu từ API về Form
      setFormData({
          id: pkg.id,
          packageName: pkg.name, 
          description: pkg.description,
          price: pkg.priceMonthly || pkg.priceYearly || 0,
          durationType: pkg.priceYearly > 0 ? "YEARLY" : "MONTHLY", // Logic đoán loại
          swapLimit: pkg.swapLimit,
          isActive: pkg.isActive,
          startDate: "", endDate: "" // Các trường này thường ở UserSubscription, không phải Plan
      });
      setIsEditing(true);
      setShowModal(true);
  };

  const resetForm = () => {
      setFormData({
        id: null, packageName: "", description: "", price: "", durationType: "MONTHLY",
        swapLimit: "", isActive: true, startDate: "", endDate: ""
      });
  };

  // Helper Render
  const renderStatusBadge = (active) => {
      return active ? (
          <span className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded border border-green-500/20"><FiCheckCircle/> ACTIVE</span>
      ) : (
          <span className="flex items-center gap-1 text-red-500 text-xs font-bold bg-red-500/10 px-2 py-1 rounded border border-red-500/20"><FiXCircle/> INACTIVE</span>
      );
  };

  return (
    <div className="p-6 bg-[#0B0F19] min-h-screen text-gray-100 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FiPackage className="text-blue-500" /> Quản lý Gói Pin
          </h1>
          <p className="text-gray-400 text-sm mt-1">Tổng số: {packages.length} gói</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <FiSearch className="absolute left-3 top-3 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#161b26] border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 outline-none text-white"
                />
            </div>
            <button 
                onClick={openAddModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
            >
                <FiPlus /> Thêm Gói
            </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#161b26] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#1f2937] text-gray-400 text-xs uppercase tracking-wider">
                        <th className="p-4">#</th>
                        <th className="p-4">Tên gói</th>
                        <th className="p-4">Giá cước</th>
                        <th className="p-4">Giới hạn</th>
                       
                        <th className="p-4 text-right">Hành động</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-sm">
                    {loading ? (
                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
                    ) : currentItems.length > 0 ? (
                        currentItems.map((p, idx) => (
                            <tr key={p.id} className="hover:bg-[#1f2937]/50 transition-colors group">
                                <td className="p-4 text-gray-500">{indexOfFirstItem + idx + 1}</td>
                                <td className="p-4">
                                    <div className="font-bold text-white text-lg">{p.name}</div>
                                    <div className="text-xs text-gray-400 max-w-xs truncate">{p.description}</div>
                                </td>
                                <td className="p-4 font-mono text-blue-400 font-bold">
                                    {(p.priceMonthly || p.priceYearly || 0).toLocaleString()} đ
                                    <span className="text-xs text-gray-500 ml-1">
                                        /{p.priceYearly > 0 ? 'năm' : 'tháng'}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-300 flex items-center gap-1">
                                    <FiZap className="text-yellow-500"/> 
                                    {p.swapLimit ? `${p.swapLimit} lần` : "Không giới hạn"}
                                </td>
                                
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(p)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20"><FiEdit2 size={16} /></button>
                                        <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"><FiTrash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">Không tìm thấy gói cước nào.</td></tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Pagination */}
        {filteredPackages.length > itemsPerPage && (
            <div className="p-4 border-t border-gray-800 flex justify-between items-center text-sm text-gray-400">
                <span>Trang {currentPage} / {totalPages}</span>
                <div className="flex gap-2">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50">Trước</button>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50">Sau</button>
                </div>
            </div>
        )}
      </div>

      {/* === MODAL ADD/EDIT === */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-[#161b26] w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">
                    {isEditing ? "✏️ Cập nhật Gói cước" : "➕ Thêm Gói mới"}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><FiX size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-bold uppercase">Tên gói</label>
                    <input required value={formData.packageName} onChange={(e) => setFormData({...formData, packageName: e.target.value})} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" />
                </div>
                
                <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-bold uppercase">Mô tả</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none h-20 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold uppercase">Giá cước (VND)</label>
                        <div className="relative">
                            <FiDollarSign className="absolute left-3 top-3 text-gray-500"/>
                            <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold uppercase">Chu kỳ</label>
                        <select value={formData.durationType} onChange={(e) => setFormData({...formData, durationType: e.target.value})} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none">
                            <option value="MONTHLY">Theo tháng</option>
                            <option value="YEARLY">Theo năm</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold uppercase">Giới hạn đổi (Lần)</label>
                        <input type="number" placeholder="Để trống = Vô cực" value={formData.swapLimit} onChange={(e) => setFormData({...formData, swapLimit: e.target.value})} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold uppercase">Trạng thái</label>
                        <select value={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none">
                            <option value="true">Hoạt động</option>
                            <option value="false">Ngưng</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 font-medium">Hủy</button>
                    <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg">
                        {isSubmitting ? "Đang lưu..." : (isEditing ? "Cập nhật" : "Thêm mới")}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBatteryPackages;