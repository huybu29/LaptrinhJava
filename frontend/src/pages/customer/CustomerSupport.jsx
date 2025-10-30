import React, { useEffect, useState } from "react";
import api from "../../services/api";

const CustomerTicketPage = () => {
  const [stations, setStations] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    stationId: "",
    subject: "",
    description: "",
  });

  const userId = localStorage.getItem("userId");

  // 🔹 Lấy dữ liệu ban đầu
  const fetchData = async () => {
    try {
      const [stationsRes, ticketsRes] = await Promise.all([
        api.get("/stations"),
      
      ]);
      setStations(stationsRes.data);
      console.log(stationsRes.data)
     
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Gửi ticket mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        userId,
        status: "OPEN",
      };

      await api.post("/tickets", payload);
      alert("✅ Gửi ticket thành công!");
      setForm({ stationId: "", subject: "", description: "" });
      fetchData();
    } catch (err) {
      console.error("Lỗi khi gửi ticket:", err);
      alert("❌ Gửi ticket thất bại");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        {/* Header */}
        <div className="mb-8 border-b pb-4 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900">
            🎫 Gửi yêu cầu hỗ trợ
          </h1>
          <span className="text-sm text-gray-500">
            Báo cáo sự cố hoặc yêu cầu hỗ trợ kỹ thuật
          </span>
        </div>

        {/* Form gửi ticket */}
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 mb-10 shadow-sm"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Chọn trạm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏢 Trạm / Trung tâm liên quan
              </label>
              <select
                name="stationId"
                value={form.stationId}
                onChange={(e) =>
                  setForm({ ...form, stationId: e.target.value })
                }
                className="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">-- Chọn trạm --</option>
                {stations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - {s.address}
                  </option>
                ))}
              </select>
            </div>

            {/* Tiêu đề */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🧾 Tiêu đề
              </label>
              <input
                type="text"
                name="subject"
                placeholder="Ví dụ: Sạc chậm, lỗi đổi pin, thanh toán lỗi..."
                value={form.subject}
                onChange={(e) =>
                  setForm({ ...form, subject: e.target.value })
                }
                className="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Nội dung chi tiết */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📝 Mô tả chi tiết vấn đề
            </label>
            <textarea
              name="description"
              rows="5"
              placeholder="Mô tả chi tiết tình huống bạn gặp phải..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            ></textarea>
          </div>

          {/* Submit */}
          <div className="text-right mt-6">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-lg transition"
            >
              🚀 Gửi Ticket
            </button>
          </div>
        </form>

        {/* Danh sách ticket */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📋 Ticket đã gửi
          </h2>

          {tickets.length === 0 ? (
            <p className="text-gray-500 italic">
              Bạn chưa gửi ticket nào.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-gray-200 rounded-xl shadow-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-800">
                    <th className="p-3 text-left">Tiêu đề</th>
                    <th className="p-3 text-left">Trạm</th>
                    <th className="p-3 text-left">Ngày gửi</th>
                    <th className="p-3 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id} className="border-t hover:bg-gray-50 transition">
                      <td className="p-3">{t.subject}</td>
                      <td className="p-3">{t.stationId}</td>
                      <td className="p-3">
                        {new Date(t.createdAt).toLocaleString("vi-VN")}
                      </td>
                      <td className="p-3 font-semibold">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            t.status === "OPEN"
                              ? "bg-yellow-100 text-yellow-700"
                              : t.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-700"
                              : t.status === "RESOLVED"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerTicketPage;
