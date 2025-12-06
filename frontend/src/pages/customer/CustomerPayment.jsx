import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 
import { 
  FiFileText, FiActivity, FiCreditCard, FiCalendar,
  FiMapPin, FiCheckCircle, FiClock, FiX, FiLoader, FiStar, FiMessageSquare
} from 'react-icons/fi';

export default function TransactionHistoryPage() {
  const [filter, setFilter] = useState("ALL"); 
  
  // Modal States
  const [selectedInvoice, setSelectedInvoice] = useState(null); 
  const [reviewModal, setReviewModal] = useState(null); // Lưu object giao dịch đang đánh giá
  
  // Data States
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalSwaps: 0, totalCost: 0, savedCO2: 0, currentPlan: "..." });
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const txRes = await api.get('/payments/me');
        const rawData = txRes.data;

        const mappedTransactions = rawData.map(item => {
            const isSwap = item.bookingID != null;
            const isFreeSwap = isSwap && item.amount === 0;
            
            return {
                // Giữ nguyên các trường cũ
                id: item.invoiceNumber || `INV-${item.paymentID}`,
                rawId: item.paymentID, // Lưu ID gốc để gửi API
                type: isSwap ? 'SWAP' : 'SUBSCRIPTION',
                title: isSwap ? (isFreeSwap ? "Đổi pin (Gói cước)" : "Đổi pin xe điện") : "Thanh toán Gói",
                stationId: item.stationId, // Cần ID trạm để gửi review
                station: isSwap ? `Trạm ID: ${item.stationId}` : null, 
                date: new Date(item.createdAt).toLocaleDateString('vi-VN'),
                time: new Date(item.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}),
                amount: item.amount,
                status: item.status, 
                paymentMethod: item.method || "UNKNOWN",
                isFree: isFreeSwap,
                
                // Thêm cờ đã đánh giá chưa (nếu API có trả về)
                hasReviewed: false // Tạm thời giả định chưa (Cần API check hoặc lưu local)
            };
        });

        // Sort
        mappedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(mappedTransactions);

        // Stats Calc
        const successTx = mappedTransactions.filter(t => t.status === 'COMPLETED');
        const totalCost = successTx.reduce((sum, t) => sum + (t.amount || 0), 0);
        const totalSwaps = successTx.filter(t => t.type === 'SWAP').length;
        const savedCO2 = (totalSwaps * 2.5).toFixed(1);
        const currentPlan = successTx.find(t => t.type === 'SUBSCRIPTION') ? "Đã đăng ký" : "Gói Tiêu Chuẩn"; 

        setStats({ totalCost, totalSwaps, savedCO2, currentPlan });

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const isSuccess = (status) => status === 'SUCCESS' || status === 'COMPLETED';
  const filteredList = transactions.filter(t => filter === "ALL" || t.type === filter);

  // --- HANDLE SUBMIT REVIEW ---
  const handleSubmitReview = async () => {
      if (!reviewModal) return;
      setReviewSubmitting(true);

      try {
          const payload = {
              paymentId: reviewModal.rawId,
              stationId: reviewModal.stationId || 1, // Fallback nếu null
              rating: rating,
              comment: comment
          };
          
          console.log("Gửi Review:", payload);
          
          // Gọi API POST /api/reviews
          await api.post('/reviews', payload);

          alert("Cảm ơn bạn đã đánh giá!");
          setReviewModal(null); // Đóng modal
          setComment(""); // Reset form
          setRating(5);

      } catch (error) {
          console.error("Lỗi gửi đánh giá:", error);
          alert("Không thể gửi đánh giá. Vui lòng thử lại.");
      } finally {
          setReviewSubmitting(false);
      }
  };

  if (loading) return <div className="min-h-screen bg-[#0f1219] flex justify-center items-center text-white"><FiLoader className="animate-spin text-3xl"/></div>;

  return (
    <div className="min-h-screen bg-[#0f1219] text-gray-100 font-sans p-6 md:p-12 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER STATS (Giữ nguyên) */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-6">Quản lý hóa đơn & Chi phí</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#161b26] border border-gray-800 p-6 rounded-2xl flex items-center gap-4">
                <div className="p-4 rounded-full bg-blue-500/10 text-blue-500"><FiCreditCard size={24} /></div>
                <div><p className="text-gray-400 text-sm">Tổng chi tiêu</p><p className="text-2xl font-bold text-white">{formatCurrency(stats.totalCost)}</p></div>
            </div>
            <div className="bg-[#161b26] border border-gray-800 p-6 rounded-2xl flex items-center gap-4">
                <div className="p-4 rounded-full bg-teal-500/10 text-teal-500"><FiActivity size={24} /></div>
                <div><p className="text-gray-400 text-sm">Số lần đổi pin</p><p className="text-2xl font-bold text-white">{stats.totalSwaps} <span className="text-xs text-gray-500">lần</span></p></div>
            </div>
            <div className="bg-[#161b26] border border-gray-800 p-6 rounded-2xl flex items-center gap-4">
                <div className="p-4 rounded-full bg-purple-500/10 text-purple-500"><FiFileText size={24} /></div>
                <div><p className="text-gray-400 text-sm">Gói cước hiện tại</p><p className="text-xl font-bold text-white truncate max-w-[150px]">{stats.currentPlan}</p></div>
            </div>
          </div>
        </div>

        {/* LIST TRANSACTION */}
        <div className="bg-[#161b26] border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
           <div className="p-4 border-b border-gray-800 flex gap-2">
               {['ALL', 'SWAP', 'SUBSCRIPTION'].map(tab => (
                   <button key={tab} onClick={() => setFilter(tab)} className={`px-4 py-2 rounded text-xs font-bold ${filter === tab ? 'bg-blue-600 text-white' : 'bg-[#0f1219] text-gray-400'}`}>
                       {tab === 'ALL' ? 'Tất cả' : tab === 'SWAP' ? 'Lịch sử Đổi pin' : 'Thanh toán Gói'}
                   </button>
               ))}
           </div>

           <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1f2937]/50 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-6">Giao dịch</th>
                  <th className="p-6">Thời gian</th>
                  <th className="p-6">Trạng thái</th>
                  <th className="p-6 text-right">Số tiền</th>
                  <th className="p-6 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {filteredList.length > 0 ? filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1f2937]/30 transition-colors">
                    <td className="p-6">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${item.type === 'SWAP' ? 'bg-teal-500/10 text-teal-500' : 'bg-purple-500/10 text-purple-500'}`}>
                                {item.type === 'SWAP' ? <FiActivity /> : <FiFileText />}
                            </div>
                            <div>
                                <p className="font-semibold text-white">{item.title}</p>
                                {item.station && <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1"><FiMapPin size={10}/> {item.station}</p>}
                                <p className="text-gray-600 text-xs mt-0.5">{item.id}</p>
                            </div>
                        </div>
                    </td>
                    <td className="p-6">
                        <div className="text-gray-300 flex flex-col">
                            <span className="flex items-center gap-1"><FiCalendar size={12}/> {item.date}</span>
                            <span className="flex items-center gap-1 text-gray-500 text-xs mt-1"><FiClock size={12}/> {item.time}</span>
                        </div>
                    </td>
                    <td className="p-6">
                        {isSuccess(item.status) ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                <FiCheckCircle size={10} /> Thành công
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                <FiX size={10} /> {item.status}
                            </span>
                        )}
                    </td>
                    <td className="p-6 text-right">
                        {item.isFree ? (
                            <span className="text-green-400 font-bold text-xs border border-green-500/30 px-2 py-1 rounded bg-green-500/10">MIỄN PHÍ</span>
                        ) : (
                            <span className={`font-bold ${isSuccess(item.status) ? 'text-white' : 'text-gray-500 line-through'}`}>{formatCurrency(item.amount)}</span>
                        )}
                    </td>
                    <td className="p-6 text-center">
                        <div className="flex justify-center gap-2">
                            <button onClick={() => setSelectedInvoice(item)} className="text-gray-400 hover:text-blue-400 p-2 rounded-full bg-gray-800" title="Xem hóa đơn">
                                <FiFileText size={16} />
                            </button>
                            
                            {/* Nút Gửi Đánh Giá (Chỉ hiện với GD Đổi pin thành công) */}
                            {item.type === 'SWAP' && isSuccess(item.status) && (
                                <button 
                                    onClick={() => setReviewModal(item)} 
                                    className="text-yellow-500 hover:text-yellow-400 p-2 rounded-full bg-yellow-500/10 border border-yellow-500/20" 
                                    title="Gửi đánh giá"
                                >
                                    <FiStar size={16} />
                                </button>
                            )}
                        </div>
                    </td>
                  </tr>
                )) : (
                    <tr><td colSpan="5" className="p-12 text-center text-gray-500">Chưa có giao dịch nào.</td></tr>
                )}
              </tbody>
            </table>
           </div>
        </div>

        {/* === MODAL: INVOICE (Chi tiết hóa đơn) === */}
        {selectedInvoice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedInvoice(null)}>
                <div className="bg-[#161b26] w-full max-w-md rounded-2xl border border-gray-700 p-6 animate-fade-in-up" onClick={e => e.stopPropagation()}>
                    <h3 className="text-xl font-bold text-white mb-4">Chi tiết hóa đơn</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex justify-between"><span>Mã GD:</span> <span className="text-white">{selectedInvoice.id}</span></div>
                        <div className="flex justify-between"><span>Dịch vụ:</span> <span className="text-white">{selectedInvoice.title}</span></div>
                        <div className="flex justify-between"><span>Phương thức:</span> <span className="text-white">{selectedInvoice.paymentMethod}</span></div>
                        <div className="flex justify-between border-t border-gray-700 pt-2 font-bold text-lg">
                            <span>Tổng cộng:</span> 
                            <span className="text-blue-400">{selectedInvoice.isFree ? "0 đ (Trừ gói)" : formatCurrency(selectedInvoice.amount)}</span>
                        </div>
                    </div>
                    <button onClick={() => setSelectedInvoice(null)} className="mt-6 w-full bg-gray-700 py-2 rounded text-white hover:bg-gray-600">Đóng</button>
                </div>
            </div>
        )}

        {/* === MODAL: REVIEW (Đánh giá dịch vụ) === */}
        {reviewModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setReviewModal(null)}>
                <div className="bg-[#161b26] w-full max-w-md rounded-2xl border border-yellow-500/30 p-6 animate-fade-in-up shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiMessageSquare size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Đánh giá dịch vụ</h3>
                        <p className="text-gray-400 text-sm mt-1">{reviewModal.title} - {reviewModal.date}</p>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                                key={star}
                                size={32}
                                className={`cursor-pointer transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>

                    {/* Comment Box */}
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn..."
                        className="w-full bg-[#0f1219] border border-gray-700 rounded-xl p-3 text-white text-sm focus:border-yellow-500 outline-none mb-4 h-24 resize-none"
                    />

                    <div className="flex gap-3">
                        <button onClick={() => setReviewModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-300 font-bold hover:bg-gray-800 transition-colors">
                            Bỏ qua
                        </button>
                        <button 
                            onClick={handleSubmitReview} 
                            disabled={reviewSubmitting}
                            className="flex-1 py-2.5 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                        >
                            {reviewSubmitting ? <FiLoader className="animate-spin"/> : "Gửi đánh giá"}
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}