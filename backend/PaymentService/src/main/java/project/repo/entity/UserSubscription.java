package project.repo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    private Long userId;

    
    private Long planId;

    // Chu kỳ thanh toán (MONTHLY, YEARLY)
    @Enumerated(EnumType.STRING)
    private BillingCycle billingCycle;

    // Thời gian hiệu lực
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    // Trạng thái: ACTIVE, EXPIRED, CANCELLED, PENDING_PAYMENT
    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status;

    // Số lần đổi pin ĐÃ SỬ DỤNG trong chu kỳ này
    @Builder.Default
    private int swapsUsed = 0;

    // Giới hạn số lần đổi (Snapshot từ Plan lúc mua để tránh Plan gốc thay đổi)
    private Integer swapLimitSnapshot;


    private boolean autoRenewal = true;

   
    private BigDecimal purchasePrice;
    
    // --- Enums ---
    public enum BillingCycle { MONTHLY, YEARLY }
    public enum SubscriptionStatus { ACTIVE, EXPIRED, CANCELLED, PENDING_PAYMENT }
}