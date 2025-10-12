package project.repo.dtos;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class InvoiceDto {
  private Long invoiceID;
  private Long paymentID;
  private String details;
  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime updatedAt= LocalDateTime.now();
  
}