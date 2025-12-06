package project.repo.dtos;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@Builder
public class BatterySwapDTO {
    private Long id;
    private Long vehicleId;
    private Long oldBatteryId;
    private Long newBatteryId;
    private Long stationId;
    private Long staffId;
    private Long userId;
    private Long appointmentId;
    private LocalDateTime swapTime;
    private Long paymentId;
    private String notes;
}
