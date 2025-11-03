package project.repo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project.repo.repository.PaymentRepository;
import project.repo.mapper.PaymentMapper;
import project.repo.dtos.PaymentDto;
import project.repo.entity.Payment;
import project.repo.clients.BookingClient;
import project.repo.dtos.AppointmentDTO;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;

    @Autowired
    private BookingClient bookingClient;

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

        if (paymentRepository.existsById(bookingId)) {
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

        if (existing.getStatus() == Payment.PaymentStatus.COMPLETED) {
            throw new IllegalStateException("Không thể chỉnh sửa Payment đã COMPLETED.");
        }

        if (dto.getAmount() != null && dto.getAmount() > 0)
            existing.setAmount(dto.getAmount());

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

    private String generateInvoiceNumber(Long appointmentId) {
        return String.format("INV-%d-%s", appointmentId, LocalDateTime.now().toLocalDate());
    }

    private String generateInvoiceDetails(Payment payment) {
        return String.format("Invoice for Payment #%d - Amount: %d VND - UserID: %d - Date: %s",
                payment.getPaymentID(),
                payment.getAmount(),
                payment.getUserID(),
                payment.getCreatedAt());
    }
}
