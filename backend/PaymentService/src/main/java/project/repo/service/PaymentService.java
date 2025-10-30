package project.repo.service;

import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project.repo.repository.InvoiceRepository;
import project.repo.repository.PaymentRepository;
import project.repo.mapper.PaymentMapper;
import project.repo.dtos.PaymentDto;
import project.repo.entity.Invoice;
import project.repo.entity.Payment;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
  private final PaymentRepository paymentRepository;
  private final InvoiceRepository invoiceRepository;
  private final PaymentMapper paymentMapper;
  public List<PaymentDto> getAllPayments() {
    return paymentRepository.findAll().stream().map(payment -> paymentMapper.toDto(payment)).collect(Collectors.toList());
  }
  public PaymentDto createPayment(PaymentDto dto){
     Payment payment = paymentMapper.toEntity(dto);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        

        
        Payment savedPayment = paymentRepository.save(payment);

        
      

      
        PaymentDto result = paymentMapper.toDto(savedPayment);
        

        return result;
  }
  public List<PaymentDto> getPaymentByUserID(Long userID){
    return paymentRepository.findByUserID(userID).stream().map(payment->paymentMapper.toDto(payment)).collect(Collectors.toList());
  }
  private String generateInvoiceDetails(Payment payment) {
        return String.format("Invoice for Payment #%d - Amount: %d VND - UserID: %d - Date: %s",
                payment.getPaymentID(),
                payment.getAmount(),
                payment.getUserID(),
                payment.getCreatedAt());
    }
  public PaymentDto updatePayment(Long paymentId, PaymentDto dto) {
    // 🔹 Tìm thanh toán theo ID
    Payment existingPayment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + paymentId));

    // 🔹 Cập nhật các trường có thể thay đổi
    if (dto.getAmount() >=0) {
        existingPayment.setAmount(dto.getAmount());
    }
    if (dto.getMethod() != null) {
        existingPayment.setMethod(dto.getMethod());
    }
    if (dto.getStatus() != null) {
        existingPayment.setStatus(dto.getStatus());
    }

    // 🔹 Cập nhật thời gian sửa
    existingPayment.setUpdatedAt(LocalDateTime.now());

    // 🔹 Lưu lại
    Payment updated = paymentRepository.save(existingPayment);

    

    return paymentMapper.toDto(updated);
}
  
}
 
