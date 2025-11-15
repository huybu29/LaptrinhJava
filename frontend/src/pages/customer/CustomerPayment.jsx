import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  IoWalletOutline,
  IoCalendarClearOutline,
  IoFlashOutline,
  IoCheckmarkCircle,
} from "react-icons/io5"; // Thêm icon
import { MdPlace } from "react-icons/md";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// === TÁCH RA COMPONENT ITEM ĐỂ DỄ QUẢN LÝ ===
const PaymentItem = ({ payment, isPending = false }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-gray-800 p-5 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border ${
        isPending ? "border-yellow-600" : "border-gray-700"
      }`}
    >
      {/* Thông tin */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <IoFlashOutline className={isPending ? "text-yellow-400" : "text-blue-400"} />
          <span>{payment.stationName || "Trạm đổi pin"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <MdPlace />
          <span>{payment.stationAddress || "Không rõ địa chỉ"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <IoCalendarClearOutline />
          <span>
            Ngày: {new Date(payment.appointmentDate || payment.createdAt).toLocaleString("vi-VN")}
          </span>
        </div>
      </div>

      {/* Nút bấm hoặc Trạng thái */}
      <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto mt-4 sm:mt-0">
        <span className="text-2xl font-bold text-green-400">
          {formatCurrency(payment.amount || 0)}
        </span>

        {isPending ? (
          <button
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
            // Sửa route: dùng /payment/ thay vì /driver/payment/
            onClick={() => navigate(`/payment/${payment.paymentID}`)}
          >
            Thanh toán
          </button>
        ) : (
          <span className="flex items-center gap-2 px-4 py-2 bg-green-800 text-green-300 font-medium rounded-lg">
            <IoCheckmarkCircle />
            Đã hoàn thành
          </span>
        )}
      </div>
    </div>
  );
};

// === COMPONENT TRANG CHÍNH ===
const PaymentPage = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [completedPayments, setCompletedPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPayments = async () => {
      setLoading(true);
      try {
        const res = await api.get("/payments/me");
        
        // Lọc ra 2 danh sách
        const allPayments = res.data;
        const pending = allPayments.filter(p => p.status === "PENDING" || p.status === "UNPAID");
        const completed = allPayments.filter(p => p.status === "COMPLETED");

        setPendingPayments(pending);
        setCompletedPayments(completed);

      } catch (err) {
        console.error("Lỗi khi tải dữ liệu thanh toán:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPayments();
  }, []); // Bỏ 'navigate' khỏi dependency vì nó không thay đổi

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-300 bg-gray-950">
        Đang tải dữ liệu thanh toán...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-6 lg:p-10">
      <h1 className="text-3xl font-bold mb-8">💳 Giao dịch</h1>

      {pendingPayments.length === 0 && completedPayments.length === 0 ? (
        // Trường hợp không có giao dịch nào
        <div className="text-center text-gray-400 p-10 bg-gray-800 rounded-lg shadow-inner">
          <IoWalletOutline size={48} className="mx-auto mb-4" />
          <p className="text-lg">Không có giao dịch</p>
          <p>Bạn chưa có bất kỳ giao dịch nào.</p>
        </div>
      ) : (
        // Hiển thị 2 danh sách
        <div className="space-y-12">
          
          {/* 1. Giao dịch đang chờ */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">
              Giao dịch đang chờ
            </h2>
            {pendingPayments.length === 0 ? (
              <p className="text-gray-400 p-5 bg-gray-800 rounded-lg">
                Tuyệt vời! Bạn không có giao dịch nào cần thanh toán.
              </p>
            ) : (
              <div className="space-y-4">
                {pendingPayments.map((payment) => (
                  <PaymentItem key={payment.paymentID} payment={payment} isPending={true} />
                ))}
              </div>
            )}
          </section>

          {/* 2. Lịch sử giao dịch */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-green-400">
              Lịch sử giao dịch
            </h2>
            {completedPayments.length === 0 ? (
              <p className="text-gray-400 p-5 bg-gray-800 rounded-lg">
                Bạn chưa có giao dịch nào hoàn thành.
              </p>
            ) : (
              <div className="space-y-4">
                {completedPayments.map((payment) => (
                  <PaymentItem key={payment.paymentID} payment={payment} isPending={false} />
                ))}
              </div>
            )}
          </section>

        </div>
      )}
    </div>
  );
};

export default PaymentPage;