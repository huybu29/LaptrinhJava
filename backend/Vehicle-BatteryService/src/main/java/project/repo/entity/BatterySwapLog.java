package project.repo.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import project.repo.dtos.SwapRequest;
import project.repo.dtos.BatterySwapResponse;

@Table(name = "battery_swap_logs")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BatterySwapLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long vehicleId;
    private Long oldBatteryId;
    private Long newBatteryId;
    private Long stationId;
    
    private LocalDateTime swapTime;
    
    private String notes;
}
