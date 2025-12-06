package project.repo.dtos;

import java.time.LocalDateTime;

import lombok.Data;
import project.repo.entity.Payment.PaymentMethod;
import project.repo.entity.Payment.PaymentStatus;
import java.lang.Integer;
@Data
public class PaymentDto {
  private Long paymentID;
  private Long userID;
  private String invoiceNumber;
  private Long bookingID;
  private Long stationId;
  private Long swapId;
  private Integer amount;
  private String status = PaymentStatus.PENDING.name();
  private String method = PaymentMethod.CREDIT_CARD.name();
  private Long planId; // ID gói muốn mua
    private String billingCycle;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  }

