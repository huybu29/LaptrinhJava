import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  IoArrowBack,
  IoCalendarClearOutline,
  IoFlashOutline,
  IoWalletOutline,
  IoCardOutline,
  IoQrCodeOutline,
} from "react-icons/io5";
import { MdPlace } from "react-icons/md";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Component tùy chọn thanh toán (Mô phỏng)
const PaymentMethodOption = ({ label, icon, selected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`flex items-center gap-3 p-3 rounded-lg text-left w-full border-2 transition-all ${
      selected
        ? "border-blue-500 bg-gray-700 ring-2 ring-blue-500"
        : "border-gray-600 bg-gray-800 hover:bg-gray-700"
    }`}
  >
    {icon}
    <span className="font-semibold text-white">{label}</span>
    <div
      className={`w-5 h-5 rounded-full ml-auto border-2 flex items-center justify-center ${
        selected ? "border-blue-500" : "border-gray-400"
      }`}
    >
      {selected && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
    </div>
  </button>
);


const PaymentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");

  useEffect(() => {
    const fetchPaymentDetail = async () => {
      try {
        const res = await api.get(`/payments/${id}`);
        setPayment(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết thanh toán:", err);
        alert("Không tìm thấy giao dịch");
        navigate("/payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentDetail();
  }, [id, navigate]);

  
  const handlePayment = async () => {
    setIsProcessing(true);

    // Payload (DTO) để gửi lên backend
    const payload = {
      method: paymentMethod.toUpperCase(), 
      status: "COMPLETED", 
    };

    try {
      console.log("Gửi payload thanh toán:", payload);
      await api.put(`/payments/${payment.paymentID}`, payload);

      // Giả sử DTO của bạn có 'amount'
      alert(`✅ Thanh toán thành công cho ${formatCurrency(payment.amount)}!`);
      navigate("/payments");

    } catch (err) {
      console.error("Lỗi khi xử lý thanh toán:", err);
      
      let errorMessage = "❌ Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.";
      // Lấy lỗi cụ thể từ backend (nếu có)
      if (err.response && err.response.data) {
          // 'message' là trường phổ biến từ @RestControllerAdvice
          errorMessage = `❌ Lỗi: ${err.response.data.message || err.response.data}`;
      }
      
      alert(errorMessage);
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-300 bg-[#1F2F37]">
        Đang tải chi tiết...
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-300 bg-[#1F2937]">
        Không tìm thấy giao dịch.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-sans">
      {/* Khu vực nội dung chính (Chi tiết) */}
      <div className="flex-1 bg-[#1F2937] text-white p-8 overflow-y-auto">
        <button
          onClick={() => navigate("/payments")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <IoArrowBack />
          Quay lại danh sách
        </button>

        <h1 className="text-3xl font-bold mb-6">Chi tiết giao dịch</h1>

        {/* Thẻ (card) thông tin chi tiết */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Thông tin hóa đơn</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Trạm</span>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <IoFlashOutline className="text-blue-400" />
                {/* Giả định DTO của bạn được làm giàu với stationName */}
                <span>{payment.stationName || "Trạm đổi pin"}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Địa chỉ</span>
              <span className="text-right text-gray-200">
                {payment.stationAddress || "Không rõ địa chỉ"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Ngày</span>
              <span className="text-right text-gray-200">
                {/* Giả định DTO có appointmentDate hoặc createdAt */}
                {new Date(payment.appointmentDate || payment.createdAt).toLocaleString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng thông tin thanh toán & xác nhận bên phải */}
      <div className="w-full lg:w-1/3 bg-[#2A3748] text-white p-6 lg:p-8 flex flex-col justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6">Payment & Confirmation</h2>
          
          {/* Chi tiết phí */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-200">
              <span>Phí dịch vụ</span>
              <span>{formatCurrency(payment.amount || 0)}</span>
            </div>
            <div className="flex justify-between text-gray-200">
              <span>Phụ phí</span>
              <span>{formatCurrency(0)}</span>
            </div>
            <hr className="border-gray-600" />
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total</span>
              <span className="text-2xl text-blue-400">{formatCurrency(payment.amount || 0)}</span>
            </div>
          </div>

          {/* Phương thức Thanh toán */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
            <div className="space-y-3 mb-4">
              <PaymentMethodOption 
                label="Bank Transfer / QR"
                icon={<IoQrCodeOutline size={24} className="text-blue-400" />}
                selected={paymentMethod === 'QR'}
                onSelect={() => setPaymentMethod('QR')}
              />
              <PaymentMethodOption 
                label="Credit/Debit Card"
                icon={<IoCardOutline size={24} className="text-yellow-400" />}
                selected={paymentMethod === 'Card'}
                onSelect={() => setPaymentMethod('Card')}
              />
            </div>
            
            {/* Hiển thị QR hoặc Form thẻ (Nơi tích hợp cổng thanh toán) */}
            <div className="text-center p-4 bg-gray-900 rounded-lg min-h-[150px] flex items-center justify-center">
              <p className="text-gray-300">
                {paymentMethod === 'QR' 
                  ? "Mã QR thanh toán sẽ hiển thị ở đây" 
                  : "Form nhập thông tin thẻ sẽ ở đây"}
              </p>
              {/*  */}
            </div>
          </div>
        </div>
        
        {/* Nút hành động */}
        <div className="mt-8 space-y-3">
          <button
            onClick={handlePayment}
            disabled={isProcessing || payment.status !== 'PENDING'}
            className="w-full px-4 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-md disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isProcessing 
              ? "Processing..." 
              : payment.status === 'PENDING' 
                ? "Complete Payment"
                : `Payment ${payment.status}`
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailPage;