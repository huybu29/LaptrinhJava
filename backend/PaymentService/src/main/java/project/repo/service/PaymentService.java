package project.repo.service;

import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project.repo.repository.PaymentRepository;
import project.repo.mapper.PaymentMapper;
import project.repo.dtos.PaymentDto;
import java.util.List;
@RestController
@Service
@RequiredArgsConstructor
public class PaymentService {
  private final PaymentRepository paymentRepository;
  private final PaymentMapper paymentMapper;
  public List<PaymentDto> getAllPayments() {
    return paymentRepository.findAll().stream().map(payment -> paymentMapper.toDto(payment)).collect(Collectors.toList());
  }
  public PaymentDto createPayment(PaymentDto dto){
    return paymentMapper.toDto(paymentRepository.save(paymentMapper.toEntity(dto)));
  }
  public List<PaymentDto> getPaymentByUserID(Long userID){
    return paymentRepository.findByUserID(userID).stream().map(payment->paymentMapper.toDto(payment)).collect(Collectors.toList());
  }
}
