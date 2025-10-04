package project.repo.dtos;

import lombok.Data;
import project.repo.entity.Payment.PaymentMethod;
import project.repo.entity.Payment.PaymentStatus;
@Data
public class PaymentDto {
  private Long paymentID;
  private Long userID;
  private Long bookingID;
  private int amount;
  private PaymentStatus status = PaymentStatus.PENDING;
  private PaymentMethod method = PaymentMethod.CREDIT_CARD;
  }

