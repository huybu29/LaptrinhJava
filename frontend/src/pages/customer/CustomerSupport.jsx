import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { 
  FaStar, 
  FaUpload, 
  FaCheckCircle, 
  FaSpinner, 
  FaTimesCircle 
} from "react-icons/fa";

// === COMPONENT MỚI: SAO ĐÁNH GIÁ ===
const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex justify-center gap-2 my-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={28}
          className={`cursor-pointer ${
            rating >= star ? "text-yellow-400" : "text-gray-600"
          }`}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
};

// === COMPONENT MỚI: LỊCH SỬ TICKET ===
const TicketItem = ({ ticket }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "RESOLVED":
        return <FaCheckCircle className="text-green-500" />;
      case "IN_PROGRESS":
        return <FaSpinner className="text-blue-500 animate-spin" />;
      case "CLOSED":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaSpinner className="text-yellow-500" />; // OPEN
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "RESOLVED": return "Đã giải quyết";
      case "IN_PROGRESS": return "Đang xử lý";
      case "CLOSED": return "Đã đóng";
      default: return "Đang chờ"; // OPEN
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
      <div className="text-xl">{getStatusIcon(ticket.status)}</div>
      <div className="flex-1">
        <p className="font-semibold text-white">{ticket.issueType || ticket.subject}</p>
        <p className="text-sm text-gray-400">
          Mã #{ticket.id} - {new Date(ticket.createdAt).toLocaleDateString("vi-VN")}
        </p>
      </div>
      <span className="text-sm font-medium text-gray-300">{getStatusText(ticket.status)}</span>
    </div>
  );
};


// === COMPONENT TRANG CHÍNH ===
const CustomerSupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    issueType: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  
  // State mới cho đánh giá
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");

  const userId = localStorage.getItem("userId");

  // 🔹 Lấy dữ liệu ticket đã gửi
  const fetchData = async () => {
    setLoading(true);
    try {
      // Sửa lại: Gọi API /tickets/me
      const ticketsRes = await api.get("/tickets/me"); 
      setTickets(ticketsRes.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Gửi ticket mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.issueType || !form.description) {
        alert("Vui lòng chọn loại sự cố và nhập mô tả.");
        return;
    }
    
    try {
      const payload = {
        ...form,
        userId,
        status: "OPEN",
        // Chuyển 'subject' thành 'issueType'
      };

      // TODO: Xử lý logic upload file (cần FormData)
      
      await api.post("/tickets", payload);
      alert("✅ Gửi yêu cầu thành công!");
      setForm({ issueType: "", description: "" });
      setFile(null);
      fetchData(); // Tải lại danh sách
    } catch (err) {
      console.error("Lỗi khi gửi ticket:", err);
      alert("❌ Gửi ticket thất bại");
    }
  };

  // 🔹 Gửi đánh giá (Mock)
  const handleRatingSubmit = (e) => {
    e.preventDefault();
    alert("Cảm ơn bạn đã đánh giá!");
    setRating(0);
    setRatingComment("");
    // api.post("/ratings", { rating, comment: ratingComment });
  };

  return (
    <div className="bg-gray-950 min-h-screen text-gray-200 py-10 px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Hỗ Trợ & Phản Hồi
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* === CỘT TRÁI: FORM HỖ TRỢ === */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-white mb-2">Bạn cần hỗ trợ?</h2>
              <p className="text-gray-400 mb-6">
                Điền vào biểu mẫu dưới đây để gửi yêu cầu hỗ trợ. Chúng tôi sẽ liên hệ lại
                với bạn sớm nhất có thể.
              </p>

              {/* Chọn loại sự cố */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Chọn loại sự cố
                </label>
                <select
                  value={form.issueType}
                  onChange={(e) =>
                    setForm({ ...form, issueType: e.target.value })
                  }
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">-- Chọn sự cố --</option>
                  <option value="Sự cố Pin">Sự cố Pin (vd: Sạc không vào, lỗi pin)</option>
                  <option value="Sự cố Trạm">Sự cố Trạm (vd: Không kết nối, hỏng hóc)</option>
                  <option value="Vấn đề Thanh toán">Vấn đề Thanh toán</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              {/* Mô tả chi tiết */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mô tả chi tiết
                </label>
                <textarea
                  rows="5"
                  placeholder="Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                ></textarea>
              </div>

              {/* Đính kèm hình ảnh */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Đính kèm hình ảnh (nếu có)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-500" />
                    <div className="flex text-sm text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none"
                      >
                        <span>Nhấn để tải lên</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" 
                               onChange={(e) => setFile(e.target.files[0])} />
                      </label>
                      <p className="pl-1">hoặc kéo thả</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {file ? file.name : "PNG, JPG, GIF (MAX. 5MB)"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="text-left">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg transition"
                >
                  Gửi Yêu Cầu Hỗ Trợ
                </button>
              </div>
            </form>
          </div>

          {/* === CỘT PHẢI: WIDGETS === */}
          <div className="lg:col-span-1 space-y-8">
            {/* Hotline */}
            <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-2xl p-6 text-center">
              <span className="text-sm font-semibold text-red-400">SOS</span>
              <h3 className="text-xl font-bold text-white mt-2">Cần hỗ trợ ngay?</h3>
              <p className="text-gray-300 mt-1">Gọi Hotline:</p>
              <p className="text-2xl font-bold text-white mt-1">1900 1234</p>
            </div>

            {/* Đánh giá */}
            <form 
                onSubmit={handleRatingSubmit}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                Đánh giá dịch vụ
              </h3>
              <p className="text-gray-400 mb-3">
                Chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện.
              </p>
              <StarRating rating={rating} setRating={setRating} />
              <textarea
                rows="3"
                placeholder="Viết phản hồi của bạn..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
              <button
                type="submit"
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
              >
                Gửi Đánh Giá
              </button>
            </form>

            {/* Lịch sử ticket */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Lịch sử yêu cầu của bạn
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {loading && <p className="text-gray-400">Đang tải...</p>}
                {!loading && tickets.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Bạn chưa gửi ticket nào.
                  </p>
                ) : (
                  tickets.map((t) => (
                    <TicketItem key={t.id} ticket={t} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportPage;