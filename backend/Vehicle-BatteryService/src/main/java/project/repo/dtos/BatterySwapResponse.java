package project.repo.dtos;
import lombok.Data;

import java.time.LocalDateTime;
import lombok.Builder;

@Data
@Builder

public class BatterySwapResponse {
    private Boolean success;
    private String message;
    private Long oldBatteryId;
    private Long newBatteryId;
    private LocalDateTime swapTime;
}
