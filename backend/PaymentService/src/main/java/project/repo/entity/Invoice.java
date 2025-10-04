package project.repo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.GenerationType;
import java.time.LocalDateTime;
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Invoice {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long invoiceID;
  private Long paymentID;
  private String details;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

}
