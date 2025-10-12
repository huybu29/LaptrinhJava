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
        payment.setStatus(Payment.PaymentStatus.COMPLETED); // MVP giả lập thành công

        
        Payment savedPayment = paymentRepository.save(payment);

        
        Invoice invoice = Invoice.builder()
                .paymentID(savedPayment.getPaymentID())
                .details(generateInvoiceDetails(savedPayment))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        invoiceRepository.save(invoice);

      
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
}
 
