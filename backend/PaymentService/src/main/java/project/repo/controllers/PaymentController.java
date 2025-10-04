package project.repo.controllers;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;
import project.repo.dtos.*;
import project.repo.service.*;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {
  private final PaymentService paymentService;
  @GetMapping("/")
  public List<PaymentDto> getAllPayment() {
      return paymentService.getAllPayments();
  }
  @GetMapping("/{userID}")
  public List<PaymentDto> getPaymentByUserID(@PathVariable Long userID) {
      return paymentService.getPaymentByUserID(userID);
  }

  @PostMapping("/")
  public PaymentDto createPayment(@RequestBody PaymentDto dto) {
    return paymentService.createPayment(dto);
  }
  
}
