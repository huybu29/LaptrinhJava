import React, { useEffect, useState } from "react";
import api from "../../services/api";

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [note, setNote] = useState("");
  const userId = localStorage.getItem("userId");

  // 🔹 Lấy danh sách payment của user
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/payments/me`);
      console.log(res.data)
      const pending = res.data.filter((p) => p.status === "PENDING");
      setPayments(pending);
    } catch (err) {
      console.error("Lỗi khi tải danh sách payment:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // 🔹 Mở form thanh toán
  const openPaymentForm = (payment) => {
    setSelectedPayment(payment);
    setPaymentMethod("CASH");
    setNote("");
  };

  // 🔹 Xử lý xác nhận thanh toán
  const confirmPayment = async () => {
    if (!selectedPayment) return;
    if (!window.confirm(`Xác nhận thanh toán đơn #${selectedPayment.paymentID}?`)) return;

    try {
      await api.put(
        `/payments/${selectedPayment.paymentID}`,
        { status: "COMPLETED", method: paymentMethod, note }
      );

      alert("✅ Thanh toán thành công!");
      setSelectedPayment(null);
      fetchPayments();
    } catch (err) {
      console.error("Lỗi khi thanh toán:", err);
      alert("❌ Thanh toán thất bại");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-grey mb-6">💳 Thanh toán dịch vụ</h1>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : payments.length === 0 ? (
        <p>Không có thanh toán nào cần xử lý.</p>
      ) : (
        <table className="w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Mã thanh toán</th>
              <th className="p-3">Booking</th>
              <th className="p-3">Số tiền</th>
              <th className="p-3">Phương thức</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Ngày tạo</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.paymentID} className="border-t">
                <td className="p-3 font-medium">#{p.paymentID}</td>
                <td className="p-3">{p.bookingID}</td>
                <td className="p-3">{p.amount.toLocaleString()} ₫</td>
                <td className="p-3">{p.method}</td>
                <td className="p-3 capitalize">{p.status}</td>
                <td className="p-3">{new Date(p.createdAt).toLocaleString("vi-VN")}</td>
                <td className="p-3">
                  {p.status === "PENDING" ? (
                    <button
                      onClick={() => openPaymentForm(p)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      Thanh toán
                    </button>
                  ) : (
                    <span className="text-gray-500">Đã thanh toán</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🔹 Modal thanh toán */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              💰 Xác nhận thanh toán #{selectedPayment.paymentID}
            </h2>

            <p className="mb-2">
              <strong>Số tiền:</strong>{" "}
              {selectedPayment.amount.toLocaleString()} ₫
            </p>

            <label className="block mt-3 text-gray-700 font-medium">
              Phương thức thanh toán:
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full mt-1"
            >
              <option value="CASH">Tiền mặt</option>
              <option value="CREDIT_CARD">Thẻ tín dụng</option>
              <option value="BANK_TRANSFER">Chuyển khoản</option>
            </select>

            <label className="block mt-3 text-gray-700 font-medium">
              Ghi chú:
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full mt-1"
              placeholder="Nhập ghi chú (nếu có)..."
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={confirmPayment}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
