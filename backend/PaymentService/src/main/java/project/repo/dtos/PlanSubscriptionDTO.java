package project.repo.dtos;
import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanSubscriptionDTO {
    
    
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

  

   
    private String name; // Tên gói (VD: Gói Tiết Kiệm)

  
    private String description;

    
    private BigDecimal priceMonthly;
    private BigDecimal priceYearly;

   
    private Integer swapLimit; 

    

    private List<String> features; 

  
    private boolean isActive = true;
}