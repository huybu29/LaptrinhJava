import React, { useEffect, useState } from "react";
import api from "../../services/api";
// import { useNavigate } from "react-router-dom"; // Không cần navigate nữa vì dùng Modal
import { 
  FiSearch, FiPlus, FiTrash2, FiEdit2, FiX, FiUser, FiCheckCircle, FiXCircle, FiSave
} from "react-icons/fi";

const AdminUsers = () => {
  // Data States
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & Pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // === STATE CHO MODAL THÊM MỚI ===
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "", fullName: "", email: "", phone: "", 
    password: "", role: "CUSTOMER", status: "ACTIVE",
  });

  // === STATE CHO MODAL CHỈNH SỬA (MỚI) ===
  const [editingUser, setEditingUser] = useState(null); // Nếu null thì đóng modal, có object thì mở

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Fetch Data ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users", {
        headers: { "X-User-Role": "ROLE_ADMIN" },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error("Lỗi tải user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Search Logic ---
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const results = users.filter(
      (u) =>
        (u.username || "").toLowerCase().includes(lowerSearch) ||
        (u.fullName || "").toLowerCase().includes(lowerSearch) ||
        (u.email || "").toLowerCase().includes(lowerSearch) ||
        (u.phone || "").toLowerCase().includes(lowerSearch)
    );
    setFilteredUsers(results);
    setCurrentPage(1);
  }, [search, users]);

  // --- Pagination ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // --- Actions ---
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa user này?")) return;
    try {
      await api.delete(`/users/${id}`, {
        headers: { "X-User-Role": "ROLE_ADMIN" },
      });
      setUsers(users.filter((u) => u.id !== id));
      alert("Đã xóa thành công!");
    } catch (error) {
      alert("Xóa thất bại: " + (error.response?.data?.message || "Lỗi server"));
    }
  };

  // --- XỬ LÝ THÊM MỚI ---
  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/users", newUser, {
        headers: { "X-User-Role": "ROLE_ADMIN" },
      });
      setShowAddModal(false);
      setNewUser({ username: "", fullName: "", email: "", phone: "", password: "", role: "CUSTOMER", status: "ACTIVE" });
      fetchUsers();
      alert("Thêm user thành công!");
    } catch (error) {
      alert("Thêm thất bại! " + (error.response?.data?.message || ""));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- XỬ LÝ CẬP NHẬT (MỚI) ---
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Gọi API PUT /users/{id}
      await api.put(`/users/${editingUser.id}`, editingUser, {
        headers: { "X-User-Role": "ROLE_ADMIN" },
      });
      
      setEditingUser(null); // Đóng modal
      fetchUsers(); // Load lại dữ liệu
      alert("Cập nhật thành công!");
    } catch (error) {
      alert("Cập nhật thất bại! " + (error.response?.data?.message || ""));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input Change cho Form Thêm
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // Input Change cho Form Sửa
  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({ ...prev, [name]: value }));
  };

  const renderRoleBadge = (role) => {
    const colors = {
      ADMIN: "bg-red-500/10 text-red-500 border-red-500/20",
      STAFF: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      CUSTOMER: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    };
    return <span className={`px-2 py-1 rounded text-xs font-bold border ${colors[role] || colors.CUSTOMER}`}>{role}</span>;
  };

  return (
    <div className="p-6 bg-[#0B0F19] min-h-screen text-gray-100 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FiUser className="text-blue-500" /> Quản lý Người dùng
          </h1>
          <p className="text-gray-400 text-sm mt-1">Tổng số: {users.length} tài khoản</p>
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
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
            >
                <FiPlus /> Thêm mới
            </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#161b26] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#1f2937] text-gray-400 text-xs uppercase tracking-wider">
                        <th className="p-4 font-medium">#</th>
                        <th className="p-4 font-medium">Thông tin</th>
                        <th className="p-4 font-medium">Liên hệ</th>
                        <th className="p-4 font-medium">Vai trò</th>
                        <th className="p-4 font-medium">Trạng thái</th>
                        <th className="p-4 font-medium text-right">Hành động</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-sm">
                    {loading ? (
                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
                    ) : currentItems.length > 0 ? (
                        currentItems.map((u, idx) => (
                            <tr key={u.id} className="hover:bg-[#1f2937]/50 transition-colors group">
                                <td className="p-4 text-gray-500">{indexOfFirstItem + idx + 1}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white">
                                            {u.fullName ? u.fullName.charAt(0).toUpperCase() : "U"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{u.fullName || "Chưa đặt tên"}</p>
                                            <p className="text-xs text-gray-500">@{u.username}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-300">
                                    <p>{u.email}</p>
                                    <p className="text-xs text-gray-500">{u.phone}</p>
                                </td>
                                <td className="p-4">{renderRoleBadge(u.role)}</td>
                                <td className="p-4">
                                    {u.status === 'ACTIVE' ? (
                                        <span className="flex items-center gap-1 text-green-500 text-xs font-medium"><FiCheckCircle/> Hoạt động</span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-green-500 text-xs font-medium">Hoạt động</span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {/* Nút Sửa: Mở Modal Edit */}
                                        <button 
                                            onClick={() => setEditingUser(u)} 
                                            className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors" 
                                            title="Sửa"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(u.id)} 
                                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors" 
                                            title="Xóa"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">Không tìm thấy kết quả nào.</td></tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > itemsPerPage && (
            <div className="p-4 border-t border-gray-800 flex justify-between items-center text-sm text-gray-400">
                <span>Trang {currentPage} / {totalPages}</span>
                <div className="flex gap-2">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50">Trước</button>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50">Sau</button>
                </div>
            </div>
        )}
      </div>

      {/* === MODAL THÊM MỚI === */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#161b26] w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">Thêm người dùng mới</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white"><FiX size={24}/></button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
                {/* ... (Các trường input cho Add User giữ nguyên như code cũ) ... */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold uppercase">Tên đăng nhập</label>
                        <input required name="username" value={newUser.username} onChange={handleNewUserChange} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold uppercase">Họ và tên</label>
                        <input required name="fullName" value={newUser.fullName} onChange={handleNewUserChange} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-bold uppercase">Email</label>
                    <input required type="email" name="email" value={newUser.email} onChange={handleNewUserChange} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold uppercase">Số điện thoại</label>
                        <input required name="phone" value={newUser.phone} onChange={handleNewUserChange} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold uppercase">Mật khẩu</label>
                        <input required type="password" name="password" value={newUser.password} onChange={handleNewUserChange} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold uppercase">Vai trò</label>
                        <select name="role" value={newUser.role} onChange={handleNewUserChange} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none">
                            <option value="CUSTOMER">Khách hàng</option>
                            <option value="STAFF">Nhân viên</option>
                            <option value="ADMIN">Quản trị viên</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold uppercase">Trạng thái</label>
                        <select name="status" value={newUser.status} onChange={handleNewUserChange} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none">
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="INACTIVE">Vô hiệu hóa</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 font-medium">Hủy bỏ</button>
                    <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg">
                        {isSubmitting ? "Đang lưu..." : "Xác nhận thêm"}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* === MODAL CHỈNH SỬA (EDIT USER) === */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setEditingUser(null)}>
          <div className="bg-[#161b26] w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FiEdit2 className="text-blue-500"/> Chỉnh sửa người dùng
                </h3>
                <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-white"><FiX size={24}/></button>
            </div>
            
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                {/* ID & Username (Read-only) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 opacity-50">
                        <label className="text-xs text-gray-500 font-bold uppercase">ID</label>
                        <input disabled value={editingUser.id} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-gray-400 cursor-not-allowed" />
                    </div>
                    <div className="space-y-1 opacity-50">
                        <label className="text-xs text-gray-500 font-bold uppercase">Username</label>
                        <input disabled value={editingUser.username} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-gray-400 cursor-not-allowed" />
                    </div>
                </div>

                {/* Editable Fields */}
                <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-bold uppercase">Họ và tên</label>
                    <input name="fullName" value={editingUser.fullName} onChange={handleEditUserChange} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold uppercase">Email</label>
                        <input name="email" value={editingUser.email} onChange={handleEditUserChange} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold uppercase">Số điện thoại</label>
                        <input name="phone" value={editingUser.phone} onChange={handleEditUserChange} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold uppercase">Vai trò</label>
                        <select name="role" value={editingUser.role} onChange={handleEditUserChange} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none">
                            <option value="ROLE_CUSTOMER">Khách hàng</option>
                            <option value="ROLE_STAFF">Nhân viên</option>
                            <option value="ROLE_ADMIN">Quản trị viên</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold uppercase">Trạng thái</label>
                        <select name="status" value={editingUser.status} onChange={handleEditUserChange} className="w-full bg-[#0f1219] border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none">
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="INACTIVE">Vô hiệu hóa</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 font-medium">Hủy bỏ</button>
                    <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg flex items-center gap-2">
                        {isSubmitting ? "Đang lưu..." : <><FiSave /> Cập nhật</>}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;