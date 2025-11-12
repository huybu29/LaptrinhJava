import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminBatteryPackages = () => {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    userId: "",
    vehicleId: "",
    packageName: "",
    description: "",
    price: "",
    durationType: "",
    swapLimit: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  // Lấy danh sách gói pin
  const fetchPackages = async () => {
    try {
      const res = await api.get("/battery-packages");
      setPackages(res.data);
      setFilteredPackages(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách gói pin:", error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Lọc theo từ khóa tìm kiếm
  useEffect(() => {
    setFilteredPackages(
      packages.filter(
        (p) =>
          (p.packageName || "").toLowerCase().includes(search.toLowerCase()) ||
          (p.description || "").toLowerCase().includes(search.toLowerCase()) ||
          (p.durationType || "").toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, packages]);

  // Xử lý xóa gói pin
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa gói pin này?")) return;
    try {
      await api.delete(`/battery-packages/${id}`);
      setPackages(packages.filter((p) => p.id !== id));
    } catch (error) {
      console.error("❌ Lỗi khi xóa gói pin:", error);
    }
  };

  // Xử lý thêm hoặc sửa
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/battery-packages/${formData.id}`, formData);
      } else {
        await api.post("/battery-packages", formData);
      }
      setShowModal(false);
      fetchPackages();
      setFormData({
        id: null,
        userId: "",
        vehicleId: "",
        packageName: "",
        description: "",
        price: "",
        durationType: "",
        swapLimit: "",
        startDate: "",
        endDate: "",
        isActive: true,
      });
    } catch (error) {
      console.error("❌ Lỗi khi lưu gói pin:", error);
    }
  };

  const handleEdit = (pkg) => {
    setFormData(pkg);
    setShowModal(true);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">🔋 Quản lý gói pin</h2>
      <p className="text-gray-600 mb-4">Theo dõi, thêm, sửa hoặc xóa các gói pin đang được đăng ký.</p>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên gói, mô tả, loại thời hạn..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
        />
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          ➕ Thêm gói pin
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Tên gói</th>
              <th className="px-4 py-2">Giá</th>
              <th className="px-4 py-2">Loại thời hạn</th>
              <th className="px-4 py-2">Giới hạn lượt</th>
              <th className="px-4 py-2">Bắt đầu</th>
              <th className="px-4 py-2">Kết thúc</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredPackages.length > 0 ? (
              filteredPackages.map((p, idx) => (
                <tr key={p.id} className="border-t hover:bg-blue-50 transition">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{p.packageName}</td>
                  <td className="px-4 py-2">{p.price?.toLocaleString()}₫</td>
                  <td className="px-4 py-2">{p.durationType}</td>
                  <td className="px-4 py-2 text-center">{p.swapLimit}</td>
                  <td className="px-4 py-2">
                    {p.startDate ? new Date(p.startDate).toLocaleDateString() : ""}
                  </td>
                  <td className="px-4 py-2">
                    {p.endDate ? new Date(p.endDate).toLocaleDateString() : ""}
                  </td>
                  <td className="px-4 py-2">
                    {p.isActive ? (
                      <span className="text-green-600 font-semibold">Đang hoạt động</span>
                    ) : (
                      <span className="text-gray-500">Ngưng</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded transition"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded transition"
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  Không có gói pin nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-3/4 max-w-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              {formData.id ? "✏️ Sửa gói pin" : "➕ Thêm gói pin"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Tên gói"
                value={formData.packageName}
                onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                className="border px-3 py-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Giá"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Loại thời hạn (MONTHLY, YEARLY, PER_USE)"
                value={formData.durationType}
                onChange={(e) => setFormData({ ...formData, durationType: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Giới hạn lượt đổi"
                value={formData.swapLimit}
                onChange={(e) => setFormData({ ...formData, swapLimit: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="date"
                placeholder="Ngày bắt đầu"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="date"
                placeholder="Ngày kết thúc"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <textarea
                placeholder="Mô tả"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border px-3 py-2 rounded col-span-2"
              />
              <div className="col-span-2 flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Lưu
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
