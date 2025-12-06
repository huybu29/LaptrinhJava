package project.repo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "subscription_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Tên gói (VD: Gói Tiết Kiệm)

    @Column(columnDefinition = "TEXT")
    private String description;

    
    private BigDecimal priceMonthly;
    private BigDecimal priceYearly;

   
    private Integer swapLimit; 

    
  

  
    private boolean isActive = true;
    
 
}