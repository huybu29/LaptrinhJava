import React, { useContext, useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { AuthContext } from "../../services/AuthContext";

/* ===== Status helpers (forward only) ===== */
const FLOW = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const nextOf = (s) => {
  const i = FLOW.indexOf(s);
  return i >= 0 && i < FLOW.length - 1 ? FLOW[i + 1] : null;
};
const allowedTargets = (current) => {
  const next = nextOf(current);
  return next ? [next] : []; // staff chỉ được chuyển tiến 1 bước
};

const Badge = ({ v }) => {
  const cls =
    v === "OPEN"
      ? "bg-yellow-200 text-yellow-800"
      : v === "IN_PROGRESS"
      ? "bg-blue-200 text-blue-800"
      : v === "RESOLVED"
      ? "bg-green-200 text-green-800"
      : "bg-gray-200 text-gray-800";
  return <span className={`px-2 py-1 rounded text-sm ${cls}`}>{v}</span>;
};

const StaffTicketManagement = () => {
  const { user } = useContext(AuthContext);
  const stationId = user?.stationId;

  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(null); // ticket đang xem/sửa
  const [statusDraft, setStatusDraft] = useState("");

  const fetchTickets = async () => {
    if (!stationId) return;
    try {
      setLoading(true);
      setErr("");
      const res = await api.get("/tickets");
      const all = Array.isArray(res.data) ? res.data : [];
      const mine = all.filter((t) => Number(t.stationId) === Number(stationId));
      setTickets(mine);
    } catch (e) {
      console.error("Lỗi khi tải danh sách ticket:", e);
      setErr("Không thể tải danh sách ticket. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationId]);

  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase();
    return tickets.filter(
      (t) =>
        (t.subject || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        (t.status || "").toLowerCase().includes(q) ||
        String(t.userId || "").includes(search)
    );
  }, [tickets, search]);

  const openModal = (t) => {
    setCurrent(t);
    setStatusDraft(t?.status || "OPEN");
    setShowModal(true);
  };

  const saveStatus = async (e) => {
    e.preventDefault();
    if (!current) return;

    const choices = allowedTargets(current.status);
    if (!choices.includes(statusDraft) || statusDraft === current.status) {
      alert("Trạng thái không hợp lệ hoặc trùng với hiện tại.");
      return;
    }

    try {
      await api.put(`/tickets/${current.id}/status?status=${statusDraft}`);
      setShowModal(false);
      setCurrent(null);
      setStatusDraft("");
      fetchTickets();
    } catch (e) {
      console.error("Lỗi khi cập nhật trạng thái ticket:", e?.response || e);
      alert("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
    }
  };

  if (!stationId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
        Không xác định được <b>stationId</b> của nhân viên. Hãy kiểm tra <code>AuthContext.user.stationId</code>.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">🎫 Ticket hỗ trợ (Staff)</h2>
      <p className="text-gray-600 mb-4">
        Chỉ xem & xử lý ticket thuộc trạm <span className="font-semibold">{stationId}</span>. Staff chỉ được đổi trạng thái theo thứ tự tiến.
      </p>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo tiêu đề, mô tả, trạng thái, userId..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
        />
        <button
          onClick={fetchTickets}
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
              <th className="px-4 py-2">Tiêu đề</th>
              <th className="px-4 py-2">Người dùng</th>
              <th className="px-4 py-2">Trạm</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2">Tạo lúc</th>
              <th className="px-4 py-2 text-center">Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((t, idx) => {
                const next = nextOf(t.status);
                const disabled =
                  Number(t.stationId) !== Number(stationId) || !next;
                return (
                  <tr key={t.id} className="border-t hover:bg-blue-50 transition">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2 font-semibold">{t.subject}</td>
                    <td className="px-4 py-2">{t.userId}</td>
                    <td className="px-4 py-2">{t.stationId}</td>
                    <td className="px-4 py-2">
                      <Badge v={t.status} />
                    </td>
                    <td className="px-4 py-2">
                      {t.createdAt ? new Date(t.createdAt).toLocaleString("vi-VN") : ""}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => openModal(t)}
                        disabled={disabled}
                        className={`px-3 py-1 rounded ${
                          disabled
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-yellow-100 hover:bg-yellow-200"
                        }`}
                        title={next ? `Chuyển sang ${next}` : "Không thể cập nhật"}
                      >
                        ✏️ {next ? `→ ${next}` : "—"}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Không có ticket nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal cập nhật trạng thái (forward only) */}
      {showModal && current && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">
              Cập nhật trạng thái Ticket #{current.id}
            </h3>
            <form onSubmit={saveStatus} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Trạng thái hiện tại</label>
                <input
                  readOnly
                  value={current.status}
                  className="border px-3 py-2 rounded w-full bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Chuyển sang</label>
                <select
                  value={statusDraft}
                  onChange={(e) => setStatusDraft(e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                >
                  {/* giữ nguyên (disable) để hiển thị */}
                  <option value={current.status} disabled>
                    {current.status} (hiện tại)
                  </option>
                  {allowedTargets(current.status).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Flow: OPEN → IN_PROGRESS → RESOLVED → CLOSED (không quay lại).
                </p>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setCurrent(null);
                    setStatusDraft("");
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={allowedTargets(current.status).length === 0}
                  className={`px-4 py-2 text-white rounded ${
                    allowedTargets(current.status).length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffTicketManagement;
