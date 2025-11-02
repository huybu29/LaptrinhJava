package project.repo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "batteries")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Battery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String batteryCode;
    private float soh; // State of Health (%)
    
    @Column(name = "charge_cycles")
    @Builder.Default
    private Integer chargeCycles = 0;
    
    @Column(name = "max_charge_cycles")
    @Builder.Default
    private Integer maxChargeCycles = 2000;
    
    private Float capacityKwh;
    private Long stationId;
    
    @Column(name = "vehicle_id")
    private Long vehicleId; // null nếu không gắn vào xe
    
    @Enumerated(EnumType.STRING)
    private BatteryStatus status;
    
    private LocalDateTime lastUsedAt;
    private LocalDateTime lastChargedAt;
    
    public enum BatteryStatus {
        AVAILABLE, IN_USE, CHARGING, MAINTENANCE
    }
    
    // Kiểm tra pin có sẵn sàng để sử dụng không
    public boolean isAvailableForUse() {
        return status == BatteryStatus.AVAILABLE && 
               chargeCycles < maxChargeCycles && 
               soh >= 70.0f; // SOH tối thiểu 70%
    }
    
    // Tăng chu kỳ sạc và kiểm tra ngưỡng
    public void incrementChargeCycle() {
        this.chargeCycles++;
        if (this.chargeCycles >= this.maxChargeCycles) {
            this.status = BatteryStatus.MAINTENANCE;
        }
    }
}