package project.repo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
@Table(name = "battery_swap_logs")
@Data
@AllArgsConstructor @NoArgsConstructor @Builder
public class BatterySwap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long vehicleId;
    private Long oldBatteryId;
    private Long newBatteryId;
    private Long stationId;
    private Long staffId;
    private Long appointmentId;
    private LocalDateTime swapTime;
    private Long paymentId;
   
    private String notes;

    private Long userId; // Quan trọng: Ai swap?
}
