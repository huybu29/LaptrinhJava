import React, { useContext, useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { AuthContext } from "../../services/AuthContext";

/* ======= UI helpers ======= */
const StatusBadge = ({ value }) => {
  const cls =
    value === "PENDING" ? "text-gray-700 bg-gray-100" :
    value === "CONFIRMED" ? "text-blue-700 bg-blue-100" :
    value === "IN_PROGRESS" ? "text-yellow-700 bg-yellow-100" :
    value === "COMPLETED" ? "text-green-700 bg-green-100" :
    "text-red-700 bg-red-100";
  return <span className={`px-2 py-1 rounded text-xs font-semibold ${cls}`}>{value}</span>;
};

/* ======= Rules ======= */
// Bước kế tiếp tuyến tính (dùng cho nút nhanh nếu bạn muốn giữ)
const NEXT_STATUS = {
  PENDING: "CONFIRMED",
  CONFIRMED: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
  COMPLETED: null,
  CANCELED: null
};

// Cho phép chọn trong modal: bước kế tiếp + CANCELED nếu chưa hoàn tất
const FLOW = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED"];
const allowedTargets = (cur) => {
  const idx = FLOW.indexOf(cur);
  const next = idx >= 0 && idx < FLOW.length - 1 ? [FLOW[idx + 1]] : [];
  if (cur !== "COMPLETED" && cur !== "CANCELED") next.push("CANCELED");
  return next;
};

// Build payload đầy đủ để tránh validation fail (đổi đúng field theo backend bạn)
const buildAppointmentPayload = (a, nextStatus) => ({
  id: a.id,
  appointmentDate: a.appointmentDate ? new Date(a.appointmentDate).toISOString() : null,
  serviceType: a.serviceType && a.serviceType !== "-" ? a.serviceType : "BATTERY_REPLACEMENT",
  status: nextStatus,
  notes: a.notes || "",
  customerId: Number(a.customerId),
  vehicleId: Number(a.vehicleId),
  serviceCenterId: Number(a.serviceCenterId),
  estimatedCost: a.estimatedCost ?? 0
});

/* ======= Component ======= */
const StaffBookingService = () => {
  const { user } = useContext(AuthContext);
  const stationId = user?.stationId;

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);     // record hiện tại
  const [statusDraft, setStatusDraft] = useState(""); // draft trạng thái trong modal
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Lấy danh sách (toàn hệ thống) rồi lọc theo trạm của staff
  const fetchAppointments = async () => {
    if (!stationId) return;
    try {
      setLoading(true);
      setErr("");
      const res = await api.get("/appointments");
      const all = Array.isArray(res.data) ? res.data : [];
      const mine = all.filter((a) => Number(a.serviceCenterId) === Number(stationId));
      setAppointments(mine);
      setFilteredAppointments(mine);
    } catch (error) {
      console.error("Lỗi khi tải danh sách lịch hẹn:", error);
      setErr("Không thể tải danh sách lịch hẹn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationId]);

  // Filter tìm kiếm (giống Admin, nhưng chỉ trên dữ liệu trạm mình)
  useEffect(() => {
    const q = (search || "").toLowerCase();
    setFilteredAppointments(
      appointments.filter(
        (a) =>
          (a.notes || "").toLowerCase().includes(q) ||
          (a.serviceType || "").toLowerCase().includes(q) ||
          (a.status || "").toLowerCase().includes(q) ||
          String(a.customerId || "").includes(search) ||
          String(a.vehicleId || "").includes(search)
      )
    );
  }, [search, appointments]);

  const getNextStatus = (status) => NEXT_STATUS[status] ?? null;
  const canAdvance = (a) =>
    Number(a.serviceCenterId) === Number(stationId) && !!getNextStatus(a.status);

  // (Tuỳ chọn) nút đổi nhanh ngay trong bảng – nếu không muốn, xóa cả cột "Cập nhật"
  const quickAdvance = async (a) => {
    const next = getNextStatus(a.status);
    if (!next) return;
    try {
      const payload = buildAppointmentPayload(a, next);
      await api.put(`/appointments/${a.id}`, payload);
      fetchAppointments();
    } catch (e) {
      console.error("PUT /appointments error:", e?.response || e);
      alert("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
    }
  };

  const openModal = (a) => {
    setSelected(a);
    setStatusDraft(a?.status || "PENDING");
    setShowModal(true);
  };

  // Lưu trạng thái từ modal
  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selected) return;
    const allowed = allowedTargets(selected.status);
    if (!allowed.includes(statusDraft) || statusDraft === selected.status) {
      alert("Trạng thái không hợp lệ hoặc trùng với hiện tại.");
      return;
    }
    try {
      const payload = buildAppointmentPayload(selected, statusDraft);
      await api.put(`/appointments/${selected.id}`, payload);
      setShowModal(false);
      setSelected(null);
      setStatusDraft("");
      fetchAppointments();
    } catch (error) {
      console.error("PUT /appointments error:", error?.response || error);
      alert("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
    }
  };

  if (!stationId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
        Không xác định được <b>stationId</b> của nhân viên. Hãy đảm bảo <code>user</code> có trường <code>stationId</code>.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">📅 Lịch hẹn trạm (Staff)</h2>
      <p className="text-gray-600 mb-4">
        Chỉ quản lý lịch hẹn của trạm <span className="font-semibold">{stationId}</span>. Staff chỉ được đổi trạng thái theo thứ tự tiến; có thể <b>CANCELED</b> trước khi hoàn tất.
      </p>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo dịch vụ, trạng thái, ghi chú, customerId, vehicleId..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
        />
        {/* Staff: không có nút Thêm lịch hẹn */}
        <button
          onClick={fetchAppointments}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
        >
          🔄 Làm mới
        </button>
      </div>

      {err && (
        <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded">
          {err}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Ngày hẹn</th>
              <th className="px-4 py-2">Dịch vụ</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2">Ghi chú</th>
              <th className="px-4 py-2">Khách hàng</th>
              <th className="px-4 py-2">Xe</th>
              <th className="px-4 py-2">Trung tâm</th>
              <th className="px-4 py-2 text-center">Cập nhật</th>
              <th className="px-4 py-2 text-center">Xem/Sửa</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map((a, idx) => {
                const next = getNextStatus(a.status);
                const disabled = !canAdvance(a);
                return (
                  <tr key={a.id} className="border-t hover:bg-blue-50 transition">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">
                      {a.appointmentDate
                        ? new Date(a.appointmentDate).toLocaleString("vi-VN")
                        : "-"}
                    </td>
                    <td className="px-4 py-2">{a.serviceType || "-"}</td>
                    <td className="px-4 py-2"><StatusBadge value={a.status || "PENDING"} /></td>
                    <td className="px-4 py-2">{a.notes || "-"}</td>
                    <td className="px-4 py-2">{a.customerId}</td>
                    <td className="px-4 py-2">{a.vehicleId}</td>
                    <td className="px-4 py-2">{a.serviceCenterId}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => quickAdvance(a)}
                        disabled={disabled}
                        className={`px-3 py-1 rounded ${disabled ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-100 hover:bg-blue-200"}`}
                        title={next ? `Chuyển trạng thái sang ${next}` : "Không thể cập nhật thêm"}
                      >
                        {next ? `➡️ ${next}` : "—"}
                      </button>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => openModal(a)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition"
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4 text-gray-500">
                  Không có lịch hẹn nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal (chỉ cho sửa trạng thái; các trường khác read-only) */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-2/3">
            <h3 className="text-xl font-bold mb-4">Chi tiết lịch hẹn (Sửa trạng thái)</h3>
            <form onSubmit={handleSaveStatus} className="grid grid-cols-2 gap-4">
              <input
                readOnly
                value={
                  selected.appointmentDate
                    ? new Date(selected.appointmentDate).toLocaleString("vi-VN")
                    : "-"
                }
                className="border px-3 py-2 rounded bg-gray-100"
              />

              <input
                readOnly
                value={selected.serviceType || "-"}
                className="border px-3 py-2 rounded bg-gray-100"
              />

              {/* CHỈ PHẦN NÀY CHO PHÉP SỬA */}
              <select
                value={statusDraft}
                onChange={(e) => setStatusDraft(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value={selected.status} disabled>
                  {selected.status} (hiện tại)
                </option>
                {allowedTargets(selected.status).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {/* HẾT PHẦN SỬA */}

              <input
                readOnly
                value={selected.notes || "-"}
                className="border px-3 py-2 rounded bg-gray-100"
              />
              <input
                readOnly
                value={selected.customerId ?? "-"}
                className="border px-3 py-2 rounded bg-gray-100"
              />
              <input
                readOnly
                value={selected.vehicleId ?? "-"}
                className="border px-3 py-2 rounded bg-gray-100"
              />
              <input
                readOnly
                value={selected.serviceCenterId ?? "-"}
                className="border px-3 py-2 rounded bg-gray-100 col-span-2"
              />

              <div className="col-span-2 flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setSelected(null); setStatusDraft(""); }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={allowedTargets(selected.status).length === 0}
                  className={`px-4 py-2 text-white rounded ${
                    allowedTargets(selected.status).length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  Lưu
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              * Chỉ cho phép đổi trạng thái theo thứ tự tiến; có thể <b>CANCELED</b> trước khi hoàn tất.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffBookingService;
