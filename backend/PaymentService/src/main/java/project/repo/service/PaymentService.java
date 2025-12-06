package project.repo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import project.repo.repository.*;
import project.repo.mapper.PaymentMapper;
import project.repo.dtos.PaymentDto;
import project.repo.entity.*;
import project.repo.clients.BookingClient;
import project.repo.dtos.AppointmentDTO;
import project.repo.dtos.UserSubscriptionDTO;
import project.repo.service.UserSubscriptionService;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final BookingClient bookingClient;
    private final UserSubscriptionService userSubscriptionService;
    private final UserSubscriptionRepository subRepo;
    
    public List<PaymentDto> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(paymentMapper::toDto)
                .collect(Collectors.toList());
    }

    
    public PaymentDto createPayment(Long userId, PaymentDto dto) {
        Long bookingId = dto.getBookingID();
        if (bookingId == null) {
            throw new IllegalArgumentException("❌ Thiếu thông tin bookingId.");
        }

        AppointmentDTO booking = bookingClient.getAppointmentById(bookingId);
        if (booking == null) {
            throw new IllegalArgumentException("❌ Booking không tồn tại.");
        }
        if (!booking.getCustomerId().equals(userId)) {
            throw new SecurityException("❌ Bạn không thể thanh toán cho booking của người khác.");
        }

        if (!"COMPLETED".equalsIgnoreCase(booking.getStatus())) {
            throw new IllegalArgumentException("❌ Chỉ có thể thanh toán khi Booking đã COMPLETED.");
        }

        if (paymentRepository.existsByBookingID(bookingId)) {
            throw new IllegalArgumentException("❌ Booking này đã có payment record.");
        }

        if (dto.getAmount() == null || dto.getAmount() <= 0) {
            throw new IllegalArgumentException("❌ Số tiền thanh toán phải lớn hơn 0.");
        }

        Payment payment = paymentMapper.toEntity(dto);
        payment.setUserID(userId);
        payment.setBookingID(bookingId);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setInvoiceNumber(generateInvoiceNumber(bookingId));

        Payment saved = paymentRepository.save(payment);
        return paymentMapper.toDto(saved);
    }


    public PaymentDto getById(Long paymentID) {
        Payment payment = paymentRepository.findById(paymentID)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + paymentID));
        return paymentMapper.toDto(payment);
    }

    public List<PaymentDto> getPaymentByUserId(Long userId) {
        return paymentRepository.findByUserID(userId)
                .stream()
                .map(paymentMapper::toDto)
                .collect(Collectors.toList());
    }

    
    public PaymentDto updatePayment(Long paymentID, PaymentDto dto) {
        Payment existing = paymentRepository.findById(paymentID)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + paymentID));

        if (existing.getStatus() != Payment.PaymentStatus.PENDING) {
            throw new IllegalStateException("Không thể chỉnh sửa Payment đã ở trạng thái " + existing.getStatus());
        }

        if (dto.getMethod() != null)
            existing.setMethod(Payment.PaymentMethod.valueOf(dto.getMethod().toUpperCase()));

        if (dto.getStatus() != null)
            existing.setStatus(Payment.PaymentStatus.valueOf(dto.getStatus().toUpperCase()));

        existing.setUpdatedAt(LocalDateTime.now());

        Payment updated = paymentRepository.save(existing);
        return paymentMapper.toDto(updated);
    }

    
    public void deletePayment(Long paymentId) {
        Payment existing = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + paymentId));

        if (existing.getStatus() == Payment.PaymentStatus.COMPLETED) {
            throw new IllegalStateException("Không thể xóa Payment đã COMPLETED.");
        }

        paymentRepository.delete(existing);
    }

    private String generateInvoiceNumber(Long bookingId) {
        return String.format("INV-%d-%s", bookingId, System.currentTimeMillis());
    }

    private String generateInvoiceDetails(Payment payment) {
        return String.format("Invoice for Payment #%d - Amount: %d VND - UserID: %d - Date: %s",
                payment.getPaymentID(),
                payment.getAmount(),
                payment.getUserID(),
                payment.getCreatedAt());
    }
    @Transactional // Đảm bảo Payment và Subscription cùng thành công hoặc cùng thất bại
    public PaymentDto payForSubscription(Long userId, PaymentDto dto) {
        // Validation cơ bản
        if (dto.getAmount() == null || dto.getAmount() <= 0) {
            throw new IllegalArgumentException("❌ Số tiền thanh toán phải lớn hơn 0.");
        }
        
        // Lưu ý: DTO truyền vào cần có planId và billingCycle
        if (dto.getPlanId() == null || dto.getBillingCycle() == null) {
             throw new IllegalArgumentException("❌ Thiếu thông tin gói cước hoặc chu kỳ.");
        }

        // BƯỚC 1: TẠO PAYMENT RECORD (TRẠNG THÁI SUCCESS LUÔN)
        Payment payment = new Payment(); // Hoặc dùng mapper nếu DTO khớp
        payment.setUserID(userId);
        payment.setBookingID(null); // Subscription không có bookingID
        payment.setAmount(dto.getAmount());
        
        // Gán phương thức thanh toán (VNPAY, MOMO, CASH...)
        if (dto.getMethod() != null) {
             try {
                payment.setMethod(Payment.PaymentMethod.valueOf(dto.getMethod().toUpperCase()));
             } catch (IllegalArgumentException e) {
                payment.setMethod(Payment.PaymentMethod.BANK_TRANSFER); // Default
             }
        }
        
        // QUAN TRỌNG: Set status là COMPLETED ngay lập tức
        payment.setStatus(Payment.PaymentStatus.COMPLETED); 
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        payment.setInvoiceNumber("SUB-" + userId + "-" + System.currentTimeMillis());

        Payment savedPayment = paymentRepository.save(payment);

        
        UserSubscriptionDTO subDto = UserSubscriptionDTO.builder()
                .userId(userId)
                .planId(dto.getPlanId()) 
                .billingCycle(dto.getBillingCycle()) 
                .build();

        try {
         
            userSubscriptionService.createSubscription(subDto);
        } catch (RuntimeException e) {
           
            throw new RuntimeException("Lỗi kích hoạt gói: " + e.getMessage());
        }

        return paymentMapper.toDto(savedPayment);
    }
    public List<PaymentDto> getPaymentsByStationAndStatus(Long stationId, String statusStr) {
        Payment.PaymentStatus status;
        try {
            status = Payment.PaymentStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + statusStr);
        }

        return paymentRepository.findByStationIdAndStatus(stationId, status)
                .stream()
                .map(paymentMapper::toDto)
                .collect(Collectors.toList());
    }
    @Transactional
    public PaymentDto confirmPayment(PaymentDto req) {
        // 1. Lấy Payment đang chờ
        Payment payment = paymentRepository.findById(req.getPaymentID())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));

        if (payment.getStatus() == Payment.PaymentStatus.COMPLETED) {
            throw new RuntimeException("Hóa đơn này đã thanh toán rồi!");
        }

        // 2. Xử lý theo phương thức thanh toán
        if ("SUBSCRIPTION".equalsIgnoreCase(req.getMethod())) {
            // A. TRỪ GÓI CƯỚC
            UserSubscription sub = subRepo.findByUserIdAndStatus(payment.getUserID(), UserSubscription.SubscriptionStatus.ACTIVE);
                
            
            // Kiểm tra số lượt (nếu có giới hạn)
            if (sub.getSwapLimitSnapshot() != null && sub.getSwapsUsed() >= sub.getSwapLimitSnapshot()) {
                throw new RuntimeException("Gói cước đã hết lượt đổi. Vui lòng chọn thanh toán tiền mặt.");
            }

            // Trừ lượt & Set giá về 0
            sub.setSwapsUsed(sub.getSwapsUsed() + 1);
            subRepo.save(sub);
            
            payment.setAmount(0); // Miễn phí
            payment.setPlanId(sub.getPlanId()); // Ghi nhận dùng gói nào
            payment.setMethod(Payment.PaymentMethod.SUBSCRIPTION); // Cần thêm enum này vào PaymentMethod

        } else {
            // B. THANH TOÁN THƯỜNG (CASH / BANK)
            payment.setMethod(Payment.PaymentMethod.valueOf(req.getMethod()));
            // Giữ nguyên amount
        }

        // 3. Cập nhật Payment -> COMPLETED
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setUpdatedAt(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);

        // 4. Cập nhật Appointment -> COMPLETED thông qua CLIENT
        if (payment.getBookingID() != null) {
            try {
                // Gọi sang Microservice khác
                bookingClient.updateAppointmentStatus(payment.getBookingID(), "COMPLETED");
            } catch (Exception e) {
                // Tùy chọn: Log lỗi nhưng không rollback giao dịch thanh toán (vì tiền đã thu rồi)
                // Hoặc throw exception để rollback cả tiền nếu yêu cầu tính nhất quán cao (Saga pattern)
                throw new RuntimeException("Lỗi cập nhật trạng thái lịch hẹn bên Booking Service: " + e.getMessage());
            }
        }

        return paymentMapper.toDto(savedPayment);
    }
}
