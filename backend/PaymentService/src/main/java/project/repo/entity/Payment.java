package project.repo.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Payment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long paymentID;
  
  private Long userID;
  private Long bookingID;
  private int amount;
  @Enumerated(EnumType.STRING)
  private PaymentStatus status;
  @Enumerated(EnumType.STRING)
  private PaymentMethod method;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  public enum PaymentMethod {
    CREDIT_CARD, BANK_TRANSFER, CASH,
  }
  public enum PaymentStatus {
    PENDING, COMPLETED, FAILED, REFUNDED
  }
}
