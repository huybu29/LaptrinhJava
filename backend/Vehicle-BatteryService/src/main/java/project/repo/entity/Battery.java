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
    
    
}