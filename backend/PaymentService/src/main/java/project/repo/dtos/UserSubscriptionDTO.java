package project.repo.dtos;
import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonProperty;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSubscriptionDTO {


    private Long id;

    // --- INPUT (Client gửi lên) ---
    private Long userId;
    private Long planId; // ID gói muốn mua
    private String billingCycle; // "MONTHLY" hoặc "YEARLY"



   
    private LocalDateTime startDate;


    private LocalDateTime endDate;

 
    private String status;


    private int swapsUsed;

 
    private Integer swapLimitSnapshot;
    
  
    private BigDecimal purchasePrice;
}